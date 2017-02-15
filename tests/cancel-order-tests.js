const expect = require('chai').expect;
const constructMarketplace = require('../marketplace');

describe('Cancel order', function () {
  beforeEach(function () {
    const testOrder = {
      userId: 123,
      quantity: 4.5,
      price: 301.5,
      buySell: 'BUY'
    };
    this.marketplace = constructMarketplace({ 1: testOrder });
  });
  it('If we pass in null order id we get an assertion error', function () {
    expect(() => this.marketplace.cancelOrder(null)).to.throw('AssertionError');
  });
  it('If we pass in order id 1 the order gets cancelled', function () {
    this.marketplace.cancelOrder(1);
    expect(this.marketplace.getState().orders).to.be.empty;
  });
});
