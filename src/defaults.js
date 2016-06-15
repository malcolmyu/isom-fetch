const DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

export default {
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
    patch: { ...DEFAULT_CONTENT_TYPE },
    post: { ...DEFAULT_CONTENT_TYPE },
    put: { ...DEFAULT_CONTENT_TYPE },
  },

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
};
