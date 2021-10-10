import Router from '@koa/router';
import categoryRoutes from './category';
import configRoutes from './config';
import uploadRoutes from './file';
import healthzRoutes from './healthz';
import servicesRoutes from './service';
import themeRoutes from './theme';

const apiRouter = new Router({ prefix: '/api' });

apiRouter.use(
  configRoutes.routes(),
  servicesRoutes.routes(),
  themeRoutes.routes(),
  healthzRoutes.routes(),
  uploadRoutes.routes(),
  categoryRoutes.routes(),
);

export default apiRouter;
