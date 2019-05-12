const jwt = require('jsonwebtoken');
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('auth', '/', async ctx => {
  const { username, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { username } });
  if (!user) {
    ctx.status = 404;
    ctx.message = 'Wrong username';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
  if (await user.checkPassword(password)) {
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        password: user.password,
        address: user.address,
        email: user.email,
        isOrganization: user.isOrganization,
        isActive: user.isActive,
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
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

module.exports = router;
