import Router from 'koa-router';
import router from './api';
import isomFetch from '../../src';
import { PORT, HOST } from '../_config';

const test = new Router({ prefix: '/test' });

test.get('/two-get-request', function* serverRender() {
  const fetch = isomFetch.use(this, router);
  const cf = isomFetch.create({
    baseURL: `http://${HOST}:${PORT}/api`,
  });
  yield cf.get('/test');
  yield cf.get('/hello');

  this.body = yield fetch.all();
});

test.get('/post-request', function* serverRender() {
  const fetch = isomFetch.use(this, router);
  const cf = isomFetch.create({
    baseURL: `http://${HOST}:${PORT}/api`,
  });
  yield cf.post('/test', { hello: 'world' });

  this.body = yield fetch.all();
});

export default test;
