import React, { useState } from 'react';

export default function Admin({ products, onAddProduct, onDeleteProduct }) {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'adult', image: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    onAddProduct({ ...newProduct, id: Date.now(), price: Number(newProduct.price) });
    setNewProduct({ name: '', price: '', category: 'adult', image: '' });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Inventory Management</h1>
      
      {/* Add Product Form */}
      <section style={{ marginBottom: '3rem', background: '#f4f4f4', padding: '2rem', borderRadius: '8px' }}>
        <h3>Add New Product</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input 
            value={newProduct.name} 
            onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
            placeholder="Product Name" style={inputStyle} required 
          />
          <input 
            value={newProduct.price} 
            onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
            placeholder="Price (₦)" type="number" style={inputStyle} required 
          />
          <select 
            value={newProduct.category} 
            onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
            style={inputStyle}
          >
            <option value="adult">Adult Hair Care</option>
            <option value="kids">Kids</option>
            <option value="kit">Full Kits</option>
          </select>
          <input 
            value={newProduct.image} 
            onChange={e => setNewProduct({...newProduct, image: e.target.value})} 
            placeholder="Image URL" style={inputStyle} required 
          />
          <button type="submit" style={{ ...buttonStyle, gridColumn: 'span 2' }}>Add to Inventory</button>
        </form>
      </section>

      {/* Product List */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #000', textAlign: 'left' }}>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px 0' }}>{p.name}</td>
              <td>{p.category}</td>
              <td>₦{p.price.toLocaleString()}</td>
              <td>
                <button 
                  onClick={() => onDeleteProduct(p.id)} 
                  style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
