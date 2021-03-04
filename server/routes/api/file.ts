import { FileUploadController } from '../../controllers';
import Router from '@koa/router';
const router = new Router();

router.post('/upload', async ctx => {
  return FileUploadController().upload(ctx);
});
router.allowedMethods();

export default router;
