import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, updateQuantity, removeItem,
    subtotal, tax, grandTotal, totalItems
  } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to proceed to checkout');
      closeCart();
      navigate('/login');
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>🛒 Cart ({totalItems})</h2>
          <button className="cart-close" onClick={closeCart}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <button className="btn btn-secondary btn-sm" onClick={closeCart} style={{ marginTop: '1rem' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => {
              const isCourse = item.type === 'course';
              const itemKey = isCourse ? `course-${item.courseId}` : `product-${item.productId}`;

              return (
                <div className="cart-item" key={itemKey}>
                  <div className="cart-item-image" style={{ background: `${item.color}18` }}>
                    {isCourse ? '📚' : item.image}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">
                      ₹{item.price.toLocaleString()}
                      {isCourse && (
                        <span style={{
                          marginLeft: 8, fontSize: '0.7rem', padding: '2px 8px',
                          background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
                          borderRadius: 12, fontWeight: 600
                        }}>
                          COURSE
                        </span>
                      )}
                    </div>
                    <div className="cart-item-controls">
                      {isCourse ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                          📚 Digital Access · Qty: 1
                        </span>
                      ) : (
                        <>
                          <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                          <span className="qty-value">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= 5}>+</button>
                        </>
                      )}
                      <button className="cart-item-remove"
                        onClick={() => removeItem(isCourse ? item.courseId : item.productId, isCourse ? 'course' : 'product')}>
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleCheckout}
              style={{ width: '100%', marginTop: '1rem' }}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
