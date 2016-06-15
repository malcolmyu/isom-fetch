import isomFetch from '../src';
import { HOST, PORT } from './_config';

const fetch = isomFetch.create({
  baseURL: `http://${HOST}:${PORT}`,
});

console.log(`http://${HOST}:${PORT}`);

describe('模拟服务端渲染测试', () => {
  it('请求两个 get 数据', () => {
    const data = [
      { test: 'test' },
      { hello: 'world' },
    ];

    return fetch.get('/test/two-get-request')
      .then(res => JSON.stringify(res.data))
      .should.eventually.equal(JSON.stringify(data));
  });

  it('请求 post 数据', () => {
    const data = {
      method: 'post',
      data: { hello: 'world' },
    };

    return fetch.get('/test/post-request', { ...data.data })
      .then(res => JSON.stringify(res.data))
      .should.eventually.equal(JSON.stringify([data]));
  });
});
