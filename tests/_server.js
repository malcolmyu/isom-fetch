import Koa from 'koa';
import Router from 'koa-router';

import isomFetch from '../src';

const app = new Koa();
const router = new Router();
const general = new Router();

const { PORT, HOST } = process.env;

general.get('/test', function* m() {
  this.body = { test: 'test' };
});

general.get('/hello', function* m() {
  this.body = { hello: 'world' };
});

router.use('/api', general.routes());

app.use(router.routes());
app.use(function* serverRender(next) {
  const fetch = isomFetch.use(this, router);
  const cf = isomFetch.create({
    baseURL: `http://${HOST}:${PORT}/api`,
  });
  yield cf.get('/api/test');
  yield cf.get('/api/hello');

  const data = yield fetch.all();
  this.body = data;
  yield next;
});

/* eslint no-console:0 */
app.listen(PORT, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.warn('==> 🐸  Webpack development server listening on port %s', PORT);
  }
});
