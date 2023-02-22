package main

import (
	"fmt"
	"log"

	"github.com/xnacly/private.social/api/util"
	"github.com/xnacly/private.social/api/config"
	"github.com/xnacly/private.social/api/router"
	"github.com/xnacly/private.social/api/handlers"

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

    app := config.Setup()
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
