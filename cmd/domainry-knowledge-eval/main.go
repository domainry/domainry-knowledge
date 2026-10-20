package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"os"

	"github.com/domainry/domainry-foundation/apperror"
	"github.com/domainry/domainry-foundation/processhost"
	"github.com/domainry/domainry-knowledge-sdk/evaluation"
)

const maximumEvaluationBytes = 16 << 20

func main() {
	os.Exit(runCommand(os.Args[1:], os.Stdout))
}

func runCommand(arguments []string, output io.Writer) int {
	ctx := context.Background()
	host, err := processhost.Open(ctx, processhost.Config{
		ServiceName:            "domainry-knowledge-eval",
		ServiceVersion:         "dev",
		LoggerOutputPaths:      []string{"stderr"},
		LoggerErrorOutputPaths: []string{"stderr"},
	})
	if err != nil {
		return 1
	}
	host.Started(ctx, map[string]any{"mode": "evaluation"})
	err = run(arguments, output)
	if host.Finish(ctx, map[string]any{"mode": "evaluation"}, err) != nil {
		return 1
	}
	return 0
}

func run(arguments []string, output io.Writer) error {
	if len(arguments) != 1 {
		return apperror.New(apperror.KindBadRequest, "knowledge.evaluation.arguments_invalid", nil, nil)
	}
	file, err := os.Open(arguments[0])
	if err != nil {
		return apperror.New(apperror.KindBadRequest, "knowledge.evaluation.dataset_open_failed", err, nil)
	}
	defer func() { _ = file.Close() }()
	raw, err := io.ReadAll(io.LimitReader(file, maximumEvaluationBytes+1))
	if err != nil {
		return apperror.New(apperror.KindBadRequest, "knowledge.evaluation.dataset_read_failed", err, nil)
	}
	if len(raw) == 0 || len(raw) > maximumEvaluationBytes {
		return apperror.New(apperror.KindBadRequest, "knowledge.evaluation.dataset_size_invalid", nil, nil)
	}
	var dataset evaluation.Dataset
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if err = decoder.Decode(&dataset); err != nil {
		return apperror.New(apperror.KindBadRequest, "knowledge.evaluation.dataset_invalid", err, nil)
	}
	var extra any
	if decoder.Decode(&extra) != io.EOF {
		return apperror.New(apperror.KindBadRequest, "knowledge.evaluation.dataset_trailing_json", nil, nil)
	}
	report, err := evaluation.EvaluateReport(dataset)
	if err != nil {
		return apperror.New(apperror.KindBadRequest, "knowledge.evaluation.dataset_rejected", err, nil)
	}
	encoder := json.NewEncoder(output)
	encoder.SetIndent("", "  ")
	if err = encoder.Encode(report); err != nil {
		return apperror.New(apperror.KindInternal, "knowledge.evaluation.report_write_failed", err, nil)
	}
	if !report.Passed {
		return apperror.New(apperror.KindConflict, "knowledge.evaluation.quality_gate_failed", errors.New("quality threshold not met"), nil)
	}
	return nil
}
