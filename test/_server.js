import Koa from 'koa';
import cors from 'koa-cors';
import api from './router/api';
import test from './router/test';
import { PORT } from './_config';

const app = new Koa();

app.use(cors());
app.use(api.routes());
app.use(test.routes());

/* eslint no-console:0 */
app.listen(PORT, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.warn('==> 🐸  Webpack development server listening on port %s', PORT);
  }
});
