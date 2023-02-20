FROM node:lts-alpine
WORKDIR /web
COPY . .
RUN yarn install
RUN yarn build
RUN yarn global add serve
CMD ["serve", "-s", "dist"]
