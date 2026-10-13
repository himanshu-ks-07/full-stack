import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#eee' }}>
        <h2>My React Store</h2>
        <button onClick={() => setShowCart(!showCart)}>
          🛒 Cart ({totalItems})
        </button>
      </nav>

      <ProductList onAddToCart={addToCart} />

      {showCart && (
        <>
          <Cart cartItems={cart} onRemoveFromCart={removeFromCart} />
          {cart.length > 0 && <CheckoutForm />}
        </>
      )}
    </div>
  );
}

export default App;