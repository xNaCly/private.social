package setup

import (
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cache"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/xnacly/private.social/api/util"
)

// sets up the app and returns it
//
// this includes:
//
// - configuring the application
//
// - setting up the log flags
//
// - setting up the default error handler
//
// - setting up the logger middleware
//
// - setting up the cors middleware
//
// - setting up the jwt middleware
func Setup() *fiber.App {
	log.SetFlags(log.Ldate | log.Ltime)
	log.Println("Setting up the app...")

	var DefaultErrorHandler = func(c *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError

		var e *fiber.Error
		if errors.As(err, &e) {
			code = e.Code
		}

		apiErr := util.ApiResponse{
			Code:    code,
			Message: err.Error(),
			Success: false,
		}

		return c.Status(code).JSON(apiErr)
	}

	app := fiber.New(fiber.Config{
		AppName:      "private.social/api",
		ServerHeader: "private.social/api",
		ErrorHandler: DefaultErrorHandler,
	})

	app.Use(cors.New(cors.Config{
		AllowMethods:     "",
		Next:             nil,
		AllowOrigins:     "*",
		AllowHeaders:     "",
		AllowCredentials: false,
		ExposeHeaders:    "",
		MaxAge:           0,
	}))

	app.Use(cache.New())

	app.Use(logger.New(logger.Config{
		TimeFormat: "2006-01-02 15:04:05",
	}))

	return app
}
