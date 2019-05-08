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
      ctx.body = publications;
      return ctx.body;
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    return { message: ctx.message, status: ctx.status };
  }
});

router.get('publication', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const publication = await ctx.orm.publication
        .findAll({ where: { id: ctx.params.id, isActive: true } })
        .map(element => element.get({ plain: true }));
      if (!publication) {
        ctx.status = 404;
        ctx.message = 'Publication not found';
        return { message: ctx.message, status: ctx.status };
      }
      ctx.body = publication;
      return ctx.body;
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    return { message: ctx.message, status: ctx.status };
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
      ctx.throw(500, `${validationError}`);
    }
    ctx.status = 201;
    ctx.body = [
      {
        message: 'Publication created correctly',
        status: ctx.status,
        publication: publication.get({ plain: true }),
      },
    ];
    return ctx.body;
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    return { message: ctx.message, status: ctx.status };
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
        return { message: ctx.message, status: ctx.status };
      }
      if (currentUser.id === publication.userId) {
        try {
          const { title, content, place } = ctx.request.body;
          await publication.update({ title, content, place });
        } catch (validationError) {
          ctx.throw(500, `${validationError}`);
        }
        ctx.status = 200;
        ctx.body = [
          {
            message: 'Publication updated correctly',
            status: ctx.status,
            publication: publication.get({ plain: true }),
          },
        ];
        return ctx.body;
      } else {
        ctx.status = 401;
        ctx.message = 'Unauthorized for update publication';
        return { message: ctx.message, status: ctx.status };
      }
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    return { message: ctx.message, status: ctx.status };
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
        return { message: ctx.message, status: ctx.status };
      }
      if (currentUser.id === publication.userId) {
        try {
          const isActive = false;
          await publication.update({ isActive });
        } catch (validationError) {
          ctx.throw(500, `${validationError}`);
        }
        ctx.status = 200;
        ctx.body = [
          {
            message: 'Publication deleted correctly',
            status: ctx.status,
            publication: publication.get({ plain: true }),
          },
        ];
        return ctx.body;
      } else {
        ctx.status = 401;
        ctx.message = 'Unauthorized for update publication';
        return { message: ctx.message, status: ctx.status };
      }
    } catch (validationError) {
      ctx.throw(500, `${validationError}`);
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    return { message: ctx.message, status: ctx.status };
  }
});

module.exports = router;
