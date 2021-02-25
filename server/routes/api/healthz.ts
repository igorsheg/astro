import { HealthzController } from '../../controllers';
import Router from '@koa/router';
const router = new Router();

router.get('/healthz', async ctx => {
  return HealthzController().ping(ctx);
});

router.get('/healthz/db', async ctx => {
  return HealthzController().pingDb(ctx);
});

export default router;
