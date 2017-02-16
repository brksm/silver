// This is a stateless module (just a pure function)
// the only job of which is to take a list of orders and to
// map it to a snapshot

module.exports = function makeSnapshot(orders) {
  const buyOrders = orders.filter(o => o.buySell === 'BUY');
  const sellOrders = orders.filter(o => o.buySell === 'SELL');

  const buy = internalMakeSnapshot(buyOrders, (a, b) => a.price < b.price);
  const sell = internalMakeSnapshot(sellOrders, (a, b) => a.price > b.price);

  return { buy, sell };
};

function internalMakeSnapshot(orders, sorter) {
  // Feels a bit wrong to use floats as keys in object - but should work for now
  const groups = orders.reduce(groupOrdersByPrice, {});
  const aggregates = Object.values(groups).map(aggregateOrders).sort(sorter);
  return aggregates;
}

// I would normally use lodash for production code
// But it's more interesting to do it by hand
function groupOrdersByPrice(grouping, order) {
  // I don't want to mutate the grouping so I'm doing some extra work
  // In practice this won't matter most of the time but it feels better
  // because use of this function suggests that it is a pure function
  return Object.assign({}, grouping, {
    [order.price]: (grouping[order.price] || []).concat(order)
  });
}

function aggregateOrders(group) {
  const price = group[0].price;
  const quantity = group.map(o => o.quantity).reduce((a, b) => a + b);
  return { price, quantity };
}
