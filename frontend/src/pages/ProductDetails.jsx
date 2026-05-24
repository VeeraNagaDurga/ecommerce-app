import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProduct } from '../services/productService.js';
import { addCartItem } from '../services/cartService.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAdd = async () => {
    if (!auth.user) {
      navigate('/login');
      return;
    }
    try {
      await addCartItem(id, 1);
      setError('Added to cart successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add to cart');
    }
  };

  if (loading) return <div className="loading-state">Loading product details...</div>;
  if (!product) return <div className="error-state">{error || 'Product not available'}</div>;

  return (
    <section className="product-details-page">
      {error && <div className="flash-message">{error}</div>}
      <div className="detail-card">
        <div className="detail-image-panel">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="detail-text-panel">
          <h2>{product.name}</h2>
          <p className="product-category large">{product.category}</p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <p className="stock-label">Stock available: {product.stock}</p>
          <button className="button button-primary" onClick={handleAdd} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
