import { CategoryController } from '../../controllers';
import Router from '@koa/router';
const router = new Router();

router.get('/category', async ctx => {
  return CategoryController().list(ctx);
});

router.get('/category/:id', async ctx => {
  return CategoryController().get(ctx);
});

router.post('/category', async ctx => {
  return CategoryController().post(ctx);
});

export default router;
