const expect = require('chai').expect;
const constructMarketplace = require('../app/marketplace');
const testOrders = require('./resources/test-orders');

describe('Take snapshot', function () {
  beforeEach(function () {
    this.marketplace = constructMarketplace(testOrders);
  });
  it('Marketplace injected with test orders returns expected snapshot', function () {
    const actualSnapshot = this.marketplace.getSnapshot();
    const expectedSnapshot = {
      buy: [
        {
          quantity: 0.5,
          price: 300.5
        }, {
          quantity: 4.0,
          price: 298.5
        }
      ],
      sell: [
        {
          quantity: 4.5,
          price: 302.5
        }, {
          quantity: 1.5,
          price: 303.5
        }
      ]
    };
    expect(actualSnapshot).to.deep.equal(expectedSnapshot);
  });
});
