import { useState } from 'react';

export default function CheckoutForm({ onCompleteOrder }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    phone: '',
    paymentMethod: 'COD'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed successfully for ${formData.name}!`);
    onCompleteOrder();
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Checkout Details</h2>
      <input 
        name="name" 
        placeholder="Full Name" 
        value={formData.name} 
        onChange={handleChange} 
        required 
      />
      <input 
        name="address" 
        placeholder="Address" 
        value={formData.address} 
        onChange={handleChange} 
        required 
      />
      <input 
        name="pincode" 
        placeholder="Pincode" 
        value={formData.pincode} 
        onChange={handleChange} 
        required 
      />
      <input 
        name="phone" 
        placeholder="Phone Number" 
        value={formData.phone} 
        onChange={handleChange} 
        required 
      />
      <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
        <option value="COD">Cash on Delivery</option>
        <option value="UPI">UPI</option>
        <option value="Card">Credit/Debit Card</option>
      </select>
      <button type="submit">Place Order</button>
    </form>
  );
}