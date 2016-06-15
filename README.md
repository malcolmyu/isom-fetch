# isom-fetch

A isomorphic fetch for SSR and Koa.

## Use in server

```js
import isomFetch from 'isom-fetch';

app.use(function* (next) {
  const location = this.originalUrl;
  match({ routes, location }, (
    error, redirectLocation, renderProps
  ) => {
    const fetch = isomFetch.use(this);
    // begin SSR
    if (renderProps) {
      render();
      fetch.all(() => {
        // SSR actually
        render();
      });
    }
  });
});
```

## Use in client

```js
import Fetch from 'isom-fetch';

const fetch = Fetch.create({
  baseURL: '/api',
  headers: {}
});

fetch.get('/user', { id });
```
