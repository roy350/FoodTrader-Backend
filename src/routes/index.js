const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('/', async ctx => {
  ctx.body = 'Probando';
});

module.exports = router;
