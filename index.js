// We could use transpiler to use some more ES2016 features
// But if we're willing to pay the compilation overhead
// then it would be better to go straight to e.g. TypeScript which gives us
// much better bug prevention, IntelliSense-style auto-completion etc.

const constructMarketplace = require('./app/marketplace');
const snapshotWriter = require('./app/snapshot-writer');

// Some test orders
const buyOrders = [300.0, 300.0, 298.5, 298.5, 298.5, 301.5]
  .map(p => ({userId: 123, quantity: 1, price: p, buySell: 'BUY'}));

const sellOrders = [305.0, 305.0, 306.5]
  .map(p => ({userId: 123, quantity: 2, price: p, buySell: 'SELL'}));


// The marketplace contains all the business logic (and only the business logic)
// It doesn't care where the orders come from or where the snapshot gets
// displayed or reported - so we can take this code, run it wherever we want
// (on the server, in the browser) and plug in whatever inputs and outputs we want.
const marketplace = constructMarketplace();
buyOrders.concat(sellOrders).forEach(marketplace.placeOrder);
const snapshot = marketplace.getSnapshot();

// The snapshot writer's only job is to receive a finished snapshot
// of the marketplace and report it to the user via command line (stdout)
// For a 'real' application we can simply replace this snapshot writer
// with something more user-friendly like a React component
// (pass snapshot in via props), HTML template engine or whatever.
snapshotWriter(snapshot);
