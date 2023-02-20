FROM alpine:3.14
WORKDIR /cdn
COPY . .
RUN apk add --no-cache go
RUN go build -o cdn_app
CMD ["./cdn_app"]
