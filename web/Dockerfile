FROM node:lts-alpine as builder
WORKDIR /web
COPY . .
RUN yarn install
RUN yarn build

FROM node:lts-alpine
RUN yarn global add serve
COPY --from=builder /web/dist /dist
CMD ["serve", "-s", "/dist"]
