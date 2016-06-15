import process from 'process';
import assert from 'assert';
import accepts from 'accepts';
import { getRequest, getResponse } from './mask';
import { isString, isFunction } from './utils';

const statusEmpty = {
  204: true,
  205: true,
  304: true,
};

function isJSON(body) {
  if (!body) return false;
  if (isString(body)) return false;
  if (isFunction(body.pipe)) return false;
  if (Buffer.isBuffer(body)) return false;
  return true;
}

// TODO: 与 axios 参数保持一致
export function createContext(option, defaults) {
  const context = Object.create(this);
  const request = context.request = Object.create(this.request);
  const response = context.response = Object.create(this.response);

  context.app = request.app = response.app = this.app;
  context.req = request.req = response.req = getRequest(defaults, option);
  context.res = request.res = response.res = getResponse();
  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;
  context.onerror = context.onerror.bind(context);
  context.originalUrl = request.originalUrl = context.req.url;

  // cookies
  context.accept = request.accept = accepts(context.req);
  context.state = {};
  return context;
}

export function respond() {
  const { res, code } = this;
  let { body } = this;

  if (res.headersSent || !this.writable) return null;
  if (statusEmpty[code]) {
    return null;
  }
  if (this.method === 'HEAD') {
    return null;
  }

  // 处理 body 为 null 的情况
  if (body == null) {
    this.type = 'text';
    body = this.message || String(code);
    return body;
  }

  // body: json
  if (isJSON(body)) {
    body = JSON.stringify(body);
  }

  return body;
}

export function serverSideMethod(target, name, descriptor) {
  const desc = descriptor;
  const method = desc.value;

  desc.value = (...args) => {
    assert(!process.browser, `method 'fetch#${name}' cannot work in browser`);
    return method.apply(target, args);
  };

  return desc;
}
