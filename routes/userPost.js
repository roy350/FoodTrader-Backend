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
    if (validationError.name === 'SequelizeUniqueConstraintError') {
      validationError = validationError.errors[0].message;
    } else {
      validationError = validationError.parent.column + ' must not be empty';
    }
    ctx.status = 500;
    ctx.message = validationError;
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
