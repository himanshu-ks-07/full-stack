import React, { useState } from 'react';

function CheckoutForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    phone: '',
    paymentMethod: 'COD'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed for ${formData.name}!`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', margin: '20px', maxWidth: '300px' }}>
      <h3>Checkout</h3>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required /><br/><br/>
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required /><br/><br/>
      <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required /><br/><br/>
      <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required /><br/><br/>
      <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
        <option value="COD">Cash on Delivery</option>
        <option value="UPI">UPI</option>
      </select><br/><br/>
      <button type="submit">Place Order</button>
    </form>
  );
}

export default CheckoutForm;