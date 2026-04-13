import React, { useState } from 'react';

export default function Checkout({ cart = [], total = 0, onClearCart }) {
  const [orderComplete, setOrderComplete] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to your database/API here
    setOrderComplete(true);
    onClearCart();
  };

  if (orderComplete) return <SuccessPage />;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Checkout</h2>
      <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        {cart.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>{item.name} x {item.quantity}</span>
            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Full Name" required style={inputStyle} />
        <input type="email" placeholder="Email Address" required style={inputStyle} />
        <input type="text" placeholder="Shipping Address" required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Place Order</button>
      </form>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
