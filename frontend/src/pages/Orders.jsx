import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { fetchUserOrders } from '../services/orderService.js';

const Orders = () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders();
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <div className="loading-state">Loading orders...</div>;

  return (
    <section className="orders-page">
      <h2>{auth.user?.role === 'admin' ? 'My Orders' : 'Order History'}</h2>
      {error && <div className="flash-message error">{error}</div>}
      {orders.length === 0 ? (
        <div className="empty-state">No orders found yet.</div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span>Order #{order._id.slice(-6)}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="order-status">Status: {order.status}</div>
              <div className="order-row"><strong>Total:</strong> ${order.total.toFixed(2)}</div>
              <div className="order-row"><strong>Address:</strong> {order.shippingAddress}</div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.product} className="order-item-row">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;
