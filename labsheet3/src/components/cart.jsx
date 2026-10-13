export default function Cart({ cart, onRemoveFromCart, onProceedToCheckout }) {
  const grandTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="cart-drawer">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.product.id}>
                <span>{item.product.name} (x{item.quantity})</span>
                <span>₹{item.product.price * item.quantity}</span>
                <button onClick={() => onRemoveFromCart(item.product.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Grand Total: ₹{grandTotal}</h3>
          <button onClick={onProceedToCheckout}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}