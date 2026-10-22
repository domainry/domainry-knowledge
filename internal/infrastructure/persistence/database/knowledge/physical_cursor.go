package store

import (
	"strconv"
	"strings"
)

func parsePhysicalAfter(value string) (int64, bool) {
	if value == "" {
		return 0, true
	}
	if strings.TrimSpace(value) != value {
		return 0, false
	}
	id, err := strconv.ParseInt(value, 10, 64)
	return id, err == nil && id > 0
}

func physicalAfterValue(id int64) string {
	return strconv.FormatInt(id, 10)
}
