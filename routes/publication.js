const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new KoaRouter();

router.get('publications', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const publications = await ctx.orm.publication
        .findAll({ where: { isActive: true } })
        .map(element => element.get({ plain: true }));
      const response = [];
      for (const publication of publications) {
        const user = await ctx.orm.user.findOne({
          where: { id: publication.userId },
        });
        response.push({ publication, user: user.get({ plain: true }) });
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

router.get('publication', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const initialPublication = await ctx.orm.publication.findOne({
        where: { id: ctx.params.id, isActive: true },
      });
      if (!initialPublication) {
        ctx.status = 404;
        ctx.message = 'Publication not found';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      const publication = initialPublication.get({ plain: true });
      const user = await ctx.orm.user.findOne({
        where: { id: publication.userId },
      });
      ctx.body = { publication, user: user.get({ plain: true }) };
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

router.post('publication.create', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    const publication = ctx.orm.publication.build(ctx.request.body);
    publication.userId = currentUser.id;
    try {
      await publication.save({
        fields: ['title', 'content', 'place', 'userId'],
      });
    } catch (validationError) {
      ctx.status = 500;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
    ctx.status = 201;
    ctx.body = {
      message: 'Publication created correctly',
      status: ctx.status,
      publication: publication.get({ plain: true }),
    };
    return ctx.body;
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
    try {
      const publication = await ctx.orm.publication.findOne({
        where: { id: ctx.params.id },
      });
      if (!publication) {
        ctx.status = 404;
        ctx.message = 'Publication not found';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      if (currentUser.id === publication.userId) {
        try {
          const { title, content, place } = ctx.request.body;
          await publication.update({ title, content, place });
        } catch (validationError) {
          ctx.status = 500;
          ctx.message = 'Internal Server Error';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        ctx.status = 200;
        ctx.body = {
          message: 'Publication updated correctly',
          status: ctx.status,
          publication: publication.get({ plain: true }),
        };
        return ctx.body;
      } else {
        ctx.status = 401;
        ctx.message = 'Unauthorized for update publication';
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

router.del('user.delete', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const publication = await ctx.orm.publication.findOne({
        where: { id: ctx.params.id },
      });
      if (!publication) {
        ctx.status = 404;
        ctx.message = 'Publication not found';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      if (currentUser.id === publication.userId) {
        try {
          const isActive = false;
          await publication.update({ isActive });
        } catch (validationError) {
          ctx.status = 500;
          ctx.message = 'Internal Server Error';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        ctx.status = 200;
        ctx.body = {
          message: 'Publication deleted correctly',
          status: ctx.status,
          publication: publication.get({ plain: true }),
        };
        return ctx.body;
      } else {
        ctx.status = 401;
        ctx.message = 'Unauthorized for update publication';
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
