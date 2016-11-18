'use strict';
import Koa from 'koa';
import Router from 'koa-router';
import {Url, getAndVisit} from './db';
import BodyParser from 'koa-bodyparser';

const app = new Koa();
const router = Router();

const fourohfour = 'http://danwoodger.com/404';

const makeHash = () => {
    let strLength =  5;
    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const result = [];
    while (--strLength) {
        result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }
    return result.join('');
}

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
    ctx.redirect(url);
    ctx.status = 301;
  } catch(err) {
    console.err(err);
    ctx.redirect(fourohfour);
    ctx.status = 404;
    
  }
}

router.get('/s/:hash', hashResponse);
router.get('/s/:hash/:title', hashResponse);

router.post('/s', async (ctx, next) => {
  try {
    const longUrl = ctx.request.body.url;
    let newHash = makeHash();
    while ( await Url.findByPrimary(newHash) ) {
      newHash = makeHash();
    }

    const url = await Url.create({hash: newHash, longUrl: longUrl});
    ctx.body = JSON.stringify({shortUrl: `${ctx.request.origin}/s/${newHash}` });
    ctx.status = 200;
    
  } catch (err) {
    console.error(err)
    ctx.status = 500;
  }
})

app.use(router.routes())
  .use(router.allowedMethods());

app.use(ctx => {
  ctx.body += 'Koa';
})

app.listen(process.env.PORT || 5001);
