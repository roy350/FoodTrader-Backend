const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new KoaRouter();

router.post('firebaseToken.create', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    const firebaseToken = ctx.orm.firebaseToken.build(ctx.request.body);
    firebaseToken.userId = currentUser.id;
    const initialFirebaseToken = await ctx.orm.firebaseToken.findOne({
      where: { isActive: true, token: firebaseToken.token },
    });
    if (initialFirebaseToken) {
      const isActive = false;
      await initialFirebaseToken.update({ isActive });
    }
    try {
      await firebaseToken.save({
        fields: ['token', 'userId'],
      });
    } catch (validationError) {
      ctx.status = 500;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
    ctx.status = 201;
    ctx.body = {
      message: 'Firebase token created correctly',
      status: ctx.status,
      message: message.get({ plain: true }),
    };
    return ctx.body;
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

module.exports = router;
