package tests

import (
	"github.com/xnacly/private.social/api/util"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"testing"
)

func MustBeTrue(t *testing.T, condition bool) {
	if !condition {
		t.Fail()
	}
}

func MustBeFalse(t *testing.T, condition bool, message string) {
	if condition {
		t.Error(message)
	}
}

func TestGetTimeStamp(t *testing.T) {
	x := util.GetTimeStamp()
	MustBeTrue(t, x > 0)
}

func TestObjectIdsMatch(t *testing.T) {
	x, _ := primitive.ObjectIDFromHex("63f87dc175161e47e4b61274")
	y, _ := primitive.ObjectIDFromHex("63f87dc175161e47e4b61274")
	z := util.ObjectIdsMatch(x, y)
	MustBeTrue(t, z)
}

func TestIsPasswordValid(t *testing.T) {
	// too short
	_, valid := util.IsPasswordValid("test", "tes")
	MustBeFalse(t, valid, "Password is too short")

	// missing number
	_, valid = util.IsPasswordValid("username", "thisisalongenoughpassword")
	MustBeFalse(t, valid, "Password is missing a number")

	// missing symbols
	_, valid = util.IsPasswordValid("username", "thisisalongenoughpassword1")
	MustBeFalse(t, valid, "Password is missing a symbol")

	// missing uppercase
	_, valid = util.IsPasswordValid("username", "thisisalongenoughpassword1!")
	MustBeFalse(t, valid, "Password is missing an uppercase letter")

	// username in password
	_, valid = util.IsPasswordValid("admin", "adminpassword")
	MustBeFalse(t, valid, "Username is in password")

	// username is password
	_, valid = util.IsPasswordValid("adminadmin", "adminadmin")
	MustBeFalse(t, valid, "Username is password")

	// valid password
	_, valid = util.IsPasswordValid("username", "THISISalongenoughpassword1!")
	MustBeTrue(t, valid)
}
