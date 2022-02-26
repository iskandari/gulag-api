const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const koajwt = require('koa-jwt');

require('dotenv').config();

const router = require('./router');

const app = new Koa();
function logger(format) {
  format = format || ':method ":url"';

  return async function (ctx, next) {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url);

    console.log(str);

    await next();
  };
}

app.use(logger());

app
  .use(bodyParser())
  .use(cors())
  .use(koajwt({ secret: process.env.API_SECRET })
    .unless({ path: '/login', method: 'POST' }))
  .use(router.routes())
  .use(router.allowedMethods());

module.exports = app;
