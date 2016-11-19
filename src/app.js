import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';

const appFactory = (getAndVisit, addLink) => {
  const app = new Koa();
  const router = Router();

  const fourohfour = 'http://danwoodger.com/404';

  

  // logger
  app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ new Date() } ${ctx.method} ${ ctx.url }  - ${ ms }ms`);
  })

  // parse body to ctx.request.body
  app.use(BodyParser());

  //routes
  const hashResponse = async (ctx, next) => {
    try {
      const url = await getAndVisit(ctx.params.hash);
      if (url != null) {
        ctx.redirect(url);
        ctx.status = 301;
      } else {
        ctx.redirect(fourohfour);
        ctx.status = 404;
      }
    } catch(err) {
      console.error(err);
      ctx.status = 500;
    }
  }

  router.get('/s/:hash', hashResponse);
  router.get('/s/:hash/:title', hashResponse);

  router.post('/s', async (ctx, next) => {
    try {
      const longUrl = ctx.request.body.url;
      const newHash = await addLink(longUrl);
      ctx.body = {shortUrl: `${ctx.request.origin}/s/${newHash}`};
      ctx.status = 200;
    } catch (err) {
      console.error(err)
      ctx.status = 500;
    }
  })

  app.use(router.routes())
    .use(router.allowedMethods());

  return app;
}



export default appFactory;