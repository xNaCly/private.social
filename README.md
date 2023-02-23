# private.social 🤠

Private is the privacy respecting, unique and open source social network. Private was first created over the course of the 4th semester in the webengineering module.

## Setup

### Getting started

#### Prod environment:

requires:

- podman / docker
- docker-compose
- podman / docker service enabled and started with systemctl

```bash
git clone https://github.com/xNaCly/private.social.git
# edit the mongodb connection url in the ps.env.example
# rename it to load the config into the docker compose file
mv ps.env.example ps.env
docker compose up
```

### Directory structure

- `web/`: react.js front end
- `api/`: go rest application interface
- `cdn/`: go content delivery network (serves pictures and videos)
