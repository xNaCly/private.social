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
	"github.com/xnacly/private.social/api/router"
	"github.com/xnacly/private.social/api/setup"
	"github.com/xnacly/private.social/api/util"

	"github.com/gofiber/fiber/v2"
)

var routes = []router.Route{
	{
		Path:        "/auth/register",
		Method:      "POST",
		Handler:     handlers.Register,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/auth/login",
		Method:      "POST",
		Handler:     handlers.Register,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/user/:id",
		Method:      "GET",
		Handler:     handlers.GetUserById,
		Middlewares: []func(*fiber.Ctx) error{},
	},
}

func main() {
	fmt.Print(util.ASCII_ART)

	config.LoadDotEnv()
	config.LoadConfig()

	database.Db = database.Connect(config.Config["MONGO_URL"])

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
