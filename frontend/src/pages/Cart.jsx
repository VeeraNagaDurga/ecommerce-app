import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { fetchCart, updateCartItem, removeCartItem } from '../services/cartService.js';

const Cart = () => {
  const { auth } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const handleQuantityChange = async (productId, nextQuantity) => {
    try {
      const data = await updateCartItem(productId, nextQuantity);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    try {
      const data = await removeCartItem(productId);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to remove item');
    }
  };

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) return <div className="loading-state">Loading cart...</div>;

  return (
    <section className="cart-page">
      <h2>Your Cart</h2>
      {error && <div className="flash-message">{error}</div>}
      {cart.items.length === 0 ? (
        <div className="empty-state">Your cart is empty.</div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-panel">
            {cart.items.map((item) => (
              <div key={item.product._id} className="cart-item-card">
                <img src={item.product.imageUrl} alt={item.product.name} />
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>${item.product.price.toFixed(2)}</p>
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)} disabled={item.quantity === 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>+</button>
                  </div>
                </div>
                <button className="button button-link" onClick={() => handleRemove(item.product._id)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-summary-panel">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Items</span><span>{cart.items.length}</span></div>
            <div className="summary-row"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button className="button button-primary" onClick={() => navigate('/checkout')}>
              Continue to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
