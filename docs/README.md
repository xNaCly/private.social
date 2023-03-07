# Private.social

## Idea

Private.social is designed to be a truly private and secure social network that empowers users to:

- Create an account without requiring an email address or phone number.
  - Optionally add an email address to the account to enable resetting the account password.
- Set all accounts to private visibility by default.
  (Only followers can view profile data and posts from a private account.)
- Secure all API interactions with JWT tokens.
- Store passwords in the database hashed with bcrypt.
- Enforce password requirements:
  - Minimum of 10 characters.
  - At least one symbol.
  - At least one uppercase character.
  - At least one number.

Non-privacy related features:

- Self-hostable API, CDN, and web.
- Home view sorted chronologically.
- Posts:
  - Likes:
    - Private (only the creators can see the number of likes).
    - Disable (no one can like the post).
  - Comments:
    - Restricted (only followers can comment).
    - Mention-only (only mentioned users can comment).
    - Disable (no one can comment).
  - Caption.
  - Collaboration on posts.
- Profile:
  - Biography:
    - Text biography.
    - Custom pronouns.
    - Profile picture.
    - Profile banner.
    - Website.
    - Location.
  - Customize profile using CSS.

Mental health related features:

- Likes and comments can be restricted and disabled.
- Users can be blocked, muted, and reported.
- Posts can be reported.

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

### Directory structure

This project is structured into four main directories:

- `web/`: This folder contains the front-end portion of the application, which is built with React.js.
- `api/`: This directory contains the back-end of the application, which is built with Go.
- `cdn/`: This folder contains the content delivery network of the application, which is built with Go. The CDN serves pictures and videos.
- `docs/`: This folder contains the documentation for the project.

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
  `bdatabase:
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
        }

        # localhost/cdn should be proxied to the container cdn with port 8080
        location /cdn {
            proxy_pass http://cdn:8080;
        }

        # serve the files at /data/www at localhost port 3000
        location / {
            root /data/www;
            index index.html;
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
