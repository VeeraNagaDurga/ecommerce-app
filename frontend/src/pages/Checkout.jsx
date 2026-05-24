import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../services/cartService.js';
import { createOrder } from '../services/orderService.js';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCart();
        setCart(data);
      } catch (err) {
        setError('Unable to load cart');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!address.trim()) {
      setError('Enter a shipping address');
      return;
    }
    try {
      await createOrder({ shippingAddress: address });
      setSuccess('Order placed successfully');
      setTimeout(() => navigate('/orders'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order');
    }
  };

  if (loading) return <div className="loading-state">Preparing checkout...</div>;
  if (cart.items.length === 0) return <div className="empty-state">Your cart is empty.</div>;

  return (
    <section className="checkout-page">
      <h2>Checkout</h2>
      {error && <div className="flash-message error">{error}</div>}
      {success && <div className="flash-message success">{success}</div>}
      <div className="checkout-grid">
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.product._id} className="checkout-item">
              <span>{item.quantity} × {item.product.name}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>Shipping Address</label>
          <textarea
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="123 Main St, City, Country"
          />
          <button className="button button-primary" type="submit">Place Order</button>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
