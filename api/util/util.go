package util

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/xnacly/private.social/api/database"
	"github.com/xnacly/private.social/api/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const MIN_PASSWORD_LEN = 10
const SYMBOLS = "!@#$%^&*()_+-=[]{};':\",./<>?"

const ASCII_ART = `
██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗   ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗                    █████╗ ██████╗ ██╗
██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝   ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║                   ██╔══██╗██╔══██╗██║
██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗     ███████╗██║   ██║██║     ██║███████║██║         █████╗    ███████║██████╔╝██║
██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝     ╚════██║██║   ██║██║     ██║██╔══██║██║         ╚════╝    ██╔══██║██╔═══╝ ██║
██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗██╗███████║╚██████╔╝╚██████╗██║██║  ██║███████╗              ██║  ██║██║     ██║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝              ╚═╝  ╚═╝╚═╝     ╚═╝
`

// copied from https://github.com/xNaCly/private.social/blob/master/cdn/util/util.go
// hold error feedback for the client response, allows for converting data to json
type ApiResponse struct {
	Success bool      `json:"success"` // indicate if the request was successful or not
	Code    int       `json:"code"`    // HTTP status code: 200, 400, 500, etc
	Message string    `json:"message"` // error text associated with the error
	Data    fiber.Map `json:"data"`    // additional data to send to the client
}

func GetTimeStamp() primitive.DateTime {
	return primitive.NewDateTimeFromTime(time.Now())
}

// returns "", true if password valid, else returns cause for password invalidity, false
//
// - needs to contain at least MIN_PASSWORD_LEN characters
//
// - needs to contain at least one number
//
// - needs to contain at least one symbol
//
// - needs to contain at least one uppercase letter
//
// - cant be the same as the username
//
// - cant contain the username
func IsPasswordValid(username string, password string) (string, bool) {
	if len(password) < MIN_PASSWORD_LEN {
		return fmt.Sprintf("password not long enough, min %d characters required", MIN_PASSWORD_LEN), false
	} else if username == password {
		return "password cannot be the same as the username", false
	} else if strings.Contains(username, password) {
		return "password cannot include the username", false
	} else if !strings.ContainsAny(password, "0123456789") {
		return "password must contain at least one number", false
	} else if !strings.ContainsAny(password, SYMBOLS) {
		return fmt.Sprintf("password must contain at least one of the following symbols: '%s'", SYMBOLS), false
	} else if !strings.ContainsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
		return "password must contain at least one uppercase letter", false
	}

	return "", true
}

// returns true if the string representation of id matches the string representation id1
func ObjectIdsMatch(id primitive.ObjectID, id1 primitive.ObjectID) bool {
	return id.String() == id1.String()
}

// gets the current user from the id encoded in the requests jwt token
func GetCurrentUser(c *fiber.Ctx) (models.User, error) {
	token := c.Locals("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	id := claims["id"].(string)

	if id == "" {
		return models.User{}, fiber.NewError(fiber.StatusUnauthorized, "invalid token")
	}

	user, err := database.Db.GetUserById(id)

	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

// returns true if id is found in the slice, otherwise false
func SliceContainsObjectId(slice []primitive.ObjectID, id primitive.ObjectID) bool {
	for _, v := range slice {
		if v == id {
			return true
		}
	}

	return false
}
