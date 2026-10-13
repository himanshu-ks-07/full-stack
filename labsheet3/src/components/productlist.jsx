import { products } from '../data/product';
import ProductCard from './productcard';

export default function ProductList({ onAddToCart }) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  );
}