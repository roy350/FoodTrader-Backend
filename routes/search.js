const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new KoaRouter();

router.post('publicationsUser', '/', async ctx => {
  const { like, type } = ctx.request.body;
  const { Op } = ctx.orm.Sequelize;
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    if (type === 'publications') {
      try {
        const publications = await ctx.orm.publication
          .findAll({
            where: {
              isActive: true,
              title: {
                [Op.iLike]: `%${like}%`,
              },
            },
          })
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
    } else if (type === 'users') {
      try {
        const users = await ctx.orm.user
          .findAll({
            where: {
              isActive: true,
              [Op.or]: [
                {
                  username: {
                    [Op.iLike]: `%${like}%`,
                  },
                },
                {
                  name: {
                    [Op.iLike]: `%${like}%`,
                  },
                },
              ],
            },
          })
          .map(element => element.get({ plain: true }));
        ctx.body = users;
        return ctx.body;
      } catch (validationError) {
        ctx.status = 403;
        ctx.message = 'Internal Server Error';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

module.exports = router;
