import { reduxIsomFetch, getURLStateName } from '../';

describe('中间件测试', () => {
  it('中间件必须是函数', () => {
    expect(reduxIsomFetch).to.be.a('function');
  });

  it('`getURLStateName` 必须是函数', () => {
    expect(getURLStateName).to.be.a('function');
  });
});
