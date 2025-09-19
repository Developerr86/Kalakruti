import React from 'react';
import { useCart } from '../../hooks';
import { formatPrice } from '../../utils/helpers';
import './ShoppingCart.css';

const ShoppingCart = ({ isOpen, onClose, onCheckout }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    itemCount 
  } = useCart();

  const handleQuantityChange = (artworkId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(artworkId);
    } else {
      updateQuantity(artworkId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout(cartItems, cartTotal);
    }
    // In a real app, this would redirect to checkout
    alert(`Proceeding to checkout with ${itemCount} items totaling ${formatPrice(cartTotal)}`);
  };

  const handleContinueShopping = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <h2 className="cart-title">
            Shopping Cart
            {itemCount > 0 && <span className="cart-count">({itemCount})</span>}
          </h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        {/* Cart Content */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="cart-empty">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Discover amazing artworks and add them to your cart.</p>
              <button className="btn-primary" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Cart Items */
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.title} />
                    </div>
                    
                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.title}</h4>
                      <p className="cart-item-artist">by {item.artistName}</p>
                      
                      <div className="cart-item-info">
                        <span className="cart-item-category">{item.category}</span>
                        <span className="cart-item-materials">{item.materials}</span>
                      </div>
                      
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-price">
                      <div className="item-unit-price">{formatPrice(item.price)}</div>
                      {item.quantity > 1 && (
                        <div className="item-total-price">
                          Total: {formatPrice(item.price * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal ({itemCount} items):</span>
                  <span className="summary-amount">{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="summary-amount">
                    {cartTotal > 100 ? 'Free' : formatPrice(15)}
                  </span>
                </div>
                
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span className="summary-total">
                    {formatPrice(cartTotal + (cartTotal > 100 ? 0 : 15))}
                  </span>
                </div>
                
                {cartTotal <= 100 && (
                  <div className="shipping-notice">
                    Add {formatPrice(100 - cartTotal)} more for free shipping!
                  </div>
                )}
              </div>

              {/* Cart Actions */}
              <div className="cart-actions">
                <button 
                  className="btn-secondary cart-action-btn"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
                
                <button 
                  className="btn-primary cart-action-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                
                <button 
                  className="btn-ghost clear-cart-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* Trust Badges */}
        <div className="cart-trust-badges">
          <div className="trust-badge">
            <span className="trust-icon">🔒</span>
            <span className="trust-text">Secure Checkout</span>
          </div>
          <div className="trust-badge">
            <span className="trust-icon">🚚</span>
            <span className="trust-text">Fast Shipping</span>
          </div>
          <div className="trust-badge">
            <span className="trust-icon">↩️</span>
            <span className="trust-text">Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;