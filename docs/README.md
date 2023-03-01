# Private.social

## Idea

Private.social is intended as a truly private and secure social network, which gives the power to the user:

- Creating an account does not require an email or a telephone number.
  - an email can be added to the account optionally to allow for
    resetting the accounts password
- All Accounts are set to visibility private by default
  (only followers can see profile data and posts from a private account)
- All API interactions are secured with jwt tokens
- Passwords are stored in the database hashed with bcrypt
- Password requirements:
  - min 10 chars
  - one symbol
  - one uppercase char
  - one number

Non privacy related features:

- Selfhostable api, cdn and web
- Chronologial sorted Home view
- Posts:
  - likes
    - private (only the creators see the like amount)
    - disable (no one can like the post)
  - comments
    - restricted (only followers can comment)
    - mention only (only mentioned users can comment)
    - disable (no one can comment)
  - caption
  - collaborate together on posts
- Profile
  - biography
    - text biography
    - custom pronouns
    - profile picture
    - profile banner
    - website
    - location
  - customize profile using css

Mental health related features:

- Likes and comments can be restricted and disabled
- Users can be blocked, muted and reported
- Posts can be reported

## Motivation

Private.social development started in the 4th semester of our
applied computer science bachelor and was created by the following four people:

- [xnacly](https://github.com/xnacly)
- [ellirynbw](https://github.com/ellirynbw)
- [derPhilosoff](https://github.com/derPhilosoff)
- [Nosch](https://github.com/noschnosch)

The task of the examination of the above-mentioned semester was to create and
document an application which uses at least two micro services.
One had to be programmed by our group and one could be
any publicly available online web service. To receive a mark better than good a
group had to create either a frontend web application or a mobile application.
Furthermore the specification tasks the groups with documenting application interfaces
with openAPI and record what member of the group did what task.

Private.social uses two micro services programmed by ourself:

- **api**: to allow the web frontend to interact with the database
- **cdn**: to store assets
- **web**: the web interface

And one microservice as a database:

- **mongo**: the database to store all user and post data

### Directory structure

- `web/`: react.js front end
- `api/`: go application interface
- `cdn/`: go content delivery network (serves pictures and videos)
- `docs/`: documentation

## Getting started

### Production env

#### Info

- The docker-compose config spins up the api, cdn, web and a mongo container.
- The web app is built for production and served using nginx.
- The mongo image uses a volume and is therefore persistent
- The api is exposed on port 8000, the cdn at 8080 and the web at 80.
- Nginx reverse proxy is used to map:
  - localhost/api to localhost:8000
  - localhost/cdn to localhost:8080

#### Image sizes

| image | size | base                | tech stack                     |
| ----- | ---- | ------------------- | ------------------------------ |
| web   | 20mb | nginx:stable-alpine | typescript, react, vite, nginx |
| cdn   | 7mb  | scratch             | go, fiber                      |
| api   | 7mb  | scratch             | go, fiber, go mongodb driver   |

#### Docker compose

requires:

- docker
- docker-compose
- docker service enabled and started with systemctl

```bash
git clone https://github.com/xNaCly/private.social.git
mv ps.env.example ps.env
# edit the JWT_SECRET in the ps.env.example
# choose a fairly complex secret, at least 32 chars long
docker compose up
```

Now navigate to http://localhost and check if there is no error displayed.

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

To reduce the amount of space the docker images occupy we split the image
creation into two steps:

1. Build the service
2. Move the build executable to a scratch docker image

##### Docker API

The cdn is a simple go application with some dependencies:

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

The cdn uses almost the same Dockerfile as the api.

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

Due to my missing knowledge of nginx
i tried to statically serve the react production build using [serve](https://www.npmjs.com/package/serve),
which requires node to run.
Even the `node:lts-alpine` image is 200mb in size, which is way to big for my liking.

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

Splitting the image creation reduced the image size from 200mb to 20mb (-90%)

After familiarizing myself with nginx i used it to properly configure the application.

The nginx config is used to serve the web app and reverse proxy api and cdn:

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

Navigate to http://localhost:3000 and if a login box is displayed everything works as intended.
