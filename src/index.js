import process from 'process';
import axios from 'axios';
import compose from 'koa-compose';
import co from 'co';
import assert from 'assert';

import {
  createContext,
  respond,
  serverSideMethod,
} from './application';

const isBrowser = process.browser;

/**
 * 在服务端环境下，fetch 需要保持单例模式
 * 由于 react 渲染是同步的，因此在一次 SSR 过程中是正确的
 */
let singleton = null;

class Fetch {

  constructor(options = {}) {
    this.options = options;
    this.axios = axios.create(options);
  }

  @fetchDecorator
  request() {}

  @fetchDecorator
  get() {}

  @fetchDecorator
  post() {}

  @fetchDecorator
  patch() {}

  @fetchDecorator
  delete() {}

  @fetchDecorator
  head() {}

  @fetchDecorator
  put() {}

  /**
   * 在服务器环境下生成一个单例的 fetch
   *
   * @param ctx {Object} koa 的 app 实例
   * @return {Fetch} 返回一个 fetch 的单例对象
   */
  @serverSideMethod
  use(ctx, router) {
    // TODO: 对 ctx 实例进行简单的校验吧
    this.ctx = ctx;
    this.router = router;
    this.fetchCollection = [];
    return this;
  }

  /**
   * 使用后端中间件充当请求体，并记录返回的 promise
   *
   * @param options {Object} 请求内容
   * @return {Promise} 返回一个 promise，请求的返回值
   */
  @serverSideMethod
  dispatch(options, defaults) {
    const context = createContext.call(this.ctx, options, defaults);
    const fn = co.wrap(compose([this.router.routes()]));
    const promise = fn.call(context).then(() => respond.call(context));
    this.fetchCollection.push(promise);
    return promise;
  }

  @serverSideMethod
  all(callback) {
    const promise = Promise.all(singleton.fetchCollection);
    singleton = null;

    return typeof callback !== 'function'
      ? promise.then(callback)
      : promise;
  }
}

function fetchDecorator(target, name, descriptor) {
  const desc = descriptor;
  desc.value = (...args) => {
    let result;

    switch (name) {
      case 'request':
        result = args[0];
        break;
      case 'get':
      case 'delete':
      case 'head': {
        const [url, config = {}] = args;
        config.url = url;
        config.method = name.toUpperCase();
        result = config;
        break;
      }
      default: {
        const [url, data = {}, config = {}] = args;
        config.url = url;
        config.method = name.toUpperCase();
        config.data = { ...config.data, ...data };
        result = config;
        break;
      }
    }

    // 不管是服务端还是客户端，这里用的都是 this.options
    result = { ...result };

    if (isBrowser) {
      const { request } = this.axios;
      return request(result);
    }

    // 在服务端需要使用单例的 dispatch
    return singleton.dispatch(result, target.options);
  };
  return desc;
}

export default {

  /**
   * 在服务器环境下生成一个单例的 fetch
   *
   * @param ctx {Object} koa 的 app 实例
   * @return {Fetch} 返回一个 fetch 的单例对象
   */
  use(ctx, router) {
    assert(
      singleton === null,
      '服务端 fetch 冲突，请检查是否调用 fetch.all'
    );

    singleton = new Fetch();
    singleton.use(ctx, router);
    return singleton;
  },

  /**
   * 返回新的 fetch 实例
   *
   * @param options {Object} 配置属性
   * @return {Fetch} 新的 fetch 实例
   */
  create(options) {
    return new Fetch(options);
  },
};
