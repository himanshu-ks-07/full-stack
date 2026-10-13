const EventEmitter = require('events');

const orderEmitter = new EventEmitter();

orderEmitter.on('orderPlaced', (order) => {
  console.log('\n--- ORDER RECEIPT ---');
  console.log(`Order ID: ${order.id}`);
  console.log(`Item    : ${order.item}`);
  console.log(`Amount  : ₹${order.amount}`);
});

orderEmitter.emit('orderPlaced', { id: 'ORD101', item: 'Headphones', amount: 1999 });
orderEmitter.emit('orderPlaced', { id: 'ORD102', item: 'Watch', amount: 2999 });
orderEmitter.emit('orderPlaced', { id: 'ORD103', item: 'Mouse', amount: 899 });