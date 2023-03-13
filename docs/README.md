# Private.social

## Idea

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

![cdn-asset-screenshot.png](assets/cdn-asset-screenshot.png)

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

Directory content overview:

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

- app.go
  - main entry point, contains middlewares and restful server setup
  - bounds the upload handler to POST /v1/upload
  - serves the `vfs` directory statically with a max-age of 3600
- documentation
  - cdn-openapi.yaml
  - Readme .md
- Dockerfile
- dependency managment for go
  - go.sum
  - go.mod
- handlers
  - the handlers which are able to interact with the fiber context
- tests
  - contains unit tests
- util
  - utility module for structs and small helper methods
- vfs
  - directory the cdn creates to store uploaded assets in

####

## Getting started

### Production env

#### Info

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

The Api is writting in go using the [go fiber](https://gofiber.io/) http server library. It also makes heavy use of the go [mongodb](https://www.mongodb.com/docs/drivers/go/current/) database driver for the database interactions.

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

Unfortunately, due to our lack of experience with nginx, We some challenges when trying to serve the react production build statically.

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

### Development env

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

#### WEB

```bash
cd web/
pnpm i
pnpm dev
```

#### CDN

```bash
cd cdn
go run .
```

### Access

To ensure that everything is working properly, please navigate to http://localhost:3000. If a login box is displayed, you can be confident that everything is functioning as it should
