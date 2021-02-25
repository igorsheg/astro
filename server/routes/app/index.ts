import Router from '@koa/router';
import nextapp from '../../nextapp';
const router = new Router();

const handler = nextapp.getRequestHandler();

router.all(/^\/(?!api).*/, async ctx => {
  await handler(ctx.req, ctx.res);
  ctx.respond = false;
});

export default router;
