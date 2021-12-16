FROM golang:1.17.3-alpine3.14 AS builder

WORKDIR /app

RUN apk add sqlite yarn gcc libc-dev

COPY . .

RUN cd web && yarn install && NODE_ENV=production yarn build
RUN cd server && go build -o astroserver.sh cmd/astro/main.go

######################################################

FROM alpine:3.14 as prod


WORKDIR /app

COPY --from=builder /app/web/statics ./web/statics
COPY --from=builder /app/web/public ./web/public
COPY --from=builder /app/web/index.html ./web/index.html
COPY --from=builder /app/server/astroserver.sh ./server/astroserver.sh
COPY --from=builder /app/server/data ./server/data
COPY --from=builder /app/.env .

WORKDIR /app/server
ENV GIN_MODE=release
EXPOSE 8088

CMD ["./astroserver.sh"]


