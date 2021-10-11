FROM mhart/alpine-node AS builder

WORKDIR /app

COPY  package.json /app
RUN yarn --production=true --quiet=true && yarn add -D typescript @types/node @types/react
COPY . /app

RUN yarn build 

######################################################

FROM mhart/alpine-node:slim as prod
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/bin ./bin
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]

