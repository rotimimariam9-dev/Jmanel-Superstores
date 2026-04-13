import React from 'react';
import { Link } from 'react-router';

export default function Success() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <div style={{ fontSize: '4rem', color: '#2e7d32' }}>✓</div>
      <h1>Order Received!</h1>
      <p>Thank you for shopping with J'manel Superstores. We're getting your natural hair kit ready.</p>
      <Link to="/" style={{ color: '#000', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
        Back to Shop
      </Link>
    </div>
  );
}
