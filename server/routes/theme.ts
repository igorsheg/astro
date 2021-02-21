import { ThemeController } from '../controllers';
import Router from '@koa/router';
const router = new Router();

router.get('/theme', async ctx => {
  return ThemeController().list(ctx);
});

router.get('/theme/:id', async ctx => {
  return ThemeController().get(ctx);
});

export default router;
