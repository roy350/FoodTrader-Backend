const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('user.create', '/new', async ctx => {
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
  ctx.body = 'User created correctly';
  ctx.status = 201;
});

module.exports = router;
