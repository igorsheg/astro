import { ServiceController } from '../../controllers';
import Router from '@koa/router';
const router = new Router();

router.get('/service', async ctx => {
  return ServiceController().list(ctx);
});

router.get('/service/:id', async ctx => {
  return ServiceController().get(ctx);
});

router.post('/service', async ctx => {
  return ServiceController().post(ctx);
});

export default router;
