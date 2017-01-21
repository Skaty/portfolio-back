import 'babel-polyfill';
import Koa from 'koa';

import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';

import Boom from 'boom';
import loggerMiddleware from 'koa-bunyan-logger';
import errorMiddleware from './middleware/error';
import generate from './util/generate';

import log from './util/log';

const app = new Koa();
const router = new Router();
const bodyparser = new BodyParser();

// Register middleware
app.use(bodyparser);
app.use(loggerMiddleware(log));
app.use(loggerMiddleware.requestIdContext());
app.use(loggerMiddleware.requestLogger());
app.use(errorMiddleware());

// Registers routes
router.get('/page/:id/:tid', async (ctx) => {
  log.info(ctx.params.tid);
  ctx.body = await generate(ctx.params.id, ctx.params.tid);
});

app.use(router.routes());
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed(),
}));

log.info('current environment: %s', process.env.NODE_ENV);
log.info('server started at port: %d', process.env.PORT);
app.listen(process.env.PORT);
