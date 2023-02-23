package tests

import (
	"os"
	"testing"

	"github.com/xnacly/private.social/cdn/util"
)

func TestRandomString(t *testing.T) {
	got := util.RandomString(30)
	if len(got) != 30 {
		t.Errorf("RandomString(30) = %q; want length 30", got)
	}
}

func TestCreateVfsIfNotFound(t *testing.T) {
	util.CreateVfsIfNotFound()
	_, err := os.Stat("vfs")
	if err != nil {
		t.Errorf("vfs directory not found")
	}
}
