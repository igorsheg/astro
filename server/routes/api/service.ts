import Router from '@koa/router';
import { ServiceController } from '../../controllers';
const router = new Router();

router.get('/service', async ctx => {
  return ServiceController().list(ctx);
});

router.get('/service/:id', async ctx => {
  return ServiceController().get(ctx);
});

router.del('/service/:id', async ctx => {
  return ServiceController().deleteEntity(ctx);
});

router.post('/service', async ctx => {
  return ServiceController().post(ctx);
});
router.get('/serviceping', async () => {
  return ServiceController().ping();
});
router.patch('/service/:id', async ctx => {
  return ServiceController().update(ctx);
});

export default router;
