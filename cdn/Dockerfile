FROM alpine:latest as builder
WORKDIR /cdn
COPY . .
RUN apk add --no-cache go
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o cdn_app

FROM scratch
COPY --from=builder /cdn/cdn_app ./cdn_app
CMD ["./cdn_app"]
