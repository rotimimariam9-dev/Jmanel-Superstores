import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import storeConfig from '../data/storeConfig';

const { delivery: DC, vatRate, promoCodes } = storeConfig;

export default function Cart({ setPage }) {
  const { cart, removeFromCart, changeQty, showToast } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * vatRate);
  const deliveryFee = subtotal >= DC.freeThreshold ? 0 : DC.lagos;
  const discountAmt = Math.round(subtotal * (discount / 100));
  const total = subtotal + tax + deliveryFee - discountAmt;

  function applyPromo() {
    const code = promoCode.trim().toUpperCase();
    const pct = promoCodes[code];
    if (pct) { setDiscount(pct); showToast(`🎉 Promo applied! ${pct}% off`); }
    else showToast('❌ Invalid promo code');
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--green-dark)', marginBottom: 10 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Add some amazing natural hair products!</p>
        <button onClick={() => setPage('shop')}
          style={{ background: 'var(--green-dark)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <h2 style={{ fontSize: '1.6rem', color: 'var(--green-dark)', marginBottom: 28 }}>
        Your Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0, overflow: 'hidden' }}>
                {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : item.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{item.brand}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <button onClick={() => changeQty(item.id, -1)} style={{ width: 28, height: 28, border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--cream)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={12} />
                  </button>
                  <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} style={{ width: 28, height: 28, border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--cream)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={12} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--green-dark)', whiteSpace: 'nowrap' }}>
                ₦{(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', height: 'fit-content', position: 'sticky', top: 80 }}>
