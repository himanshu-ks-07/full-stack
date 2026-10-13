export default function Navbar({ cartCount, onToggleCart }) {
  return (
    <nav className="navbar">
      <h2>COER TechStore</h2>
      <button onClick={onToggleCart}>
        Cart ({cartCount})
      </button>
    </nav>
  );
}