package provider

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	connector "github.com/domainry/domainry-connector-sdk"
)

// Test-only fault injection: the real bounded host transport completes the
// first DELETE, but the caller receives no acknowledgement. Never retry here.
type deleteRecoveryLiveProbe struct {
	connector.Transport
	Dropped  bool
	URLs     []string
	Receipts []json.RawMessage
}

func (p *deleteRecoveryLiveProbe) RoundTripHTTP(ctx context.Context, in connector.HTTPRequest) (connector.HTTPResponse, error) {
	out, err := p.Transport.RoundTripHTTP(ctx, in)
	if in.Method != http.MethodDelete {
		return out, err
	}
	p.URLs = append(p.URLs, in.URL)
	if err != nil {
		return out, err
	}
	p.Receipts = append(p.Receipts, append(json.RawMessage(nil), out.Body...))
	var receipt struct {
		Code *int `json:"err_code"`
		Data struct {
			OK bool `json:"ok"`
		} `json:"data"`
	}
	if json.Unmarshal(out.Body, &receipt) == nil && out.StatusCode == 200 && receipt.Code != nil && *receipt.Code == 0 && receipt.Data.OK && !p.Dropped {
		p.Dropped = true
		return connector.HTTPResponse{}, errors.New("synthetic lost deletion response after real acknowledgement")
	}
	return out, err
}
