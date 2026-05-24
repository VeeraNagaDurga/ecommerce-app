import { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productService.js';
import { fetchAllOrders } from '../services/orderService.js';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', imageUrl: '', category: '', stock: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [productData, orderData] = await Promise.all([fetchProducts(), fetchAllOrders()]);
      setProducts(productData);
      setOrders(orderData);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin data');
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', description: '', imageUrl: '', category: '', stock: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      imageUrl: formData.imageUrl,
      category: formData.category,
      stock: Number(formData.stock),
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage('Product updated successfully');
      } else {
        await createProduct(payload);
        setMessage('Product added successfully');
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock.toString(),
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setMessage('Product deleted successfully');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete product');
    }
  };

  return (
    <section className="admin-page">
      <h2>Admin Dashboard</h2>
      {(message || error) && (
        <div className={`flash-message ${error ? 'error' : 'success'}`}>{error || message}</div>
      )}
      <div className="admin-grid">
        <div className="admin-panel">
          <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
            <label>Price</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} required />
            <label>Category</label>
            <input name="category" value={formData.category} onChange={handleChange} required />
            <label>Stock</label>
            <input name="stock" type="number" value={formData.stock} onChange={handleChange} required />
            <label>Image URL</label>
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
            <div className="admin-form-actions">
              <button className="button button-primary" type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
              {editingId && <button className="button button-secondary" type="button" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>
        <div className="admin-panel admin-table-panel">
          <h3>Product Management</h3>
          <div className="product-table">
            <div className="product-table-row header">
              <span>Name</span><span>Stock</span><span>Price</span><span>Actions</span>
            </div>
            {products.map((product) => (
              <div key={product._id} className="product-table-row">
                <span>{product.name}</span>
                <span>{product.stock}</span>
                <span>${product.price.toFixed(2)}</span>
                <span className="row-actions">
                  <button className="button button-link" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="button button-link" onClick={() => handleDelete(product._id)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="admin-panel admin-orders-panel">
        <h3>All Orders</h3>
        <div className="order-list">
          {orders.length === 0 && <p>No orders have been placed yet.</p>}
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span>Order #{order._id.slice(-6)}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="order-row"><strong>User:</strong> {order.user?.name || 'N/A'}</div>
              <div className="order-row"><strong>Total:</strong> ${order.total.toFixed(2)}</div>
              <div className="order-row"><strong>Status:</strong> {order.status}</div>
              <div className="order-row"><strong>Address:</strong> {order.shippingAddress}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
