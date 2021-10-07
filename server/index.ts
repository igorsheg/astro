/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import Router from '@koa/router';
import Koa from 'koa';
import koaBody from 'koa-body';
import koaConnect from 'koa-connect';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import winston from 'winston';
import { logger } from './config/logger';
import { serverConfig } from './config/serverConfig';
import nextapp from './nextapp';
import apiRouter from './routes/api';
import appRouter from './routes/app';
import compression from 'compression';
import path from 'path';
import serve from 'koa-static';

nextapp.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();

  //@ts-ignore
  server.use(koaConnect(compression()));
  server.use(serve('./public'));
  server.use(logger(winston));
  server.use(
    koaBody({
      multipart: true,
      formidable: {
        multiples: false,
        uploadDir: path.join(process.cwd(), 'public/logos'),
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024,
      },
    }),
  );

  await createConnection(serverConfig.dbConnectionOptions);

  server.use(appRouter.routes());
  server.use(apiRouter.routes());
  server.use(router.routes());

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.listen(serverConfig.port, () => {
    console.log(`> Ready on http://localhost:${serverConfig.port}`);
  });
});
