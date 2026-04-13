import React from 'react';
import { Link } from 'react-router';

export default function Cart({ cart = [], onUpdateQuantity, onRemoveItem }) {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any natural hair kits yet.</p>
        <Link to="/" style={linkButtonStyle}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Your Shopping Cart</h1>
      
      <div style={{ borderTop: '1px solid #eee' }}>
        {cart.map((item) => (
          <div key={item.id} style={cartItemStyle}>
            <img src={item.image} alt={item.name} style={imageStyle} />
            
            <div style={{ flexGrow: 1, padding: '0 1.5rem' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>₦{item.price.toLocaleString()}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                style={qtyButtonStyle}
              >-</button>
              <span style={{ fontWeight: '600', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                style={qtyButtonStyle}
              >+</button>
            </div>

            <div style={{ minWidth: '100px', textAlign: 'right', marginLeft: '1.5rem' }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
              <button 
                onClick={() => onRemoveItem(item.id)}
                style={{ color: '#ff4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', marginTop: '5px' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', borderTop: '2px solid #000', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold' }}>
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'right', marginTop: '5px' }}>
          Shipping and taxes calculated at checkout.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', gap: '1rem' }}>
          <Link to="/" style={{ ...linkButtonStyle, backgroundColor: '#f4f4f4', color: '#000' }}>
            Back to Shop
          </Link>
          <Link to="/checkout" style={linkButtonStyle}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

// Styling Objects
const cartItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '1.5rem 0',
  borderBottom: '1px solid #eee'
};

const imageStyle = {
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '8px',
  background: '#f9f9f9'
};

const qtyButtonStyle = {
  width: '30px',
  height: '30px',
  border: '1px solid #ddd',
  background: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const linkButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#000',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '4px',
  fontWeight: '600',
  display: 'inline-block'
};
