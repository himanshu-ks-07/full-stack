import React from 'react';

function Cart({ cartItems, onRemoveFromCart }) {
  const grandTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return <p style={{ padding: '20px' }}>Your cart is empty.</p>;
  }

  return (
    <div style={{ border: '1px solid #333', padding: '20px', margin: '20px' }}>
      <h2>Cart Items</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.product.id}>
              <td>{item.product.name}</td>
              <td>₹{item.product.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.product.price * item.quantity}</td>
              <td>
                <button onClick={() => onRemoveFromCart(item.product.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Grand Total: ₹{grandTotal}</h3>
    </div>
  );
}

export default Cart;