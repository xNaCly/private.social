package main

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/xnacly/private.social/cdn/handlers"
	"github.com/xnacly/private.social/cdn/util"
	"log"
)

func main() {
	log.SetFlags(log.Ldate | log.Ltime)

	var DefaultErrorHandler = func(c *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError

		var e *fiber.Error
		if errors.As(err, &e) {
			code = e.Code
		}

		apiErr := util.ApiError{
			Code:    code,
			Message: err.Error(),
			Success: false,
		}

		log.Println(apiErr)

		return c.Status(code).JSON(apiErr)
	}

	app := fiber.New(fiber.Config{
		AppName:      "private.social/cdn",
		ServerHeader: "private.social - cdn server",
		ErrorHandler: DefaultErrorHandler,
	})

	v1 := app.Group("/v1")
	v1.Post("/upload/:file", handlers.AcceptIncomingFile)
	v1.Static("/asset", "./vfs", fiber.Static{
		MaxAge: 3600,
	})

	app.Use(func(c *fiber.Ctx) error {
		log.Printf("[%s] %s from %s", c.Method(), c.Path(), c.IP())
		return c.Status(404).JSON(util.ApiError{
			Code:    fiber.ErrNotFound.Code,
			Message: fiber.ErrNotFound.Message,
			Success: false,
		})
	})

	log.Fatal(app.Listen(":8080"))
}
