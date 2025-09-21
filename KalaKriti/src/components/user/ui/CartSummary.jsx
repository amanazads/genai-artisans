import React from "react";
import { useCart } from "../../../context/CartContext";
import "./CartSummary.css";

const CartSummary = ({ showPromoCode = true, showActions = true }) => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } =
    useCart();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-summary">
        <div className="cart-summary-header">
          <h3>Order Summary</h3>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <button
            className="continue-shopping-btn"
            onClick={() => (window.location.href = "/search")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <div className="cart-summary-header">
        <h3>Order Summary</h3>
        <span className="item-count">({getTotalItems()} items)</span>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img
                src={item.image}
                alt={item.title}
                onError={(e) => {
                  e.target.src = "/api/placeholder/80/80?text=Product";
                }}
              />
            </div>
            <div className="item-details">
              <h4 className="item-title">{item.title}</h4>
              <p className="item-price">{formatPrice(item.price)}</p>

              {showActions && (
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              )}

              {!showActions && (
                <p className="item-quantity">Qty: {item.quantity}</p>
              )}
            </div>
            <div className="item-total">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      {showPromoCode && (
        <div className="promo-code-section">
          <div className="promo-code-input">
            <input
              type="text"
              placeholder="Enter promo code"
              className="promo-input"
            />
            <button className="apply-promo-btn">Apply</button>
          </div>
        </div>
      )}

      {/* Order Totals */}
      <div className="order-totals">
        <div className="total-line">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="total-line">
          <span>Shipping:</span>
          <span className={shipping === 0 ? "free-shipping" : ""}>
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>

        {shipping > 0 && (
          <div className="shipping-note">
            Add {formatPrice(500 - subtotal)} more for free shipping
          </div>
        )}

        <div className="total-line">
          <span>Tax (GST 18%):</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="total-line total-final">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Payment Security */}
      <div className="payment-security">
        <div className="security-item">
          <span className="security-icon">🔒</span>
          <span>Secure checkout</span>
        </div>
        <div className="security-item">
          <span className="security-icon">🚚</span>
          <span>Fast delivery</span>
        </div>
        <div className="security-item">
          <span className="security-icon">🔄</span>
          <span>Easy returns</span>
        </div>
      </div>

      {/* Continue Shopping Link */}
      {showActions && (
        <div className="cart-actions">
          <button
            className="continue-shopping-link"
            onClick={() => (window.location.href = "/search")}
          >
            ← Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
