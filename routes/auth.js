const jwt = require('jsonwebtoken');
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('auth', '/', async ctx => {
  const { username, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { username } });
  if (!user) {
    ctx.status = 404;
    ctx.message = 'Wrong username';
    return { message: ctx.message, status: ctx.status };
  }
  if (await user.checkPassword(password)) {
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.WORD_SECRET,
      {
        expiresIn: '12h',
      }
    );
    ctx.body = { token };
    return ctx.body;
  } else {
    ctx.status = 404;
    ctx.message = 'Wrong password';
    return { message: ctx.message, status: ctx.status };
  }
});

module.exports = router;
