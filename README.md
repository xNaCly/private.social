# private.social 🤠

Private is a POC of a privacy respecting, unique and open source social network.
Private was first created over the course of the 4th semester in the web services module.

-   [Documentation](/docs/)

## Quickstart

1. copy the `api/.env.example` file as `api/.env` and edit the values inside:
    - `MONGO_URL`: create a database using mongodb atlas and insert its connection uri
    - `JWT_SECRET`: choose a secure jwt secret
2. install [gleichzeitig](https://github.com/xNaCly/gleichzeitig) and run it using `gleichzeitig`, this starts the cdn, the api and the web interface
