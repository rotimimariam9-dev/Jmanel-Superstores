import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import storeConfig from '../data/storeConfig';

const { delivery: DC, vatRate, payment: PAY } = storeConfig;

const PAYMENT_METHODS = [
  { key: 'opay', icon: '🟢', label: 'OPay Transfer', sub: 'Instant transfer' },
  { key: 'bank', icon: '🏦', label: 'Bank Transfer', sub: 'Any Nigerian bank' },
  { key: 'ussd', icon: '📱', label: 'USSD Payment', sub: 'Dial from your phone' },
  { key: 'pod',  icon: '💵', label: 'Pay on Delivery', sub: 'Cash at doorstep' },
];

const STATES = ['Lagos','Abuja','Rivers','Ogun','Oyo','Kano','Kaduna','Enugu','Anambra','Delta','Edo','Imo','Kwara','Osun','Ekiti','Ondo','Cross River','Akwa Ibom','Benue','Other'];

function PaymentInfo({ method }) {
  const base = { borderRadius: 12, padding: '14px 16px', fontSize: '0.85rem', lineHeight: 1.8, marginTop: 14 };
  const boxes = {
    opay: { style: { ...base, background: '#e8f5e9', border: '1px solid #a8d5b5' }, content: <><strong>💚 OPay Transfer Details</strong><br />Bank: <strong>{PAY.bankName}</strong><br />Account Name: <strong>{PAY.accountName}</strong><br />Account Number: <strong>{PAY.accountNumber}</strong><br /><br />Send receipt to WhatsApp: <strong>📲 {PAY.whatsapp}</strong><br /><em style={{ color: 'var(--text-mid)' }}>Include your order reference.</em></> },
    bank: { style: { ...base, background: '#e8f5e9', border: '1px solid #a8d5b5' }, content: <><strong>🏦 Bank Transfer</strong><br />Bank: <strong>{PAY.bankName}</strong><br />Account Name: <strong>{PAY.accountName}</strong><br />Account Number: <strong>{PAY.accountNumber}</strong><br />Send proof to WhatsApp: <strong>📲 {PAY.whatsapp}</strong></> },
    ussd: { style: { ...base, background: '#fff3e0', border: '1px solid #ffcc80' }, content: <><strong>📱 USSD Transfer</strong><br />Transfer to <strong>{PAY.bankName} — {PAY.accountNumber}</strong><br /><br /><strong>GTBank:</strong> *737*1*Amount*0058*AccNum#<br /><strong>Access:</strong> *901*Amount*AccNum#<br /><strong>Zenith:</strong> *966*Amount*AccNum#<br /><strong>UBA:</strong> *919*3*AccNum*Amount#<br /><strong>First Bank:</strong> *894*Amount*AccNum#<br /><strong>OPay:</strong> *955*AccNum*Amount#<br /><br />Send proof to: <strong>📲 {PAY.whatsapp}</strong></> },
    pod: { style: { ...base, background: 'var(--yellow-light)', border: '1px solid var(--yellow)' }, content: <><strong>💵 Pay on Delivery</strong><br />✅ Available within Lagos only.<br />✅ Have exact cash ready at delivery.<br />✅ ₦{DC.podHandlingFee.toLocaleString()} handling fee added to total.</> },
  };
  const current = boxes[method];
  if (!current) return null;
  return <div style={current.style}>{current.content}</div>;
}

export default function Checkout({ setPage, setOrderId }) {
  const { cart, clearCart } = useCart();
  const [method, setMethod] = useState('opay');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', area: '', city: '', state: 'Lagos', landmark: '', notes: '' });
  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * vatRate);
  const deliveryFee = subtotal >= DC.freeThreshold ? 0 : DC.lagos;
  const podFee = method === 'pod' ? DC.podHandlingFee : 0;
  const total = subtotal + tax + deliveryFee + podFee;

  function validate() {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'area', 'city'];
    const errs = {};
    required.forEach(k => { if (!form[k].trim()) errs[k] = 'Required'; });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function placeOrder() {
    if (!validate()) return;
    const id = 'JMS-' + String(Date.now()).slice(-6);
    const order = { id, customer: form, items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })), subtotal, tax, delivery: deliveryFee, podFee, total, payment: method, status: 'pending', date: new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) };
    const orders = JSON.parse(localStorage.getItem('jmanelOrders') || '[]');
    orders.push(order);
    localStorage.setItem('jmanelOrders', JSON.stringify(orders));
    clearCart();
    setOrderId({ id, payment: method, total });
    setPage('success');
  }

  const inp = (id, label, type = 'text', placeholder = '', span = false) => (
    <div key={id} style={{ gridColumn: span ? '1 / -1' : undefined }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{label} {['firstName','lastName','email','phone','address','area','city'].includes(id) && <span style={{ color: '#e53e3e' }}>*</span>}</label>
      <input type={type} value={form[id]} onChange={e => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: undefined })); }} placeholder={placeholder}
        style={{ width: '100%', border: `1.5px solid ${errors[id] ? '#e53e3e' : 'var(--border)'}`, borderRadius: 10, padding: '11px 14px', fontSize: '0.9rem', outline: 'none' }} />
      {errors[id] && <span style={{ fontSize: '0.75rem', color: '#e53e3e' }}>{errors[id]}</span>}
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <button onClick={() => setPage('cart')} style={{ background: 'none', border: 'none', color: 'var(--green-mid)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: 20 }}>← Back to Cart</button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28 }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: 28 }}>

          <section>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--green-dark)', marginBottom: 16 }}>👤 Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {inp('firstName', 'First Name', 'text', 'First name')}
              {inp('lastName', 'Last Name', 'text', 'Last name')}
              {inp('email', 'Email', 'email', 'your@email.com')}
              {inp('phone', 'Phone', 'tel', '08012345678')}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--green-dark)', marginBottom: 16 }}>📦 Delivery Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {inp('address', 'Street Address', 'text', 'House number and street', true)}
              {inp('area', 'Area', 'text', 'e.g. Lekki Phase 1')}
              {inp('city', 'City', 'text', 'Lagos')}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>State</label>
                <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                  style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 10, padding: '11px 14px', fontSize: '0.9rem', outline: 'none' }}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {inp('landmark', 'Nearest Landmark', 'text', 'e.g. Behind Shoprite')}
            </div>
            <div style={{ background: 'var(--yellow-light)', border: '1px solid var(--yellow)', borderRadius: 10, padding: '12px 16px', fontSize: '0.84rem', marginTop: 14, color: '#7a5800' }}>
              🚚 Lagos — ₦{DC.lagos.toLocaleString()} | Outside Lagos — ₦{DC.outsideLagos.toLocaleString()} | Free above ₦{DC.freeThreshold.toLocaleString()}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--green-dark)', marginBottom: 16 }}>💬 Notes</h3>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Special requests or delivery instructions..."
              style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 10, padding: '11px 14px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', minHeight: 70 }} />
          </section>

          <section>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--green-dark)', marginBottom: 16 }}>💳 Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PAYMENT_METHODS.map(m => (
                <div key={m.key} onClick={() => setMethod(m.key)}
                  style={{ border: `1.5px solid ${method === m.key ? 'var(--green-mid)' : 'var(--border)'}`, background: method === m.key ? 'var(--green-pale)' : 'white', borderRadius: 12, padding: 14, cursor: 'pointer', textAlign: 'center', transition: 'all .2s' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: 2 }}>{m.sub}</div>
                </div>
              ))}
            </div>
            <PaymentInfo method={method} />
          </section>

          <button onClick={placeOrder}
            style={{ width: '100%', background: 'var(--yellow)', color: 'var(--green-dark)', border: 'none', borderRadius: 12, padding: 16, fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer' }}>
            🛍 Place Order Now
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', height: 'fit-content', position: 'sticky', top: 80 }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--green-dark)', marginBottom: 20 }}>Your Order</h3>
          {cart.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.88rem', gap: 8 }}>
              <span style={{ color: 'var(--text-mid)' }}>{i.emoji} {i.name} ×{i.qty}</span>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>₦{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
            {[['VAT (7.5%)', `₦${tax.toLocaleString()}`], ['Delivery', deliveryFee === 0 ? 'FREE 🎉' : `₦${deliveryFee.toLocaleString()}`], ...(podFee ? [['POD Fee', `₦${podFee.toLocaleString()}`]] : [])].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-mid)' }}>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', borderTop: '2px solid var(--border)', paddingTop: 10, marginTop: 6, color: 'var(--green-dark)' }}>
              <span>Total</span><span>₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
