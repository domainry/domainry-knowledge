package embedprovider

import (
	"fmt"
	"net/url"
	"regexp"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

var youtubeID = regexp.MustCompile(`^[A-Za-z0-9_-]{11}$`)
var bilibiliID = regexp.MustCompile(`^BV[A-Za-z0-9]{10}$`)

type youtube struct{}

func (youtube) Key() string            { return "youtube" }
func (youtube) FrameOrigins() []string { return []string{"https://www.youtube-nocookie.com"} }
func (youtube) CanonicalizeEmbedURL(raw string) (string, error) {
	parsed, err := exactHTTPSURL(raw)
	if err != nil {
		return "", err
	}
	videoID := strings.TrimPrefix(parsed.Path, "/embed/")
	if strings.ToLower(parsed.Hostname()) != "www.youtube-nocookie.com" || parsed.RawQuery != "" || !strings.HasPrefix(parsed.Path, "/embed/") || !youtubeID.MatchString(videoID) {
		return "", fmt.Errorf("YouTube embed URL is invalid")
	}
	return "https://www.youtube-nocookie.com/embed/" + videoID, nil
}

type bilibili struct{}

func (bilibili) Key() string            { return "bilibili" }
func (bilibili) FrameOrigins() []string { return []string{"https://player.bilibili.com"} }
func (bilibili) CanonicalizeEmbedURL(raw string) (string, error) {
	parsed, err := exactHTTPSURL(raw)
	if err != nil {
		return "", err
	}
	values := parsed.Query()
	if strings.ToLower(parsed.Hostname()) != "player.bilibili.com" || parsed.Path != "/player.html" || len(values) != 1 || len(values["bvid"]) != 1 || !bilibiliID.MatchString(values.Get("bvid")) {
		return "", fmt.Errorf("Bilibili embed URL is invalid")
	}
	return "https://player.bilibili.com/player.html?bvid=" + url.QueryEscape(values.Get("bvid")), nil
}

func exactHTTPSURL(raw string) (*url.URL, error) {
	if raw == "" || len(raw) > 2048 || strings.TrimSpace(raw) != raw {
		return &url.URL{}, fmt.Errorf("embed URL is invalid")
	}
	parsed, err := url.ParseRequestURI(raw)
	if err != nil || parsed.Scheme != "https" || parsed.User != nil || parsed.Port() != "" || parsed.Fragment != "" || parsed.Hostname() == "" {
		return &url.URL{}, fmt.Errorf("embed URL is invalid")
	}
	return parsed, nil
}

func Defaults() []knowledgesdk.EmbedProvider {
	return []knowledgesdk.EmbedProvider{youtube{}, bilibili{}}
}
