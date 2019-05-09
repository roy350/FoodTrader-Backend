const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('user.create', '/', async ctx => {
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({
      fields: [
        'name',
        'username',
        'password',
        'address',
        'email',
        'isOrganization',
      ],
    });
  } catch (validationError) {
    ctx.status = 500;
    ctx.message = 'Internal Server Error';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
  ctx.status = 201;
  ctx.body = {
    message: 'User created correctly',
    status: ctx.status,
    user: user.get({ plain: true }),
  };
  return ctx.body;
});

module.exports = router;
