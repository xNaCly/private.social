---
title: Webservices - private.social
---

## Idea and Features

Private.social is designed to be a truly private and secure social network that empowers users to:

- [x] Create an account without requiring an email address or phone number.
  - [ ] Optionally add an email address to the account to enable resetting the account password.
- [x] Set all accounts to private visibility by default.
      (Only followers can view profile data and posts from a private account.)
- [x] Secure all API interactions with JWT tokens.
- [x] Store passwords in the database hashed with bcrypt.
- [x] Enforce password requirements:
  - [x] Minimum of 10 characters.
  - [x] At least one symbol.
  - [x] At least one uppercase character.
  - [x] At least one number.

Non-privacy related features:

- [x] Self-hostable API, CDN, and web.
- [ ] Home view sorted chronologically.
- [x] Posts:
  - [ ] Likes:
    - [ ] Private (only the creators can see the number of likes).
    - [ ] Disable (no one can like the post).
  - [ ] Comments:
    - [ ] Restricted (only followers can comment).
    - [ ] Mention-only (only mentioned users can comment).
    - [ ] Disable (no one can comment).
  - [x] Caption.
  - [ ] Collaboration on posts.
- [x] Profile:
  - [x] Biography:
    - [x] Text biography.
    - [ ] Custom pronouns.
    - [x] Profile picture.
    - [ ] Profile banner.
    - [x] Website.
    - [x] Location.
  - [ ] Customize profile using CSS.

Mental health related features:

- [ ] Likes and comments can be restricted and disabled.
- [ ] Users can be blocked, muted, and reported.
- [ ] Posts can be reported.

## Motivation

Private.social was developed during the 4th semester of our applied computer science bachelor's program by the following four individuals:

- [xnacly](https://github.com/xnacly)
- [ellirynbw](https://github.com/ellirynbw)
- [derPhilosoff](https://github.com/derPhilosoff)
- [Nosch](https://github.com/noschnosch)

The objective of the semester's examination was to create and document an application that utilizes at least two microservices.
One microservice had to be programmed by our group, while the other could be any publicly available online web service.
To earn a mark higher than "good," the group had to create either a frontend web application or a mobile application.
The task also required the groups to document the application interfaces with OpenAPI and keep track of which member was responsible for which task.

At Private.social, we utilize three microservices that we programmed ourselves:

- **api**: This service allows the web frontend to interact with the database.
- **cdn**: This service is responsible for storing assets.
- **web**: This service governs the web interface.

We also utilize one microservice as a database:

- **mongo**: This service is responsible for storing all user and post data.

In addition, we use one external service:

- **[ui.avatars](https://ui-avatars.com/)**: This service is used to provide new users with a default profile picture.

### Task distribution

| Teammember   | Task                                       |
| ------------ | ------------------------------------------ |
| xnacly       | Web and API implementation, docs           |
| ellirynbw    | Docker, Nginx and mongodb setup, docs      |
| derPhilosoff | Docs, API database wrapper, config package |
| Nosch        | CDN, docs and web design                   |

### Repo structure

This project is structured into four main directories:

- `web/`: This folder contains the front-end portion of the application, which is built with React.js.
- `api/`: This directory contains the back-end of the application, which is built with Go.
- `cdn/`: This folder contains the content delivery network of the application, which is built with Go. The CDN serves pictures and videos.
- `docs/`: This folder contains the documentation for the project.

### Project structures

The following chapter is a short summary of the projects directories and what path contains what part of the business logic.

#### CDN

The cdn is started via `go run .` which downloads all the dependencies the go compiler needs to create a executable.
After starting, the cdn checks if the directory `./vfs` exists, if not it creates the directory.
The next step is a custom error handler which returns a `ApiResponse` go structure to the user, which translated to the following json object:

```json
{
  "success": false,
  "code": 404,
  "message": "Not Found",
  "data": null
}
```

This structure supports errors (as showcased above) and successful responses, such as:

```json
{
  "success": true,
  "code": 201,
  "message": "file uploaded successfully",
  "data": {
    "path": "/v1/asset/LHGyWsDknFdttJFzhHCprZHUhekCTTWH/dGVzdC5wbmdx"
  }
}
```

This response structure is also used in the `api` project to keep things consistent.

The cdn uses and registers the [cors](https://docs.gofiber.io/api/middleware/cors/), [cache](https://docs.gofiber.io/api/middleware/cache/) and [logger](https://docs.gofiber.io/api/middleware/logger/) middleware, all provided by the [fiber](https://gofiber.io/) web server framework.
The first one is used to insure cross origin resource sharing, the second one is used to aggressively cache assets uploaded to the cdn and the third allows for verbose event logging, which is incredibly helpful for debugging.

After the middlewares are registered, the cdn groups the two available routes using the `v1` group, which enables the routing using a prefix.
This is useful for versioning and supporting outdated routes, while innovating.

The first of the two routes is used to upload a file `/v1/upload/:file`.
It only accepts incoming requests if the `file` parameter and the request body are not empty. After a request was made, the cdn first determines the MIME type of the incoming binary request body and checks if it's a supported MIME type:

- image/png
- image/jpg
- image/jpeg
- image/gif
- image/webp
- image/heic
- video/mp4

If this isn't the case, the cdn responds with an error in the format of the `ApiResponse` go structure.
If the mime type is supported, the cdn creates a random directory prefix and creates a new directory with this name.
To prevent vulnerabilities caused by file paths in the request parameter which try to escape the `vfs` directory, we use a go std lib function to only get the base of the filename.
This escaped filename is now converted to its base64 representation and stored as a file in the previously created directory.
If everything worked out as intended, the cdn returns the default `ApiResponse` structure with the data containing a `path` key value pair pointing to the uploaded assets:

```json
{
  "success": true,
  "code": 201,
  "message": "file uploaded successfully",
  "data": {
    "path": "/v1/asset/LHGyWsDknFdttJFzhHCprZHUhekCTTWH/dGVzdC5wbmdx"
  }
}
```

To request the uploaded asset, simply concatenate the returned path and the path the cdn is currently hosted at:

```js
"http://localhost:8080" +
  "/v1/asset/LHGyWsDknFdttJFzhHCprZHUhekCTTWH/dGVzdC5wbmdx";
```

The result, viewed in the browser:

![cdn asset screenshot](assets/cdn-asset-screenshot.png)

The second available handler is bound to the `v1/asset` path and is a statically hosted directory mounted to the `vfs` directory.
Its cached with a max-age of 3600 seconds (60 min / 1h) and returns a 404 `ApiResponse` structure:

```json
{
  "success": false,
  "code": 404,
  "message": "Not Found",
  "data": null
}
```

##### Directory content overview:

```text
drwxr-xr-x    - teo 10 Mar 14:47 .
.rw-r--r-- 1.3k teo  9 Mar 11:56 ├── app.go
.rw-r--r-- 4.5k teo  9 Mar 16:30 ├── cdn-openapi.yaml
.rw-r--r--  208 teo  6 Mar 10:35 ├── Dockerfile
.rw-r--r--  896 teo  6 Mar 10:35 ├── go.mod
.rw-r--r-- 6.3k teo  6 Mar 10:35 ├── go.sum
drwxr-xr-x    - teo  9 Mar 11:56 ├── handlers
.rw-r--r-- 1.5k teo  9 Mar 11:56 │  └── file.go
.rw-r--r--  106 teo  6 Mar 10:35 ├── Readme.md
drwxr-xr-x    - teo 13 Mar 08:49 ├── tests
.rw-r--r--  401 teo  6 Mar 10:35 │  └── util_test.go
drwxr-xr-x    - teo  9 Mar 11:56 ├── util
.rw-r--r-- 3.6k teo  9 Mar 11:56 │  └── util.go
drwxr-xr-x    - teo 13 Mar 08:49 └── vfs
```

- app.go:

  This is the main entry point of the application, and contains middlewares and restful server setup. It is responsible for setting up the different routes that the CDN will expose, and for binding the upload handler to POST /v1/upload. Additionally, it serves the vfs directory statically with a max-age of 3600.

- Documentation:

  The directory includes a CDN OpenAPI specification file, which describes the different endpoints of the CDN, and a Readme file, which provides information on how to use the CDN.

- Dockerfile:

  This file is used to build a Docker image of the application. This is useful for deployment purposes, as it allows the application to be easily packaged and deployed on different platforms.

- Dependency management for Go:

  go.sum and go.mod.
  These files are used to manage the different dependencies required by the application.

- Handlers:

  This folder contains different handlers that are responsible for handling the different requests made to the CDN. The handlers are able to interact with the Fiber context, and act as routes for the CDN.

- Tests:

  This folder contains unit tests for the util module.

- Util:

  This folder contains a utility module for structs and small helper methods.

- Vfs:

  This folder contains the directory that the CDN creates to store uploaded assets in.

#### API

In a nutshell the api is the layer between the web interface and the database with a bit of access security.
The API is secured with usage of [JWT](https://www.rfc-editor.org/rfc/rfc7519) and is at the point of writing in no way complete for all features described at [idea](#idea).

##### Directory content overview:

```text
drwxr-xr-x    - teo 10 Mar 14:45 .
.rw-r--r--  106 teo  6 Mar 17:06 ├── .env
.rw-r--r--   23 teo  6 Mar 10:35 ├── .env.example
.rw-r--r-- 1.8k teo  6 Mar 10:35 ├── app.go
drwxr-xr-x    - teo  6 Mar 10:35 ├── config
.rw-r--r--  951 teo  6 Mar 10:35 │  └── config.go
drwxr-xr-x    - teo 10 Mar 08:00 ├── database
.rw-r--r-- 1.2k teo  9 Mar 16:30 │  ├── database.go
.rw-r--r-- 2.3k teo 10 Mar 08:00 │  ├── posts.go
.rw-r--r-- 2.4k teo  9 Mar 16:30 │  └── users.go
.rw-r--r--  208 teo  6 Mar 10:35 ├── Dockerfile
.rw-r--r-- 1.5k teo  6 Mar 10:35 ├── go.mod
.rw-r--r--  11k teo  6 Mar 10:35 ├── go.sum
drwxr-xr-x    - teo 10 Mar 15:10 ├── handlers
.rw-r--r-- 4.5k teo  7 Mar 13:02 │  ├── auth.go
.rw-r--r--  314 teo  9 Mar 16:30 │  ├── ping.go
.rw-r--r-- 3.5k teo 10 Mar 15:10 │  ├── post.go
.rw-r--r-- 2.8k teo  9 Mar 16:30 │  └── user.go
drwxr-xr-x    - teo  9 Mar 16:30 ├── models
.rw-r--r--  424 teo  9 Mar 16:30 │  ├── General.go
.rw-r--r--  716 teo  9 Mar 16:30 │  ├── Post.go
.rw-r--r-- 2.2k teo  6 Mar 10:35 │  └── User.go
.rw-r--r--  17k teo  9 Mar 16:30 ├── openapi3_0.yaml
.rw-r--r--  873 teo  6 Mar 10:35 ├── Readme.md
drwxr-xr-x    - teo 10 Mar 14:39 ├── router
.rw-r--r-- 2.5k teo 10 Mar 14:39 │  └── router.go
drwxr-xr-x    - teo  6 Mar 10:35 ├── setup
.rw-r--r-- 1.4k teo  6 Mar 10:35 │  └── setup.go
drwxr-xr-x    - teo  6 Mar 10:35 ├── tests
.rw-r--r--  418 teo  6 Mar 10:35 │  ├── config_test.go
.rw-r--r-- 1.6k teo  6 Mar 10:35 │  └── util_test.go

drwxr-xr-x    - teo  6 Mar 10:35 └── util
.rw-r--r-- 4.8k teo  6 Mar 10:35    └── util.go
```

The project is structured as follows:

- app.go:

  This is the main entry point of the application, similar to the CDN. It is responsible for starting the server, and setting up the different routes that the API will expose.

- Documentation:

  The project includes an OpenAPI specification file, which describes the different endpoints of the API, and a Readme file, which provides information on how to use the API.

- Dockerfile:

  This file is used to build a Docker image of the application. This is useful for deployment purposes, as it allows the application to be easily packaged and deployed on different platforms.

- Configuration:

  The project includes a .env file, which contains environment variables used by the application, and a .env.example file, which serves as an example of how to set up the environment variables.

- Dependency management for Go:

  go.sum and go.mod.
  These files are used to manage the different dependencies required by the application.

- Handlers: This folder contains different handlers that are responsible for handling the different requests made to the API. The handlers are able to interact with the Fiber context, and act as routes for the API. The handlers include:

  - auth.go: Contains all routes used for authentication to the API.
  - ping.go: Contains the ping route, which is used to check if the API is online.
  - post.go: Contains uploading, viewing all posts by the logged in user, viewing a post by its ID, and deleting a post by its ID.
  - user.go: Contains viewing the currently logged in user, viewing a user by their ID, and updating the currently logged in user.

- Config:

  This folder contains a module that is responsible for loading a dot env file, setting the defined environment variables in the process that the Go application is running in, and afterwards loading these environment variables in a config hashmap.

- Database:

  This folder contains a module that is responsible for interacting with MongoDB. It includes a wrapper for creating the connection, managing users and posts.

- Models:

  This folder contains structures for users, posts, and utility. These structures are used to encode from BSON to Go structures to JSON.

- Tests:

  This folder contains tests for utility functions and the config module.

- Util:

  This folder contains utility functions such as getting a timestamp for MongoDB, comparing object IDs, and getting the current user from the JWT token.

## Technology choices

### Frontend

React is an incredibly powerful and versatile JavaScript library that has revolutionized the way we think about building dynamic user interfaces.
As a developer with experience using React, I believe that it is the best choice for building modern web applications, particularly when combined with TypeScript and a fast and lightweight bundler like Vite.

One of the main advantages of React is its flexibility and scalability.
React provides a simple and intuitive way to manage the state of a web application, which makes it easy to build complex and dynamic user interfaces that can handle a wide range of different use cases.
Additionally, React's component-based architecture allows developers to easily reuse code across different parts of an application, which can save a lot of time and effort when building large-scale projects.

Another key advantage of React is its extensive support for TypeScript, a popular and powerful superset of JavaScript that adds type checking and other features to the language.
With TypeScript, developers can catch errors and bugs before they ever make it into production, which can help to improve the stability and reliability of a web application. And with Vite, a fast and lightweight bundler that supports TypeScript out of the box, developers can enjoy lightning-fast build times and a streamlined development experience that helps to reduce development time and increase productivity.

In my experience, React has been an incredibly powerful tool for building modern web applications, and its support for TypeScript and the Vite bundler has only made it more versatile and efficient.

### Backend

When it comes to building high-performance, scalable, and reliable APIs and CDNs, there are few options better than Go.
As someone who was eager to learn and use Go for backend development, I believe that it is the perfect choice for building fast, efficient, and secure web applications, especially when paired with a modern HTTP server framework like Go Fiber.

One of the key advantages of Go is its incredible speed and performance.
Because Go is a compiled language, it can handle a high volume of requests with very low overhead, making it ideal for building APIs and CDNs that need to respond quickly and efficiently to user requests.
Additionally, Go's built-in concurrency and parallelism features make it easy to write scalable code that can handle high traffic loads without slowing down.

Finally, as someone who has experience working with JWT and a dislike for Java and a belief that JavaScript can be too slow, Go offers a refreshing alternative that is both fast and reliable. With its focus on performance and efficiency, Go can handle large amounts of data and requests with ease, while still providing the flexibility and scalability that developers need to build modern web applications.

Given my desire to learn and utilize Go for backend development, and the advantages of using Go as outlined above, it makes sense for me and my team to adopt Go as our primary backend language for building the API and the CDN.

## Getting started

### Production environment

#### About

The docker-compose configuration file provided in this project is designed to spin up four containers: api, cdn, web, and mongodb.

Each container serves a specific purpose, with the web app built for production and served through nginx.

The mongo database container is configured to use a volume, making the data stored in the container persistent.

The api container is set to listen on port 8000, while the cdn is set to listen on port 8080, and the web app is set to listen on port 80.

Nginx reverse proxy is used to map requests from the web to the appropriate container.

For example, when a request is made to localhost/api, the nginx reverse proxy maps the request to the api container running on localhost:8000.
Similarly, when a request is made to localhost/cdn, the nginx reverse proxy maps the request to the cdn container running on localhost:8080.

This docker-compose configuration file is an efficient way to manage multiple containers, with each container running a specific service. The use of volumes ensures that data is persistent and can be used across multiple container instances.

#### Image sizes

| image | size | base                | tech stack                     |
| ----- | ---- | ------------------- | ------------------------------ |
| web   | 20mb | nginx:stable-alpine | typescript, react, vite, nginx |
| cdn   | 7mb  | scratch             | go, fiber                      |
| api   | 7mb  | scratch             | go, fiber, go mongodb driver   |

#### Docker compose

To successfully run the application, the following dependencies must be installed on your system:

- [Docker](https://www.docker.com/), which is an open-source platform for building, shipping, and running applications in containers.
- [Docker-compose](https://docs.docker.com/compose/), a tool for defining and running multi-container Docker applications.
- You must make sure that the Docker service is enabled and started as a deamon. This will ensure that the service is running in the background and can be accessed by the application.

It is important to note that Docker and Docker-compose are widely used in the software development industry due to their ability to simplify the process of building and deploying applications. Additionally, they provide a consistent environment across different systems, making it easier to test and debug applications.

```bash
git clone https://github.com/xNaCly/private.social.git
mv ps.env.example ps.env
# edit the JWT_SECRET in the ps.env.example
# choose a fairly complex secret, at least 32 chars long
docker compose up
```

Now navigate to http://localhost and use the application.

##### Configuration

> This can differ from the compose config found in the root of the project `docker-compose.yml`

```yaml
version: "3.9"
services:
  db:
    hostname: db
    # use the offical mongo image
    image: mongo
    # if the container crashes, restart it
    restart: always
    ports:
      - 27017:27017
    # what command to execute
    command: mongod > /dev/null
    # username and password for the database
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: root
    # which volume to persist data to
    volumes:
      - database:/data/db
  api:
    # source Dockerfile from ./api/Dockerfile
    build: ./api
    hostname: api
    # start container after db container is running
    depends_on:
      - db
    # pass env variables from .env to the container
    env_file:
      - ./ps.env
    # set the db url to the db container above with username and password
    environment:
      MONGO_URL: mongodb://admin:root@db:27017/
    ports:
      - 8000:8000
  cdn:
    # source Dockerfile from ./cdn/Dockerfile
    build: ./cdn
    hostname: cdn
    ports:
      - 8080:8080
    # what volume and path to persist data to
    volumes:
      - cdn:/vfs
  web:
    # source Dockerfile from ./cdn/Dockerfile
    build: ./web
    # start container after api and cdn container are running
    depends_on:
      - api
      - cdn
    ports:
      - 80:3000

volumes:
  # define persistent volume for the database
  database:
  # define persistent volume for the cdn
  cdn:
```

#### Docker images

To reduce the amount of space the docker images occupy we split the image creation into two steps:

1. Build the service
2. Move the build executable to a scratch docker image

Splitting the image creation into these two stages provides a number of benefits, including greater control over the resulting image size and the ability to optimize the build process for each stage. By building the service first and then moving the executable to a separate image, developers can ensure that the final image is as small as possible while still containing all of the necessary components.

Overall, the decision to split the image creation process into two stages is a key strategy for reducing the amount of space occupied by docker images while also ensuring that the images are optimized for performance and ease of use.

##### Docker API

The Api is written in go using the [go fiber](https://gofiber.io/) http server library. It also makes heavy use of the go [mongodb](https://www.mongodb.com/docs/drivers/go/current/) database driver for the database interactions.

The api allows the frontend to interact with the database in a secure way. At the point of writing this the Api supports the following actions:

- registering to private.social
- logging into private.social
- ping request via `/v1/ping`
- getting user data
- updating logged in user data

The REST api is well documented in the [openapi3_0.yaml](/api/openapi3_0) file.

```Dockerfile
# use alpine as the first step images
FROM alpine:latest as builder
WORKDIR /api
# copy files
COPY . .
# install go using alpines package manager
RUN apk add --no-cache go
# build the application with the following flags:
#   CGO_ENABLED=0: disables the usage of cgo (builds dependencies using pure go)
#   -ldflags="-w -s":
#       -s: omit symbol table and debug information
#       -w: omit DWARF symbol table
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o api_app

# use an empty image as the final image base
FROM scratch
# copy the executable from the first step
COPY --from=builder /api/api_app ./api_app
# execute the executable
CMD ["./api_app"]
```

##### Docker CDN

The cdn uses almost the same Dockerfile as the Api. It is also written in go and uses the [go fiber](https://gofiber.io/) http server library.
It does however not require a database connection.

```Dockerfile
# use alpine as the first step images
FROM alpine:latest as builder
WORKDIR /cdn
# copy files
COPY . .
# install go using alpines package manager
RUN apk add --no-cache go
# build the application with the following flags:
#   CGO_ENABLED=0: disables the usage of cgo (builds dependencies using pure go)
#   -ldflags="-w -s":
#       -s: omit symbol table and debug information
#       -w: omit DWARF symbol table
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o cdn_app

# use an empty image as the final image base
FROM scratch
# copy the executable from the first step
COPY --from=builder /cdn/cdn_app ./cdn_app
# execute the executable
CMD ["./cdn_app"]
```

##### Docker WEB

Unfortunately, due to our lack of experience with nginx, We faced some challenges when trying to serve the react production build statically.

In order to overcome this, I opted to use the serve package available on npm, which requires node to run.
Although this is a viable solution, I must say that I was quite taken aback by the size of the `node:lts-alpine` image, which is a whopping 200mb in size!

```Dockerfile
# use the offical node alpine image to build the react app
FROM node:lts-alpine as builder
WORKDIR /web
# copy all files
COPY . .
# install pnpm using npm
RUN npm install -g pnpm
# install depedencies, such as react
RUN pnpm install
# build for production
RUN pnpm build

# use the official nginx alpine image as the final image base
FROM nginx:stable-alpine
# copy the build directory to the nginx image
COPY --from=builder /web/dist /data/www
# copy the nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf
```

I was able to significantly reduce the size of the image from 200mb to a mere 20mb, which translates to a reduction of 90%! This was done by splitting the image creation process into smaller, more manageable parts. Similar to the process i described before.

Once I had familiarized myself with nginx, I utilized it to properly configure the application.

The nginx configuration file plays a critical role in serving the web app and reverse proxy api and cdn.

```nginx
events {}
http {
    # we want mime types such as image/png to be known to nginx
    include mime.types;
    sendfile on;

    server {
        # we map port 80 on the host to port 3000 in the container,
        # therefore we listen on port 3000 here
        listen 3000;

        # localhost/api should be proxied to the container api with port 8000
        location /api {
            proxy_pass http://api:8000;
            # remove '/api/' from the url
            rewrite /api/(.*) /$1 break;
        }

        # localhost/cdn should be proxied to the container cdn with port 8080
        location /cdn {
            proxy_pass http://cdn:8080;
            # remove '/cdn/' from the url
            rewrite /cdn/(.*) /$1 break;
        }

        # serve the files at /data/www at localhost port 3000
        location / {
            root /data/www;
            index index.html;
            # if error 404 occurs, redirect user to index.html
            error_page 404 =200 /index.html
        }
    }
}
```

### Development environment

```bash
git clone https://github.com/xNaCly/private.social.git
cd private.social
```

#### API

```bash
cd api/
mv .env.example .env
# edit MONGO_URL and JWT_SECRET
# choose a fairly complex secret, at least 32 chars long
go run .
```

```text
██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗   ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗                    █████╗ ██████╗ ██╗
██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝   ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║                   ██╔══██╗██╔══██╗██║
██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗     ███████╗██║   ██║██║     ██║███████║██║         █████╗    ███████║██████╔╝██║
██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝     ╚════██║██║   ██║██║     ██║██╔══██║██║         ╚════╝    ██╔══██║██╔═══╝ ██║
██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗██╗███████║╚██████╔╝╚██████╗██║██║  ██║███████╗              ██║  ██║██║     ██║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝              ╚═╝  ╚═╝╚═╝     ╚═╝
2023/03/13 09:58:08 loaded config key 'MONGO_URL' with value 'mongodb+srv://***********************************************************' from env
2023/03/13 09:58:08 loaded config key 'JWT_SECRET' with value 'JWT_SECRET' from env
2023/03/13 09:58:08 Establishing connection to database...
2023/03/13 09:58:09 Connection to database established
2023/03/13 09:58:09 loaded tables 'users', 'posts'
2023/03/13 09:58:09 Setting up the app...
2023/03/13 09:58:09 Registering unauthenticated routes...
2023/03/13 09:58:09 Registered route: [GET] v1/ping
2023/03/13 09:58:09 Registered route: [POST] v1/auth/register
2023/03/13 09:58:09 Registered route: [POST] v1/auth/login
2023/03/13 09:58:09 Registered '3' routes
2023/03/13 09:58:09 Registering authenticated routes...
2023/03/13 09:58:09 Registered route: [GET] v1/user/me
2023/03/13 09:58:09 Registered route: [PUT] v1/user/me
2023/03/13 09:58:09 Registered route: [GET] v1/user/:id
2023/03/13 09:58:09 Registered route: [POST] v1/post/
2023/03/13 09:58:09 Registered route: [GET] v1/post/me
2023/03/13 09:58:09 Registered route: [DELETE] v1/post/:id
2023/03/13 09:58:09 Registered route: [GET] v1/post/:id
2023/03/13 09:58:09 Registered '7' routes
2023/03/13 09:58:09 Starting the app...

 ┌───────────────────────────────────────────────────┐
 │                private.social/api                 │
 │                   Fiber v2.42.0                   │
 │               http://127.0.0.1:8000               │
 │       (bound on host 0.0.0.0 and port 8000)       │
 │                                                   │
 │ Handlers ............ 15  Processes ........... 1 │
 │ Prefork ....... Disabled  PID ............. 84468 │
 └───────────────────────────────────────────────────┘
```

#### WEB

```bash
cd web/
pnpm i
pnpm dev
```

Outputs:

```

  VITE v4.1.4  ready in 344 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help

```

#### CDN

```bash
cd cdn
go run .
```

Outputs:

```text

██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗   ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗                    ██████╗██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝   ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║                   ██╔════╝██╔══██╗████╗  ██║
██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗     ███████╗██║   ██║██║     ██║███████║██║         █████╗    ██║     ██║  ██║██╔██╗ ██║
██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝     ╚════██║██║   ██║██║     ██║██╔══██║██║         ╚════╝    ██║     ██║  ██║██║╚██╗██║
██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗██╗███████║╚██████╔╝╚██████╗██║██║  ██║███████╗              ╚██████╗██████╔╝██║ ╚████║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝               ╚═════╝╚═════╝ ╚═╝  ╚═══╝

 ┌───────────────────────────────────────────────────┐
 │                private.social/cdn                 │
 │                   Fiber v2.42.0                   │
 │               http://127.0.0.1:8080               │
 │       (bound on host 0.0.0.0 and port 8080)       │
 │                                                   │
 │ Handlers ............. 5  Processes ........... 1 │
 │ Prefork ....... Disabled  PID ............. 83839 │
 └───────────────────────────────────────────────────┘
```

### Access

To ensure that everything is working properly, please navigate to http://localhost:3000. If a login box is displayed, you can be confident that everything is functioning as it should
