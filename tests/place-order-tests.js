const expect = require('chai').expect;
const constructMarketplace = require('../app/marketplace');

// There is a debate whether test code should be as DRY as production code
// or if we should make it more explicit and repetitive to avoid risk of bugs
// creeping into the test code itself (Who watches the watchers?)
// http://stackoverflow.com/questions/129693/is-duplicated-code-more-tolerable-in-unit-tests
// I generally believe in DRY tests – but here and for now I will wet myself...
describe('Place order', function () {
  describe('With good arguments', function () {
    beforeEach(function () {
      // I don't like storing things on 'this' to smuggle them through to the
      // assertions but that's the way of least resistance in JS and Mocha
      this.marketplace = constructMarketplace({});
    });
    it('If we pass in a valid order it gets added to the order list and we get back id 1', function () {
      const testOrder = {
        userId: 123,
        quantity: 4.5,
        price: 300.0,
        buySell: 'BUY'
      };
      const orderId = this.marketplace.placeOrder(testOrder);
      expect(this.marketplace.getState().orders).to.deep.equal({1: testOrder});
      expect(orderId).to.equal(1);
    });
    it('If we pass in two valid orders they both get added to the order list and we get back ids 1 and 2', function () {
      const testOrder1 = {
        userId: 123,
        quantity: 4.5,
        price: 300.0,
        buySell: 'BUY'
      };
      const testOrder2 = {
        userId: 456,
        quantity: 2.5,
        price: 303.5,
        buySell: 'SELL'
      };
      const orderId1 = this.marketplace.placeOrder(testOrder1);
      const orderId2 = this.marketplace.placeOrder(testOrder2);
      expect(this.marketplace.getState().orders).to.deep.equal({1: testOrder1, 2: testOrder2});
      expect(orderId1).to.equal(1);
      expect(orderId2).to.equal(2);
    });
  });
  describe('With bad arguments', function () {
    beforeEach(function () {
      this.marketplace = constructMarketplace();
    });
    it('If we pass in null user id we get an assertion error', function () {
      const testOrder = {
        userId: null,
        quantity: 4.5,
        price: 300.0,
        buySell: 'BUY'
      };
      expect(() => this.marketplace.placeOrder(testOrder)).to.throw('AssertionError');
    });
    it('If we pass in null quantity we get an assertion error', function () {
      const testOrder = {
        userId: 123,
        quantity: null,
        price: 300.0,
        buySell: 'BUY'
      };
      expect(() => this.marketplace.placeOrder(testOrder)).to.throw('AssertionError');
    });
    it('If we pass in a negative quantity we get an assertion error', function () {
      const testOrder = {
        userId: 123,
        quantity: -3.2,
        price: 300.0,
        buySell: 'BUY'
      };
      expect(() => this.marketplace.placeOrder(testOrder)).to.throw('AssertionError');
    });
    it('If we pass in null price we get an assertion error', function () {
      const testOrder = {
        userId: 123,
        quantity: 4.5,
        price: null,
        buySell: 'BUY'
      };
      expect(() => this.marketplace.placeOrder(testOrder)).to.throw('AssertionError');
    });
    it('If we pass in a negative price we get an assertion error', function () {
      const testOrder = {
        userId: 123,
        quantity: 4.5,
        price: -156.1,
        buySell: 'BUY'
      };
      expect(() => this.marketplace.placeOrder(testOrder)).to.throw('AssertionError');
    });
    it('If we pass in invalid order type "YO" we get an assertion error', function () {
      const testOrder = {
        userId: 123,
        quantity: 4.5,
        price: 300.0,
        buySell: 'YO'
      };
      expect(() => this.marketplace.placeOrder(testOrder)).to.throw('AssertionError');
    });
  });
});
