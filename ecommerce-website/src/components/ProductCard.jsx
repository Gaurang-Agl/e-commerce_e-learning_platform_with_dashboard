import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const stockStatus = product.stockQty > 10 ? 'in-stock' :
    product.stockQty > 0 ? 'low-stock' : 'out-of-stock';
  const stockLabel = product.stockQty > 10 ? `${product.stockQty} in stock` :
    product.stockQty > 0 ? `Only ${product.stockQty} left` : 'Out of stock';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stockQty <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const isEmoji = product.image.length <= 4 && !product.image.startsWith('http');

  return (
    <div className="product-card animate-fade-in" onClick={() => navigate(`/product/${product.id}`)} id={`product-${product.id}`} style={{ cursor: 'pointer' }}>
      <div className="product-card-image" style={{ background: isEmoji ? `${product.color}12` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isEmoji ? (
           <span style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{product.image}</span>
        ) : (
           <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name" style={{ height: '3em', overflow: 'hidden' }}>{product.name}</div>
        <div className="product-card-desc" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</div>
        <div className="product-card-footer">
          <div>
            <div className="product-card-price">₹{product.price.toLocaleString()}</div>
            <div className={`product-card-stock ${stockStatus}`}>{stockLabel}</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAddToCart}
            disabled={product.stockQty <= 0}>
            {product.stockQty > 0 ? '+ Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
