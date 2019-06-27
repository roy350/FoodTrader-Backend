require('dotenv').config();

const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const user = require('./routes/user');
const auth = require('./routes/auth');
const usersPost = require('./routes/userPost');
const publication = require('./routes/publication');
const review = require('./routes/review');
const search = require('./routes/search');
const chat = require('./routes/chat');
const message = require('./routes/message');
const firebaseToken = require('./routes/firebaseToken');

const router = new KoaRouter();

router.use('/auth', auth.routes());
router.use('/users', usersPost.routes());

router.use(jwt({ secret: process.env.WORD_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData) {
    ctx.state.currentUser = await ctx.orm.user.findOne({
      where: { id: ctx.state.authData.id },
    });
  }
  return next();
});

router.use('/users', user.routes());
router.use('/publications', publication.routes());
router.use('/reviews', review.routes());
router.use('/search', search.routes());
router.use('/chats', chat.routes());
router.use('/messages', message.routes());
router.use('/firebaseToken', firebaseToken.routes());

module.exports = router;
