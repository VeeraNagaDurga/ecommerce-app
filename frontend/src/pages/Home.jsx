import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { fetchProducts } from '../services/productService.js';
import { addCartItem } from '../services/cartService.js';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAdd = async (productId) => {
    if (!auth.user) {
      navigate('/login');
      return;
    }
    try {
      await addCartItem(productId, 1);
      setError('Product added to cart');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add to cart');
    }
  };

  return (
    <section className="home-page">
      <div className="hero-panel">
        <h1>Shop smarter with a modern online store</h1>
        <p>Browse curated products, save favorites, and checkout in seconds.</p>
      </div>
      {error && <div className="flash-message">{error}</div>}
      {loading ? (
        <div className="loading-state">Loading products...</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;
