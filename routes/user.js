const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('users', '/', async ctx => {
  try {
    const users = await ctx.orm.user.findAll();
    ctx.body = users;
  } catch (validationError) {
    ctx.throw(500, `${validationError}`);
  }
});

router.get('users', '/:id', async ctx => {
  try {
    const user = await ctx.orm.user.findOne({ where: { id: ctx.params.id } });
    if (!user) {
      ctx.status = 404;
      ctx.message = 'User not found';
      return ctx.message;
    }
    ctx.body = user;
  } catch (validationError) {
    ctx.throw(500, `${validationError}`);
  }
});

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

router.patch('user.update', '/edit/:id', async ctx => {
  try {
    const user = await ctx.orm.user.findOne({ where: { id: ctx.params.id } });
    if (!user) {
      ctx.status = 404;
      ctx.message = 'User not found';
      return ctx.message;
    }
    try {
      const { name, username, password, address, email } = ctx.request.body;
      await user.update({ username, name, password, address, email });
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
    ctx.body = 'User updated correctly';
    ctx.status = 200;
  } catch (validationError) {
    ctx.throw(500, `${validationError}`);
  }
});

router.del('user.delete', '/:id', async ctx => {
  try {
    const user = await ctx.orm.user.findOne({ where: { id: ctx.params.id } });
    if (!user) {
      ctx.status = 404;
      ctx.message = 'User not found';
      return ctx.message;
    }
    try {
      const isActive = false;
      await user.update({ isActive });
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
    ctx.body = 'User deleted correctly';
    ctx.status = 200;
  } catch (validationError) {
    ctx.throw(500, `${validationError}`);
  }
});

module.exports = router;
