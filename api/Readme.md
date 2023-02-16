# Api

REST api for the private.social network

## Authentication

- jwt

### Login

- username, password

### Signup

- username
- password
- hcaptcha / email

## Planned routes:

- `GET /homepage`: returns array of posts from users the currently logged in user follows
- `POST /profile/me`: update data for the currently logged in user
- `GET /profile/me`: returns data for the currently logged in user:
  - username
  - displayname
  - bio, pronouns, location, personal website
  - follower amount, following amount, post amount
- `GET /profile/:username`: returns data for the `username`
- `GET /search/:text`: searches for the `text` in the database (should return array of users matching `text`)
- `GET /post/:id`: returns data for the post with the `id`, contains
  - comments
  - likes
  - description
  - authors
  - post cdn url
- `POST /post`: create a new post
