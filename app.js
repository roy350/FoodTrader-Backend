const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');
const koaFlashMessage = require('koa-flash-message').default;
const koaStatic = require('koa-static');
const session = require('koa-session');
const override = require('koa-override-method');
const routes = require('./routes');
const orm = require('./models');
const cors = require('koa-cors');
const KoaRouter = require('koa-router');

// App constructor
const app = new Koa();
const router = new KoaRouter();

app.keys = [
  'these secret keys are used to sign HTTP cookies',
  'to make sure only this app can generate a valid one',
  'and thus preventing someone just writing a cookie',
  "saying he is logged in when it's really not",
];

// expose ORM through context's prototype
app.context.orm = orm;

/**
 * Middlewares
 */

// expose running mode in ctx.state
app.use((ctx, next) => {
  ctx.state.env = ctx.app.env;
  return next();
});

// log requests
app.use(koaLogger());

app.use(koaStatic(path.join(__dirname, '..', 'build'), {}));

// expose a session hash to store information across requests from same client
app.use(
  session(
    {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
    },
    app
  )
);

// flash messages support
app.use(koaFlashMessage);

// parse request body
app.use(
  koaBody({
    multipart: true,
    keepExtensions: true,
  })
);

app.use((ctx, next) => {
  ctx.request.method = override.call(
    ctx,
    ctx.request.body.fields || ctx.request.body
  );
  return next();
});

// Routing middleware
app.use(routes.routes());

// Fix Cors errors
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

router.get('/', async ctx => {
  ctx.body = 'Probando';
});

module.exports = app;
