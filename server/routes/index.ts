import Router from '@koa/router';
import configRoutes from './config';
import servicesRoutes from './service';
import themeReoutes from './theme';
const apiRouter = new Router({ prefix: '/api' });

apiRouter.use(
  configRoutes.routes(),
  servicesRoutes.routes(),
  themeReoutes.routes(),
);

export default apiRouter;
