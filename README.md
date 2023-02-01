# private.social

Private is the privacy respecting, unique and open source social network. Private was firstly created over the course of the 4th semester in the webengineering module.

## Setup

### Getting started

#### Prod environment:

```bash
git clone https://github.com/xNaCly/webengineering-2.git
docker compose up
```

#### Dev environment

```bash
git clone https://github.com/xNaCly/webengineering-2.git
cd web
yarn
yarn start
```

### Directory structure

- `web/`: react.js front end
- `api/`: go rest application interface
- `cdn/`: go content delivery network (serves pictures and videos)
- `crawler/`: go crawler to fetch metadata from websites - used to generate previews in the client
