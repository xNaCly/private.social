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
	"github.com/xnacly/private.social/api/router"
	"github.com/xnacly/private.social/api/setup"
	"github.com/xnacly/private.social/api/util"

	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v3"
)

func main() {
	fmt.Print(util.ASCII_ART)

	config.LoadDotEnv()
	config.LoadConfig()

	database.Db = database.Connect(config.Config["MONGO_URL"])

	app := setup.Setup()
	log.Println("Registering unauthenticated routes...")
	router.RegisterRoutes(app, "v1", router.UnauthenticatedRoutes...)

	app.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte(config.Config["JWT_SECRET"]),
		SuccessHandler: func(c *fiber.Ctx) error {
			user, err := util.GetCurrentUser(c)

			if err != nil {
				return c.Status(fiber.StatusUnauthorized).JSON(util.ApiResponse{
					Success: false,
					Message: "Invalid token",
					Code:    fiber.StatusUnauthorized,
				})
			}

			c.Locals("dbUser", user)
			return c.Next()
		},
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusUnauthorized).JSON(util.ApiResponse{
				Success: false,
				Message: err.Error(),
				Code:    fiber.StatusUnauthorized,
			})
		},
	}))

	log.Println("Registering authenticated routes...")
	router.RegisterRoutes(app, "v1", router.Routes...)

	app.Use(func(c *fiber.Ctx) error {
		return c.Status(404).JSON(util.ApiResponse{
			Code:    fiber.ErrNotFound.Code,
			Message: fiber.ErrNotFound.Message,
			Success: false,
		})
	})

	log.Println("Starting the app...")
	log.Fatal(app.Listen(":8000"))
}
