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
    ctx.throw(500, `${validationError}`);
  }
  ctx.status = 201;
  ctx.body = [
    {
      message: 'User created correctly',
      status: ctx.status,
      user: user.get({ plain: true }),
    },
  ];
  return ctx.body;
});

module.exports = router;
