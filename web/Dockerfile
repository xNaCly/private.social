FROM node:lts-alpine as builder
WORKDIR /web
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM nginx:stable-alpine
COPY --from=builder /web/dist /data/www
COPY ./nginx.conf /etc/nginx/nginx.conf
