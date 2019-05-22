const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new KoaRouter();

router.get('reviews', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const reviews = await ctx.orm.review
        .findAll({ where: { isActive: true, userCreatorId: currentUser.id } })
        .map(element => element.get({ plain: true }));
      const response = [];
      for (const review of reviews) {
        const user = await ctx.orm.user.findOne({
          where: { id: review.userId },
        });
        response.push({
          review,
          user: user.get({ plain: true }),
        });
      }
      ctx.body = response;
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

router.post('review.create', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    const review = ctx.orm.review.build(ctx.request.body);
    console.log(review);
    review.userCreatorId = currentUser.id;
    console.log(review);
    try {
      await review.save({
        fields: ['content', 'value', 'userCreatorId', 'userId'],
      });
    } catch (validationError) {
      ctx.status = 500;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
    ctx.status = 201;
    ctx.body = {
      message: 'Review created correctly',
      status: ctx.status,
      review: review.get({ plain: true }),
    };
    return ctx.body;
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

router.put('review.update', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const review = await ctx.orm.review.findOne({
        where: { id: ctx.params.id },
      });
      if (!review) {
        ctx.status = 404;
        ctx.message = 'Review not found';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      if (currentUser.id === review.userCreatorId) {
        try {
          const { content, value } = ctx.request.body;
          await review.update({ content, value });
        } catch (validationError) {
          ctx.status = 500;
          ctx.message = 'Internal Server Error';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        ctx.status = 200;
        ctx.body = {
          message: 'Review updated correctly',
          status: ctx.status,
          review: review.get({ plain: true }),
        };
        return ctx.body;
      } else {
        ctx.status = 401;
        ctx.message = 'Unauthorized for update review';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
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

router.del('review.delete', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const review = await ctx.orm.review.findOne({
        where: { id: ctx.params.id },
      });
      if (!review) {
        ctx.status = 404;
        ctx.message = 'Review not found';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      if (currentUser.id === review.userCreatorId) {
        try {
          const isActive = false;
          await review.update({ isActive });
        } catch (validationError) {
          ctx.status = 500;
          ctx.message = 'Internal Server Error';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        ctx.status = 200;
        ctx.body = {
          message: 'Review deleted correctly',
          status: ctx.status,
          review: review.get({ plain: true }),
        };
        return ctx.body;
      } else {
        ctx.status = 401;
        ctx.message = 'Unauthorized for update review';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
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

module.exports = router;
