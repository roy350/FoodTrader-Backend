const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new KoaRouter();

router.get('users', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const users = await ctx.orm.user.findAll({ where: { isActive: true } });
      ctx.body = users;
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
  }
});

router.get('users', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const user = await ctx.orm.user.findOne({
        where: { id: ctx.params.id, isActive: true },
      });
      if (!user) {
        ctx.status = 404;
        ctx.message = 'User not found';
        return { message: ctx.message, status: ctx.status };
      }
      ctx.body = user;
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
  }
});

router.patch('user.update', '/edit/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser.id === Number(ctx.params.id)) {
    try {
      const user = await ctx.orm.user.findOne({ where: { id: ctx.params.id } });
      if (!user) {
        ctx.status = 404;
        ctx.message = 'User not found';
        return { message: ctx.message, status: ctx.status };
      }
      try {
        const { name, username, password, address, email } = ctx.request.body;
        await user.update({ username, name, password, address, email });
      } catch (validationError) {
        ctx.throw(500, `${validationError}`);
      }
      ctx.status = 200;
      ctx.body = {
        message: 'User updated correctly',
        status: ctx.status,
        user,
      };
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
  } else {
    ctx.status = 401;
    ctx.message = 'Unauthorized for update user';
    return { message: ctx.message, status: ctx.status };
  }
});

router.del('user.delete', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser.id === Number(ctx.params.id)) {
    try {
      const user = await ctx.orm.user.findOne({ where: { id: ctx.params.id } });
      if (!user) {
        ctx.status = 404;
        ctx.message = 'User not found';
        return { message: ctx.message, status: ctx.status };
      }
      try {
        const isActive = false;
        await user.update({ isActive });
      } catch (validationError) {
        ctx.throw(500, `${validationError}`);
      }
      ctx.status = 200;
      ctx.body = {
        message: 'User deleted correctly',
        status: ctx.status,
        user,
      };
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
  } else {
    ctx.status = 401;
    ctx.message = 'Unauthorized for delete user';
    return { message: ctx.message, status: ctx.status };
  }
});

module.exports = router;
