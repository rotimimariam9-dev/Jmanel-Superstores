import React from 'react';
import { ShoppingCart, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import storeConfig from '../data/storeConfig';

const styles = {
  header: {
    background: 'var(--green-dark)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    gap: 12,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  },
  logoIcon: {
    width: 44,
    height: 44,
    background: 'var(--yellow)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  logoName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'white',
    lineHeight: 1.1,
  },
  logoTagline: {
    fontSize: '0.68rem',
    color: 'var(--yellow)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  nav: { display: 'flex', gap: 4 },
  navBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.88rem',
    fontWeight: 500,
    padding: '8px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all .2s',
  },
  cartBtn: {
    background: 'var(--yellow)',
    color: 'var(--green-dark)',
    border: 'none',
    borderRadius: 10,
    padding: '9px 18px',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    transition: 'all .2s',
    flexShrink: 0,
  },
  cartCount: {
    background: 'var(--green-dark)',
    color: 'white',
    width: 20,
    height: 20,
    borderRadius: '50%',
    fontSize: '0.7rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustBar: {
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    padding: '8px 24px',
    flexWrap: 'wrap',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.88)',
  },
};

export default function Header({ page, setPage }) {
  const { cartCount } = useCart();

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.logo} onClick={() => setPage('shop')}>
          <div style={styles.logoIcon}>
            <Leaf size={22} color="#1a4d2e" strokeWidth={2.5} />
          </div>
          <div>
            <div style={styles.logoName}>{storeConfig.storeName}</div>
            <div style={styles.logoTagline}>{storeConfig.tagline}</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {['shop', 'cart'].map(p => (
            <button
              key={p}
              style={{
                ...styles.navBtn,
                background: page === p ? 'rgba(255,255,255,0.15)' : 'none',
                color: page === p ? 'white' : 'rgba(255,255,255,0.8)',
              }}
              onClick={() => setPage(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </nav>

        <button style={styles.cartBtn} onClick={() => setPage('cart')}>
          <ShoppingCart size={17} />
          Cart
          <span style={styles.cartCount}>{cartCount}</span>
        </button>
      </div>

      <div style={styles.trustBar}>
        {[
          '🚚 Lagos Delivery Available',
          '🌿 100% Natural Ingredients',
          '💰 Free Shipping over ₦30,000',
          '✅ Paraben & Silicone Free',
        ].map(item => (
          <div key={item} style={styles.trustItem}>{item}</div>
        ))}
      </div>
    </header>
  );
}
