module.exports = function write(report) {
  console.log('BUY:');
  report.buy.forEach(writeLine);
  console.log('SELL:');
  report.sell.forEach(writeLine);
};

function writeLine(line) {
  console.log(`${line.quantity} kg for £${line.price}`);
}
