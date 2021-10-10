import Router from '@koa/router';
import { FileUploadController } from '../../controllers';
const router = new Router();

router.post('/upload', async ctx => {
  return FileUploadController().upload(ctx);
});
router.allowedMethods();

export default router;
