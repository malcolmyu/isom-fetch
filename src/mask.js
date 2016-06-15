import defaults from './defaults';

function transformData(data, headers, fns) {
  fns.forEach(fn => { data = fn(data, headers); });
  return data;
}

export const getRequest = (defConfig = {}, config) => {
  config = { ...defaults, ...defConfig, ...config };
  config.withCredentials = config.withCredentials || defConfig.withCredentials;

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = {
    ...config.headers.common || {},
    ...config.headers[config.method] || {},
    ...config.headers || {},
  };

  ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'].forEach(method => {
    delete config.headers[method];
  });

  // It's a virtual request which DO NOT have socket
  config.socket = null;

  return config;
};

export const getResponse = () => {
  // 这两个函数的调用在虚拟响应里没有效果
  const setHeader = () => {};
  const removeHeader = () => {};

  return {
    statusCode: 200,
    statusMessage: 'OK',
    setHeader,
    removeHeader,
    // 确保请求可写
    // 这是指为了模拟 res.writable 方法，保证再返回数据时可以用
    socket: {
      writable: true,
    },
  };
};
