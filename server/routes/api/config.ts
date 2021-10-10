import Router from '@koa/router';
import { ConfigController } from '../../controllers';
const router = new Router();

router.get('/config', async ctx => {
  return ConfigController().list(ctx);
});

router.get('/config/:id', async ctx => {
  return ConfigController().get(ctx);
});

router.post('/config/:id', async ctx => {
  return ConfigController().update(ctx);
});

export default router;
