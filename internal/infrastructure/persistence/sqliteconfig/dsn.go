package sqliteconfig

import (
	"net/url"
	"path/filepath"
)

// DSN returns a modernc SQLite data source that applies connection-local
// settings to every connection opened by database/sql. Executing these PRAGMAs
// once on *sql.DB only configures whichever pooled connection happens to run
// that statement.
func DSN(path string) string {
	query := url.Values{}
	query.Add("_pragma", "busy_timeout(5000)")
	query.Add("_pragma", "foreign_keys(ON)")
	return (&url.URL{
		Scheme:   "file",
		Path:     filepath.ToSlash(path),
		RawQuery: query.Encode(),
	}).String()
}
