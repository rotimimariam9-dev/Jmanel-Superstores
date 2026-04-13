import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();
  if (!toast.show) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      background: 'var(--green-dark)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: 12,
      fontSize: '0.88rem',
      fontWeight: 500,
      zIndex: 9999,
      boxShadow: 'var(--shadow-lg)',
      maxWidth: 300,
      animation: 'slideUp 0.3s ease',
    }}>
      {toast.message}
      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
