package tests

import (
	"github.com/xnacly/private.social/api/config"
	"os"
	"testing"
)

func TestLoadConfig(t *testing.T) {
	os.Setenv("MONGO_URL", "this is a test")
	os.Setenv("JWT_SECRET", "this is a test")
	config.LoadConfig()
	if config.Config["MONGO_URL"] != "this is a test" {
		t.Error("Failed to load config")
	}
	if config.Config["JWT_SECRET"] != "this is a test" {
		t.Error("Failed to load config")
	}
}
