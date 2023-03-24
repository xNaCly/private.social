package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/xnacly/private.social/api/handlers"
	"log"
)

// struct representing a route the api should handle and register
type Route struct {
	Path    string                 // path, examples: "/", "/user/:id"
	Method  string                 // method, index is "GET", "POST", "PUT", "DELETE"
	Handler func(*fiber.Ctx) error // handler function, example: func(c *fiber.Ctx) error { return c.SendString("Hello, World!") }
}

// contains all routes which need to be accessed without authentication
var UnauthenticatedRoutes = []Route{
	{
		Path:    "/ping",
		Method:  "GET",
		Handler: handlers.Ping,
	},
	{
		Path:    "/auth/register",
		Method:  "POST",
		Handler: handlers.Register,
	},
	{
		Path:    "/auth/login",
		Method:  "POST",
		Handler: handlers.Login,
	},
}

// contains all routes which need to be accessed with authentication
var Routes = []Route{
	{
		Path:    "/user/me",
		Method:  "GET",
		Handler: handlers.GetMe,
	},
	{
		Path:    "/user/me",
		Method:  "PUT",
		Handler: handlers.UpdateMe,
	},
	{
		Path:    "/user/:id",
		Method:  "GET",
		Handler: handlers.GetUserById,
	},
	{
		Path:    "/post/",
		Method:  "POST",
		Handler: handlers.CreatePost,
	},
	{
		Path:    "/post/me",
		Method:  "GET",
		Handler: handlers.GetPosts,
	},
	{
		Path:    "/post/:id",
		Method:  "DELETE",
		Handler: handlers.DeletePost,
	},
	{
		Path:    "/post/:id",
		Method:  "GET",
		Handler: handlers.GetPostById,
	},
}

// registers all router.Route structs in the routes to the app grouped by the groupPrefix
func RegisterRoutes(app *fiber.App, groupPrefix string, routes ...Route) {
	group := app.Group(groupPrefix)
	for _, route := range routes {
		group.Add(route.Method, route.Path, route.Handler)
		log.Printf("Registered route: [%s] %s%s\n", route.Method, groupPrefix, route.Path)
	}
	log.Printf("Registered '%d' routes\n", len(routes))
}
