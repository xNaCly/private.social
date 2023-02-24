FROM node:lts-alpine as builder
WORKDIR /web
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

# TODO: Use a lighter base image, serve using nginx
FROM node:lts-alpine
RUN yarn global add serve
COPY --from=builder /web/dist /dist
CMD ["serve", "-s", "/dist"]
