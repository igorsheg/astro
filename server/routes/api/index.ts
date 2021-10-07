import Router from '@koa/router';
import configRoutes from './config';
import servicesRoutes from './service';
import themeRoutes from './theme';
import healthzRoutes from './healthz';
import uploadRoutes from './file';
import categoryRoutes from './category';

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
