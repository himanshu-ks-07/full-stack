import { useState } from 'react';
import Navbar from './components/navbar';
import ProductList from './components/productlist';
import Cart from './components/cart';
import CheckoutForm from './components/checkoutfrom';
import './app.css';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="app-container">
      <Navbar 
        cartCount={totalCartCount} 
        onToggleCart={() => setIsCartOpen(!isCartOpen)} 
      />
      
      <main>
        {isCheckout ? (
          <CheckoutForm 
            onCompleteOrder={() => { 
              setCart([]); 
              setIsCheckout(false); 
            }} 
          />
        ) : (
          <ProductList onAddToCart={addToCart} />
        )}
      </main>

      {isCartOpen && (
        <Cart 
          cart={cart} 
          onRemoveFromCart={removeFromCart} 
          onProceedToCheckout={() => { 
            setIsCartOpen(false); 
            setIsCheckout(true); 
          }}
        />
      )}
    </div>
  );
}