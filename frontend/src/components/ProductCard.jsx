import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAdd }) => {
  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-link">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </Link>
      <div className="product-card-body">
        <div>
          <h3>{product.name}</h3>
          <p className="product-category">{product.category}</p>
        </div>
        <div className="product-card-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="button button-secondary" onClick={() => onAdd(product._id)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
