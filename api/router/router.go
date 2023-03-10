package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/xnacly/private.social/api/handlers"
	"log"
)

// struct representing a route the api should handle and register
type Route struct {
	Path        string                   // path, examples: "/", "/user/:id"
	Method      string                   // method, index is "GET", "POST", "PUT", "DELETE"
	Handler     func(*fiber.Ctx) error   // handler function, example: func(c *fiber.Ctx) error { return c.SendString("Hello, World!") }
	Middlewares []func(*fiber.Ctx) error // middlewares, such as authentication, rate limiting or logging
}

var UnauthenticatedRoutes = []Route{
	{
		Path:        "/ping",
		Method:      "GET",
		Handler:     handlers.Ping,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/auth/register",
		Method:      "POST",
		Handler:     handlers.Register,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/auth/login",
		Method:      "POST",
		Handler:     handlers.Login,
		Middlewares: []func(*fiber.Ctx) error{},
	},
}

var Routes = []Route{
	{
		Path:        "/user/me",
		Method:      "GET",
		Handler:     handlers.GetMe,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/user/me",
		Method:      "PUT",
		Handler:     handlers.UpdateMe,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/user/:id",
		Method:      "GET",
		Handler:     handlers.GetUserById,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/post/",
		Method:      "POST",
		Handler:     handlers.CreatePost,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/post/me",
		Method:      "GET",
		Handler:     handlers.GetPosts,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/post/:id",
		Method:      "DELETE",
		Handler:     handlers.DeletePost,
		Middlewares: []func(*fiber.Ctx) error{},
	},
	{
		Path:        "/post/:id",
		Method:      "GET",
		Handler:     handlers.GetPostById,
		Middlewares: []func(*fiber.Ctx) error{},
	},
}

// registers all router.Route structs in the routes to the app grouped by the groupPrefix
func RegisterRoutes(app *fiber.App, groupPrefix string, routes ...Route) {
	group := app.Group(groupPrefix)
	for _, route := range routes {
		group.Add(route.Method, route.Path, append(route.Middlewares, route.Handler)...)
		log.Printf("Registered route: [%s] %s%s\n", route.Method, groupPrefix, route.Path)
	}
	log.Printf("Registered '%d' routes\n", len(routes))
}
