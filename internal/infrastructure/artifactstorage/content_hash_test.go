package artifactstorage

import (
	"crypto/sha256"
	"encoding/hex"
)

func testContentHash(content []byte) string {
	digest := sha256.Sum256(content)
	return hex.EncodeToString(digest[:])
}
