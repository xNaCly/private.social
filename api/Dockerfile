FROM alpine:3.14
WORKDIR /api
COPY . .
RUN apk add --no-cache go
RUN go build -o api_app
CMD ["./api_app"]
