FROM alpine:latest as builder
WORKDIR /api
COPY . .
RUN apk add --no-cache go
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o api_app

FROM scratch
COPY --from=builder /api/api_app ./api_app
CMD ["./api_app"]
