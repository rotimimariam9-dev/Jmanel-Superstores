import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import initialProducts from '../data/products';

const FILTERS = [
  { key: 'all', label: 'All Products' },
  { key: 'adult', label: 'Adult Hair Care' },
  { key: 'kids', label: 'Kids' },
  { key: 'kit', label: 'Full Kits' },
];

function ProductCard({ product, onAdd }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all .3s',
        border: '1.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: '100%', height: 220, overflow: 'hidden',
        background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '3.5rem' }}>{product.emoji}</span>}
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {product.badge && (
          <span style={{
            background: 'var(--yellow)', color: 'var(--green-dark)',
            fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px',
            borderRadius: 5, display: 'inline-block', marginBottom: 6,
            textTransform: 'uppercase', width: 'fit-content',
          }}>{product.badge}</span>
        )}
        <div style={{ fontSize: '0.72rem', color: 'var(--green-mid)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
          {product.brand}
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>
          {product.name}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.5, marginBottom: 12, flex: 1 }}>
          {product.desc}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {product.tags.map(tag => (
            <span key={tag} style={{
              background: 'var(--yellow-light)', color: '#7a5800',
              padding: '3px 9px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--green-dark)' }}>
              ₦{product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 6 }}>
                ₦{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => onAdd(product)}
            style={{
              background: 'var(--green-dark)', color: 'white', border: 'none',
              borderRadius: 10, padding: '9px 16px', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--green-mid)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--green-dark)'}
          >
            <ShoppingBag size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [filter, setFilter] = useState('all');
  const { addToCart } = useCart();
  const storedProducts = JSON.parse(localStorage.getItem('jmanelProducts') || 'null');
  const products = storedProducts || initialProducts;
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 60%, #3d9960 100%)',
        color: 'white', padding: '70px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -60, width: 300, height: 300, background: 'rgba(245,197,24,0.07)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 14 }}>
            Your Natural Hair Deserves{' '}
            <span style={{ color: 'var(--yellow)' }}>The Best</span>
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.88, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Premium botanical hair care crafted with Jamaican Black Castor Oil, Rosemary, and powerful natural ingredients
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🌱 Chemical Free', '👧 Kids Line', '⭐ Premium Quality', '🇳🇬 Delivered in Lagos'].map(b => (
              <span key={b} style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500,
              }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--green-dark)' }}>Our Products</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{
                  background: filter === f.key ? 'var(--green-dark)' : 'white',
                  color: filter === f.key ? 'white' : 'var(--text-mid)',
                  border: `1.5px solid ${filter === f.key ? 'var(--green-dark)' : 'var(--border)'}`,
                  padding: '7px 16px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
                }}>{f.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}
