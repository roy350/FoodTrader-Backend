const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new KoaRouter();

router.get('users', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const users = await ctx.orm.user
        .findAll({ where: { isActive: true } })
        .map(element => element.get({ plain: true }));
      ctx.body = users;
      return ctx.body;
    } catch (validationError) {
      ctx.status = 403;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
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
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      ctx.body = user.get({ plain: true });
      return ctx.body;
    } catch (validationError) {
      ctx.status = 500;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

router.put('user.update', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    if (currentUser.id === Number(ctx.params.id)) {
      try {
        const user = await ctx.orm.user.findOne({
          where: { id: ctx.params.id },
        });
        if (!user) {
          ctx.status = 404;
          ctx.message = 'User not found';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        try {
          const { name, username, password, address, email } = ctx.request.body;
          await user.update({ username, name, password, address, email });
        } catch (validationError) {
          ctx.status = 500;
          ctx.message = 'Internal Server Error';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        ctx.status = 200;
        ctx.body = {
          message: 'User updated correctly',
          status: ctx.status,
          user: user.get({ plain: true }),
        };
        return ctx.body;
      } catch (validationError) {
        ctx.status = 500;
        ctx.message = 'Internal Server Error';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
    } else {
      ctx.status = 401;
      ctx.message = 'Unauthorized for update user';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

router.del('user.delete', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    if (currentUser.id === Number(ctx.params.id)) {
      try {
        const user = await ctx.orm.user.findOne({
          where: { id: ctx.params.id },
        });
        if (!user) {
          ctx.status = 404;
          ctx.message = 'User not found';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        try {
          const isActive = false;
          await user.update({ isActive });
        } catch (validationError) {
          ctx.status = 500;
          ctx.message = 'Internal Server Error';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        ctx.status = 200;
        ctx.body = {
          message: 'User deleted correctly',
          status: ctx.status,
          user: user.get({ plain: true }),
        };
        return ctx.body;
      } catch (validationError) {
        ctx.status = 500;
        ctx.message = 'Internal Server Error';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
    } else {
      ctx.status = 401;
      ctx.message = 'Unauthorized for delete user';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

module.exports = router;
