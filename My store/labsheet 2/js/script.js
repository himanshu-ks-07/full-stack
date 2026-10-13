// Task 1: Product catalog array with working online image links
const products = [
  { 
    id: 1, 
    name: "Wireless Headphones", 
    price: 1999, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" 
  },
  { 
    id: 2, 
    name: "Smart Watch", 
    price: 2999, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" 
  },
  { 
    id: 3, 
    name: "Mechanical Keyboard", 
    price: 3499, 
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80" 
  },
  { 
    id: 4, 
    name: "Gaming Mouse", 
    price: 1299, 
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" 
  },
  { 
    id: 5, 
    name: "Bluetooth Speaker", 
    price: 1799, 
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80" 
  },
  { 
    id: 6, 
    name: "USB-C Hub", 
    price: 899, 
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500&q=80" 
  },
  { 
    id: 7, 
    name: "Laptop Stand", 
    price: 699, 
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80" 
  },
  { 
    id: 8, 
    name: "Power Bank 20000mAh", 
    price: 1499, 
    image: "https://images.unsplash.com/photo-1609592424368-f9b646c2eb49?w=500&q=80" 
  }
];

// Task 2 & 3: Render products and add to cart
function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join("");
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  alert("Product added to cart!");
}

// Task 4 & 5: Render cart, update quantities, calculate total
function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    calculateTotal();
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div style="display: flex; align-items: center; gap: 15px;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain;">
        <strong>${item.name}</strong>
      </div>
      <span>₹${item.price}</span>
      <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
      <span>₹${item.price * item.quantity}</span>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join("");

  calculateTotal();
}

function updateQuantity(productId, newQty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity = Math.max(1, parseInt(newQty) || 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartBadge();
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

function calculateTotal() {
  const totalDisplay = document.getElementById("cart-total");
  if (!totalDisplay) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalDisplay.textContent = `₹${grandTotal}`;
}

// Task 6 & 7: Form validation and order placement
function setupCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const phone = document.getElementById("phone").value.trim();

    let isValid = true;

    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

    if (!name) {
      document.getElementById("name-error").textContent = "Name is required.";
      isValid = false;
    }
    if (!address) {
      document.getElementById("address-error").textContent = "Address is required.";
      isValid = false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      document.getElementById("pincode-error").textContent = "Pincode must be exactly 6 digits.";
      isValid = false;
    }
    if (!/^\d{10}$/.test(phone)) {
      document.getElementById("phone-error").textContent = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    if (isValid) {
      localStorage.removeItem("cart");
      updateCartBadge();
      form.parentElement.innerHTML = `
        <div class="success-msg">
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase.</p>
          <br>
          <a href="products.html"><button>Continue Shopping</button></a>
        </div>
      `;
    }
  });
}

// Task 8: Update cart badge globally
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalCount;
}

// Global page initialization
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  setupCheckoutForm();
  updateCartBadge();
});