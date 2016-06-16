import Router from 'koa-router';
// 使用死马的包，这个做了兼容处理
import bodyParser from 'koa-bodyparser';

const api = new Router({ prefix: '/api' });

api.use(bodyParser());

api.get('/test', function* m() {
  this.body = { test: 'test' };
});
api.get('/hello', function* m() {
  this.body = { hello: 'world' };
});

api.post('/test', function* m() {
  const data = this.request.body;
  this.body = {
    method: 'post',
    data,
  };
});

export default api;
