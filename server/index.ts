/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import Router from '@koa/router';
import axios from 'axios';
import compression from 'compression';
import Koa from 'koa';
import koaBody from 'koa-body';
import koaConnect from 'koa-connect';
import serve from 'koa-static';
import path from 'path';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import winston from 'winston';
import { logger } from './config/logger';
import { serverConfig } from './config/serverConfig';
import nextapp from './nextapp';
import apiRouter from './routes/api';
import appRouter from './routes/app';

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

  setInterval(function () {
    console.info('Running scheduled checks');
    (async () => {
      axios.get('http://localhost:3000/api/serviceping');
    })();
  }, 60000);

  server.listen(serverConfig.port, () => {
    console.log(`> Ready on http://localhost:${serverConfig.port}`);
  });
});
