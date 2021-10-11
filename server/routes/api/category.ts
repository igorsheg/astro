import Router from '@koa/router';
import { CategoryController } from '../../controllers';
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

router.del('/category/:id', async ctx => {
  return CategoryController().del(ctx);
});
router.patch('/category/:id', async ctx => {
  return CategoryController().update(ctx);
});

export default router;
