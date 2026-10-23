package sqliteconfig

import (
	"context"
	"database/sql"
	"path/filepath"
	"testing"

	_ "modernc.org/sqlite"
)

func TestDSNAppliesConnectionLocalPragmasToEntirePool(t *testing.T) {
	database, err := sql.Open("sqlite", DSN(filepath.Join(t.TempDir(), "knowledge pool.db")))
	if err != nil {
		t.Fatal(err)
	}
	defer database.Close()
	database.SetMaxOpenConns(8)

	connections := make([]*sql.Conn, 0, 8)
	for range 8 {
		connection, connectionErr := database.Conn(t.Context())
		if connectionErr != nil {
			t.Fatal(connectionErr)
		}
		connections = append(connections, connection)
	}
	defer func() {
		for _, connection := range connections {
			_ = connection.Close()
		}
	}()

	for index, connection := range connections {
		var foreignKeys, busyTimeout int
		if err = connection.QueryRowContext(context.Background(), "PRAGMA foreign_keys").Scan(&foreignKeys); err != nil {
			t.Fatalf("connection %d foreign_keys: %v", index, err)
		}
		if err = connection.QueryRowContext(context.Background(), "PRAGMA busy_timeout").Scan(&busyTimeout); err != nil {
			t.Fatalf("connection %d busy_timeout: %v", index, err)
		}
		if foreignKeys != 1 || busyTimeout != 5000 {
			t.Fatalf("connection %d foreign_keys=%d busy_timeout=%d", index, foreignKeys, busyTimeout)
		}
	}
}
