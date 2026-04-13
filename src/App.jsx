import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Toast from './components/Toast';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Admin from './pages/Admin';

export default function App() {
  const [page, setPage] = useState('shop');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setPage('admin');
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const showHeader = page !== 'admin';

  return (
    <CartProvider>
      {showHeader && <Header page={page} setPage={setPage} />}
      <main>
        {page === 'shop'     && <Shop setPage={setPage} />}
        {page === 'cart'     && <Cart setPage={setPage} />}
        {page === 'checkout' && <Checkout setPage={setPage} setOrderId={setOrderId} />}
        {page === 'success'  && <Success orderId={orderId} setPage={setPage} />}
        {page === 'admin'    && <Admin setPage={setPage} />}
      </main>
      <Toast />

      {showHeader && (
        <footer style={{
          background: 'var(--green-dark)',
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          padding: '24px',
          fontSize: '0.82rem',
          marginTop: 60,
        }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", color: 'white', fontWeight: 600 }}>J'manel Superstores</span>
            {' '}— Natural Hair Care Products
          </div>
          <div>📲 WhatsApp: 08036868328 &nbsp;|&nbsp; © {new Date().getFullYear()} All rights reserved</div>
        </footer>
      )}
    </CartProvider>
  );
}
