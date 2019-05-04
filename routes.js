const KoaRouter = require('koa-router');

const index = require('./routes/index');
const user = require('./routes/user');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/users', user.routes());

module.exports = router;
