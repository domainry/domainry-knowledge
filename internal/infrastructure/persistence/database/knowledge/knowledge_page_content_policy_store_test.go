package store

import (
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePageContentPolicyInheritanceOverrideCASAndCopyEnforcement(t *testing.T) {
	store, authority, library, parent := pageFixture(t)
	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{
		ClientID: "content-policy-child", ParentPageID: parent.Page.ID, Title: "子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument,
	}, authority)
	if err != nil {
		t.Fatal(err)
	}

	defaults, err := store.KnowledgePageContentPolicy(t.Context(), library.ID, child.Page.ID, authority)
	if err != nil || defaults.Revision != 0 || !defaults.AllowCopy || !defaults.AllowDownload || !defaults.AllowPrint || !defaults.AllowExport || !defaults.AllowDuplicate {
		t.Fatalf("default content policy must allow all product entries: policy=%+v err=%v", defaults, err)
	}

	parentPolicy, err := store.SetKnowledgePageContentPolicy(t.Context(), library.ID, parent.Page.ID, knowledgesdk.KnowledgePageContentPolicyWrite{
		ClientID: "content-policy-parent", ExpectedRevision: 0, Scope: knowledgesdk.KnowledgePageContentPolicySubtree,
		AllowCopy: false, AllowDownload: false, AllowPrint: false, AllowExport: false, AllowDuplicate: false,
		Classification: knowledgesdk.KnowledgePageClassificationConfidential, WatermarkMode: knowledgesdk.KnowledgePageWatermarkIdentity, SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentAllow, RequireApproval: true,
	}, authority)
	if err != nil || parentPolicy.Revision != 1 {
		t.Fatalf("set parent content policy: policy=%+v err=%v", parentPolicy, err)
	}
	for _, operation := range []string{
		knowledgesdk.KnowledgePageContentOperationCopy,
		knowledgesdk.KnowledgePageContentOperationDownload,
		knowledgesdk.KnowledgePageContentOperationPrint,
		knowledgesdk.KnowledgePageContentOperationExport,
		knowledgesdk.KnowledgePageContentOperationDuplicate,
	} {
		decision, evaluateErr := store.EvaluateKnowledgePageContentPolicy(t.Context(), library.ID, child.Page.ID, operation, authority)
		if evaluateErr != nil || decision.Allowed || decision.SourcePageID != parent.Page.ID || decision.Revision != parentPolicy.Revision {
			t.Fatalf("child did not inherit denied %s policy: decision=%+v err=%v", operation, decision, evaluateErr)
		}
	}
	if _, err = store.CopyKnowledgePage(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageCopy{ClientID: "content-policy-copy-denied", Title: "不应创建"}, authority); err == nil || !strings.Contains(err.Error(), "page_content_operation_denied") {
		t.Fatalf("copy bypassed duplicate policy: %v", err)
	}

	childPolicy, err := store.SetKnowledgePageContentPolicy(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageContentPolicyWrite{
		ClientID: "content-policy-child-override", ExpectedRevision: 0, Scope: knowledgesdk.KnowledgePageContentPolicyPage,
		AllowCopy: true, AllowDownload: true, AllowPrint: true, AllowExport: true, AllowDuplicate: true,
		Classification: knowledgesdk.KnowledgePageClassificationInternal, WatermarkMode: knowledgesdk.KnowledgePageWatermarkNone, SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentAllow,
	}, authority)
	if err != nil || childPolicy.Revision != 1 {
		t.Fatalf("set child override: policy=%+v err=%v", childPolicy, err)
	}
	decision, err := store.EvaluateKnowledgePageContentPolicy(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageContentOperationDuplicate, authority)
	if err != nil || !decision.Allowed || decision.SourcePageID != child.Page.ID || decision.Revision != childPolicy.Revision {
		t.Fatalf("nearest child policy did not override ancestor: decision=%+v err=%v", decision, err)
	}
	if _, err = store.SetKnowledgePageContentPolicy(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageContentPolicyWrite{
		ClientID: "content-policy-stale", ExpectedRevision: 0, Scope: knowledgesdk.KnowledgePageContentPolicyPage,
		AllowCopy: true, AllowDownload: true, AllowPrint: true, AllowExport: true, AllowDuplicate: true,
		Classification: knowledgesdk.KnowledgePageClassificationInternal, WatermarkMode: knowledgesdk.KnowledgePageWatermarkNone, SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentAllow,
	}, authority); err == nil || !strings.Contains(err.Error(), "page_content_policy_revision_conflict") {
		t.Fatalf("stale content policy update was accepted: %v", err)
	}
	if _, err = store.CopyKnowledgePage(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageCopy{ClientID: "content-policy-copy-allowed", Title: "允许的副本"}, authority); err != nil {
		t.Fatalf("nearest allow policy did not permit copy: %v", err)
	}
	restricted, err := store.SetKnowledgePageContentPolicy(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageContentPolicyWrite{
		ClientID: "content-policy-sensitive", ExpectedRevision: childPolicy.Revision, Scope: knowledgesdk.KnowledgePageContentPolicyPage,
		AllowCopy: true, AllowDownload: true, AllowPrint: true, AllowExport: true, AllowDuplicate: true,
		Classification: knowledgesdk.KnowledgePageClassificationRestricted, WatermarkMode: knowledgesdk.KnowledgePageWatermarkIdentity,
		SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentBlockOutbound, RequireApproval: true,
	}, authority)
	if err != nil || restricted.Revision != 2 {
		t.Fatalf("set sensitive policy: policy=%+v err=%v", restricted, err)
	}
	decision, err = store.EvaluateKnowledgePageContentPolicy(t.Context(), library.ID, child.Page.ID, knowledgesdk.KnowledgePageContentOperationExport, authority)
	if err != nil || decision.Allowed || !decision.ApprovalRequired || decision.Classification != knowledgesdk.KnowledgePageClassificationRestricted || decision.SensitiveAction != knowledgesdk.KnowledgePageSensitiveContentBlockOutbound {
		t.Fatalf("sensitive outbound policy was not enforced: decision=%+v err=%v", decision, err)
	}
	view, err := store.KnowledgePage(t.Context(), library.ID, child.Page.ID, true, authority)
	if err != nil || view.Governance.Classification != knowledgesdk.KnowledgePageClassificationRestricted || view.Governance.DynamicWatermark == nil || !strings.Contains(view.Governance.DynamicWatermark.Text, authority.UserID) {
		t.Fatalf("dynamic identity watermark was not derived for the current reader: governance=%+v err=%v", view.Governance, err)
	}
}
