const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', ctx => {
  ctx.body = '<h2>HomePage</h2>';
});

router.get('/test', ctx => {
  ctx.body = '<h2>VerCel Demo</h2>';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
  console.log('project is running at http://localhost:8080');
});