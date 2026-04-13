import React, { useState, useEffect, useRef } from 'react';
import { Eye, X, LogOut, Package, ClipboardList, Settings } from 'lucide-react';
import initialProducts from '../data/products';
import storeConfig from '../data/storeConfig';

const STATUS_COLORS = {
  pending:    { background: '#fef3c7', color: '#92400e' },
  processing: { background: '#dbeafe', color: '#1e40af' },
  shipped:    { background: '#d1fae5', color: '#065f46' },
  delivered:  { background: '#e8f5e9', color: '#1a4d2e' },
  cancelled:  { background: '#fee2e2', color: '#991b1b' },
};

const TABS = [
  { key: 'orders',   label: 'Orders',   icon: <ClipboardList size={16} /> },
  { key: 'products', label: 'Products', icon: <Package size={16} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={16} /> },
];

function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  function attempt() {
    const savedUser = localStorage.getItem('jmanelAdminUser') || storeConfig.admin.username;
    const savedPass = localStorage.getItem('jmanelAdminPass') || storeConfig.admin.password;
    if (user === savedUser && pass === savedPass) onLogin();
    else setErr('Incorrect username or password');
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: '40px 32px', boxShadow: 'var(--shadow-lg)', width: 360, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🔐</div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--green-dark)', marginBottom: 6 }}>Admin Dashboard</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: 24 }}>J'manel Superstores — Staff Only</p>
        {err && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 14 }}>{err}</div>}
        {[['Username', user, setUser, 'text'], ['Password', pass, setPass, 'password']].map(([label, val, setter, type]) => (
          <div key={label} style={{ marginBottom: 12, textAlign: 'left' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{label}</label>
            <input type={type} value={val} onChange={e => setter(e.target.value)} autoComplete="off"
              onKeyDown={e => e.key === 'Enter' && attempt()}
              style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 10, padding: '11px 14px', fontSize: '0.9rem', outline: 'none' }} />
          </div>
        ))}
        <button onClick={attempt}
          style={{ width: '100%', background: 'var(--green-dark)', color: 'white', border: 'none', borderRadius: 12, padding: 13, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
          Sign In →
        </button>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: 14 }}>Shortcut: <strong>Ctrl + Shift + A</strong></p>
      </div>
    </div>
  );
}

function Stats({ orders }) {
  const stats = [
    { label: 'Total Orders', value: orders.length, sub: 'All time', accent: 'var(--green-mid)' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, sub: 'Awaiting processing', accent: 'var(--yellow)' },
    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, sub: 'Being prepared', accent: '#3182ce' },
    { label: 'Revenue', value: '₦' + orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0).toLocaleString(), sub: 'Active orders', accent: 'var(--green-mid)' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow)', borderLeft: `4px solid ${s.accent}` }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--green-dark)', lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 4 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

function OrderModal({ order, onClose, onStatusChange }) {
  if (!order) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 560, width: '100%', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--green-dark)' }}>Order {order.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: 12, fontWeight: 700, color: 'var(--green-dark)' }}>👤 Customer</div>
        {[['Name', `${order.customer.firstName} ${order.customer.lastName}`], ['Phone', order.customer.phone], ['Email', order.customer.email], ['Address', `${order.customer.address}, ${order.customer.area}, ${order.customer.city}, ${order.customer.state}`], ...(order.customer.landmark ? [['Landmark', order.customer.landmark]] : []), ...(order.customer.notes ? [['Notes', order.customer.notes]] : [])].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem', gap: 12 }}>
            <strong style={{ flexShrink: 0 }}>{k}</strong><span style={{ textAlign: 'right' }}>{v}</span>
          </div>
        ))}
        <div style={{ margin: '12px 0 4px', fontWeight: 700, color: 'var(--green-dark)' }}>🛍 Items</div>
        {order.items.map(i => (
          <div key={i.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
            <span>{i.name} ×{i.qty}</span><span>₦{(i.price * i.qty).toLocaleString()}</span>
          </div>
        ))}
        <div style={{ margin: '12px 0 4px', fontWeight: 700, color: 'var(--green-dark)' }}>💰 Payment</div>
        {[['Method', order.payment], ['Subtotal', `₦${order.subtotal.toLocaleString()}`], ['VAT', `₦${order.tax.toLocaleString()}`], ['Delivery', order.delivery === 0 ? 'FREE' : `₦${order.delivery.toLocaleString()}`], ...(order.podFee ? [['POD Fee', `₦${order.podFee.toLocaleString()}`]] : []), ['TOTAL', `₦${order.total.toLocaleString()}`]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: k === 'TOTAL' ? '1rem' : '0.88rem', fontWeight: k === 'TOTAL' ? 700 : 400 }}>
            <strong>{k}</strong><span style={{ color: k === 'TOTAL' ? 'var(--green-dark)' : 'inherit' }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-mid)', display: 'block', marginBottom: 6 }}>Update Status</label>
          <select value={order.status} onChange={e => onStatusChange(order.id, e.target.value)}
            style={{ border: '1.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: '0.88rem', width: '100%', cursor: 'pointer' }}>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product: p, fileRef, onImgClick, onFileChange, onSave }) {
  const [name, setName] = useState(p.name);
  const [brand, setBrand] = useState(p.brand);
  const [price, setPrice] = useState(p.price);
  const [oldPrice, setOldPrice] = useState(p.oldPrice || '');
  const [imgHover, setImgHover] = useState(false);
  useEffect(() => { setName(p.name); setBrand(p.brand); setPrice(p.price); setOldPrice(p.oldPrice || ''); }, [p]);

  return (
    <div style={{ border: '1.5px solid var(--border)', borderRadius: 14, overflow: 'hidden', background: 'var(--cream)' }}>
      <div style={{ width: '100%', height: 160, background: 'linear-gradient(135deg,#e8f5e9,#f1f8e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
        onClick={onImgClick} onMouseEnter={() => setImgHover(true)} onMouseLeave={() => setImgHover(false)}>
        {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '3rem' }}>{p.emoji}</span>}
        {imgHover && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,77,46,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: '1.8rem' }}>📷</span>
            <span style={{ color: 'white', fontSize: '0.82rem', fontWeight: 600 }}>{p.image ? 'Change Photo' : 'Upload Photo'}</span>
          </div>
        )}
        <input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} style={{ display: 'none' }} />
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[['Product Name', name, setName], ['Brand', brand, setBrand]].map(([label, val, setter]) => (
          <div key={label}>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{label}</label>
            <input value={val} onChange={e => setter(e.target.value)}
              style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: '0.88rem', outline: 'none' }} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          {[['Price (₦)', price, setPrice], ['Old Price (₦)', oldPrice, setOldPrice]].map(([label, val, setter]) => (
            <div key={label} style={{ flex: 1 }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{label}</label>
              <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder={label.includes('Old') ? 'optional' : ''}
                style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: '0.88rem', outline: 'none' }} />
            </div>
          ))}
        </div>
        <button onClick={() => onSave(name, brand, price, oldPrice)}
          style={{ background: 'var(--green-dark)', color: 'white', border: 'none', borderRadius: 8, padding: 9, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
          💾 Save Changes
        </button>
      </div>
    </div>
  );
}

function ProductManager({ products, setProducts }) {
  const fileRefs = useRef({});
  function handleImg(id, e) {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => setProducts(products.map(p => p.id === id ? { ...p, image: ev.target.result } : p));
    reader.readAsDataURL(file);
  }
  function saveProduct(id, name, brand, price, oldPrice) {
    if (!name.trim()) { alert('Name cannot be empty'); return; }
    setProducts(products.map(p => p.id === id ? { ...p, name: name.trim(), brand: brand.trim() || p.brand, price: parseInt(price) || p.price, oldPrice: parseInt(oldPrice) || null } : p));
  }
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--green-dark)', marginBottom: 6 }}>🛍 Manage Products</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 20 }}>
        Hover over image to upload photo. Edit name, brand and price then Save.<br />
        <strong>To add new products permanently:</strong> edit <code>src/data/products.js</code> on GitHub.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p}
            fileRef={el => fileRefs.current[p.id] = el}
            onImgClick={() => fileRefs.current[p.id]?.click()}
            onFileChange={e => handleImg(p.id, e)}
            onSave={(name, brand, price, oldPrice) => saveProduct(p.id, name, brand, price, oldPrice)} />
        ))}
      </div>
    </div>
  );
}

function SettingsPanel({ onLogout }) {
  const [logoPreview, setLogoPreview] = useState(localStorage.getItem('jmanelLogo') || null);
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const logoRef = useRef();

  function uploadLogo(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { localStorage.setItem('jmanelLogo', ev.target.result); setLogoPreview(ev.target.result); };
    reader.readAsDataURL(file);
  }
  function saveLogin() {
    if (!newUser.trim() || !newPass.trim()) { alert('Enter both fields'); return; }
    localStorage.setItem('jmanelAdminUser', newUser.trim());
    localStorage.setItem('jmanelAdminPass', newPass.trim());
    setNewUser(''); setNewPass('');
    alert('✅ Login updated!');
  }

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 28, boxShadow: 'var(--shadow)' }}>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--green-dark)', marginBottom: 24 }}>⚙️ Settings</h3>

      <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
        <h4 style={{ marginBottom: 14, color: 'var(--green-dark)' }}>🖼️ Business Logo</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <div style={{ width: 80, height: 80, background: 'var(--yellow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', overflow: 'hidden' }}>
            {logoPreview ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : '🌿'}
          </div>
          <div>
            <button onClick={() => logoRef.current?.click()} style={{ background: 'var(--green-dark)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>📷 Upload Logo</button>
            {logoPreview && <button onClick={() => { localStorage.removeItem('jmanelLogo'); setLogoPreview(null); }} style={{ background: 'none', border: '1.5px solid #e53e3e', color: '#e53e3e', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem', marginLeft: 8 }}>Remove</button>}
            <input type="file" accept="image/*" ref={logoRef} onChange={uploadLogo} style={{ display: 'none' }} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
        <h4 style={{ marginBottom: 14, color: 'var(--green-dark)' }}>🔐 Change Admin Login</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 440 }}>
          {[['New Username', newUser, setNewUser, 'text'], ['New Password', newPass, setNewPass, 'password']].map(([label, val, setter, type]) => (
            <div key={label}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{label}</label>
              <input type={type} value={val} onChange={e => setter(e.target.value)} autoComplete="off"
                style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 10, padding: '11px 14px', fontSize: '0.9rem', outline: 'none' }} />
            </div>
          ))}
        </div>
        <button onClick={saveLogin} style={{ background: 'var(--green-dark)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, cursor: 'pointer', marginTop: 14 }}>🔐 Update Login</button>
      </div>

      <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
        <h4 style={{ marginBottom: 10, color: 'var(--green-dark)' }}>📁 Adding Products & Images on GitHub</h4>
        <div style={{ background: 'var(--green-pale)', borderRadius: 12, padding: 20, fontSize: '0.86rem', lineHeight: 2, color: 'var(--text-mid)' }}>
          <strong style={{ color: 'var(--text-dark)' }}>To add products:</strong><br />
          1. Go to GitHub repo → open <code>src/data/products.js</code><br />
          2. Copy an existing product block and change the details<br />
          3. Give it a new unique <code>id</code> number → Commit!<br /><br />
          <strong style={{ color: 'var(--text-dark)' }}>To add images permanently:</strong><br />
          1. Upload image to <code>public/images/</code> on GitHub<br />
          2. In products.js set <code>image: "/images/yourfile.jpg"</code><br />
          3. Commit → image appears on live site!
        </div>
      </div>

      <div>
        <h4 style={{ marginBottom: 10, color: 'var(--green-dark)' }}>🚪 Logout</h4>
        <button onClick={onLogout} style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 600 }}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem('jmanelProducts') || 'null') || initialProducts);

  useEffect(() => { if (loggedIn) setOrders(JSON.parse(localStorage.getItem('jmanelOrders') || '[]')); }, [loggedIn, tab]);
  useEffect(() => { if (loggedIn) localStorage.setItem('jmanelProducts', JSON.stringify(products)); }, [products, loggedIn]);

  function updateStatus(id, status) {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('jmanelOrders', JSON.stringify(updated));
    if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status }));
  }

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--green-dark)' }}>⚙️ Admin Dashboard</h2>
        <button onClick={() => setLoggedIn(false)} style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? 'var(--green-dark)' : 'var(--text-mid)', borderBottom: `3px solid ${tab === t.key ? 'var(--green-dark)' : 'transparent'}`, marginBottom: -2 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div>
          <Stats orders={orders} />
          <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--green-dark)', marginBottom: 16 }}>All Orders</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(f => (
                <button key={f} onClick={() => setOrderFilter(f)}
                  style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${orderFilter === f ? 'var(--green-dark)' : 'var(--border)'}`, background: orderFilter === f ? 'var(--green-dark)' : 'white', color: orderFilter === f ? 'white' : 'var(--text-mid)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📋</div>
                <p>No orders yet!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
                  <thead>
                    <tr>
                      {['Order ID', 'Customer', 'Phone', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, color: 'var(--text-light)', fontSize: '0.78rem', textTransform: 'uppercase', borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id}>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}><strong>{o.id}</strong></td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>{o.customer.firstName} {o.customer.lastName}</td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>{o.customer.phone}</td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>{o.items.length} item(s)</td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}><strong>₦{o.total.toLocaleString()}</strong></td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', textTransform: 'capitalize' }}>{o.payment}</td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ ...STATUS_COLORS[o.status], padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{o.status}</span>
                        </td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>{o.date}</td>
                        <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                              style={{ border: '1.5px solid var(--border)', borderRadius: 7, padding: '4px 6px', fontSize: '0.78rem', cursor: 'pointer' }}>
                              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button onClick={() => setSelectedOrder(o)}
                              style={{ background: 'var(--green-dark)', color: 'white', border: 'none', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem' }}>
                              <Eye size={12} /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'products' && <ProductManager products={products} setProducts={setProducts} />}
      {tab === 'settings' && <SettingsPanel onLogout={() => setLoggedIn(false)} />}
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={updateStatus} />}
    </div>
  );
}
