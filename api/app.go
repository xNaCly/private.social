// entry point for the REST api
// contains the main function, the route registration and connecting to the database
//
// new routes can be added by appending a new router.Route struct to the routes array.
package main

import (
	"fmt"
	"log"

	"github.com/xnacly/private.social/api/config"
	"github.com/xnacly/private.social/api/database"
	"github.com/xnacly/private.social/api/handlers"
	"github.com/xnacly/private.social/api/models"
	"github.com/xnacly/private.social/api/router"
	"github.com/xnacly/private.social/api/setup"
	"github.com/xnacly/private.social/api/util"

	"github.com/gofiber/fiber/v2"
)

var routes = []router.Route{
	{
		Path:        "/",
		Method:      "GET",
		Handler:     handlers.Index,
		Middlewares: []func(*fiber.Ctx) error{},
	},
}

func main() {
	fmt.Print(util.ASCII_ART)

	config.LoadDotEnv()

	database.Db = database.Connect(config.Config["MONGO_URI"])

	// TODO: remove test:
	user := models.User{
		Name:        "user",
		DisplayName: "user",
		Link:        "user",
		Avatar:      "https://xnacly.me/avatar.png",
		Private:     false,
		CreatedAt:   util.GetTimeStamp(),
		Bio: models.UserBio{
			Text:     "this is the bio",
			Pronouns: "they/them",
			Location: "somewhere",
			Website:  "https://xnacly.me",
		},
		Stats: models.UserStats{
			Followers: 0,
			Following: 0,
			Posts:     0,
		},
	}
	database.Db.InsertNewUser(user)
	// -----------------

	app := setup.Setup()
	router.RegisterRoutes(app, "v1", routes...)

	app.Use(func(c *fiber.Ctx) error {
		return c.Status(404).JSON(util.ApiError{
			Code:    fiber.ErrNotFound.Code,
			Message: fiber.ErrNotFound.Message,
			Success: false,
		})
	})

	log.Fatal(app.Listen(":8000"))
}
