const assert = require('assert');
const makeSnapshot = require('./make-snapshot');

// This is not a marketplace but a constructor for marketplaces
// This allows us to inject initial orders as a (data) dependency
// which makes testing and some other things easier
// You could also use ES2016 classes etc. instead
// but I don't like them too much
module.exports = function constructMarketplace(initialOrders) {
  // Central state store à la Redux
  let state = {
    nextId: 1,
    orders: initialOrders || {}
  };

  // This is the 'fully constructed' marketplace
  return {
    // I really don't want to expose the state but in current setup
    // I need to do it to do test assertions (e.g. 'this order has been placed')
    // Could solve this by factoring out state management logic, then using mock
    // implementation etc.
    getState: () => state,
    placeOrder,
    cancelOrder,
    getSnapshot: () => makeSnapshot(Object.values(state.orders))
  };

  function placeOrder(order) {
    // Can use better library for argument validation
    // But for this case Node's assert should be ok

    // Normally we would check that there is a user with this ID
    assert.ok(order.userId);
    assert(order.quantity > 0);
    assert(order.price > 0);
    assert(order.buySell === 'BUY' || order.buySell === 'SELL');

    const orderId = state.nextId;
    // Mutable state is bad (space of things that can go wrong gets too big)
    // I'm trying here to be disciplined about managing the mutable state of
    // the marketplace by (almost) using Redux-style reducer functions
    // (state, action) -> next state
    // PS: Best way to write marketplace would be to use e.g. Rx.js and think of
    // it as a transformer that takes an asynchronous sequence of order placements
    // and cancellations (that come from a UI, DOM events, message queue or
    // whatever) and turns it into an asynchronous sequence of snapshots (that
    // we can then pipe back into a UI or wherever we want).
    // That is the amazing beauty of reactive programming
    // (and the React/Redux/Cycle.js etc. architecture) - it allows us to
    // solve problems that allegedly require mutable state (user interfaces!)
    // with purely functional (stateless, pure) means - bliss!
    const newState = {
      nextId: state.nextId + 1,
      orders: Object.assign({}, state.orders, {[orderId]: order})
    };
    state = newState;
    return orderId;
  }

  function cancelOrder(orderId) {
    assert.ok(orderId);
    if (!state.orders[orderId]) {
      throw new Error(`Order ${orderId} does not exist.`);
    }
    // Normally we would authenticate user and check that he has permission
    // to cancel this order

    // We could make this nicer by filtering orders object with lodash
    const newOrders = Object.assign({}, state.orders);
    delete newOrders[orderId];
    const newState = {
      nextId: state.nextId,
      orders: newOrders
    };
    state = newState;
  }
};
