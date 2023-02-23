package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/xnacly/private.social/api/database"
	"github.com/xnacly/private.social/api/models"
	"github.com/xnacly/private.social/api/util"
	"golang.org/x/crypto/bcrypt"
)

// route to register a new user
func Register(c *fiber.Ctx) error {
	if c.Body() == nil || len(c.Body()) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "No body provided")
	}

	var user models.CreateUser
	err := c.BodyParser(&user)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid body, could not parse. Body example: {\"username\": \"test\", \"password\": \"test\"}")
	}

	if user.Username == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Username is required")
	} else if user.Password == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Password is required")
	} else if len(user.Username) < 5 {
		return fiber.NewError(fiber.StatusBadRequest, "Username must be at least 5 characters long")
	}

	cause, valid := util.IsPasswordValid(user.Username, user.Password)

	if !valid {
		return fiber.NewError(fiber.StatusBadRequest, cause)
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Could not hash password, contact the instance operator")
	}

	dbUser := models.User{
		Name:        user.Username,
		Password:    string(bytes),
		DisplayName: user.Username,
		Link:        "",
		Avatar:      "",
		CreatedAt:   util.GetTimeStamp(),
		Bio: models.UserBio{
			Text: "Hi! I'm using private.social :^)",
		},
		Stats:   models.UserStats{},
		Private: true,
	}

	id, err := database.Db.InsertNewUser(dbUser)

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Could not insert user into database, contact the instance operator")
	}

	return c.Status(201).JSON(util.ApiResponse{
		Success: true,
		Message: "User created successfully",
		Code:    201,
		Data: fiber.Map{
			"id": id,
		},
	})
}

// route to login as a user
func Login(c *fiber.Ctx) error {
	return nil
}
