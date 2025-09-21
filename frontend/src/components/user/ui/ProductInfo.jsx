import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import "./ProductInfo.css";

const ProductInfo = ({ product }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="product-info">
        <div className="product-info-loading">
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
          <div className="skeleton-description"></div>
        </div>
      </div>
    );
  }

  const {
    title = "Untitled Product",
    description = "No description available",
    price = 0,
    category = "Unknown",
    tags = [],
    stock = 0,
    status = "active",
  } = product;

  const handleAddToCart = () => {
    if (stock > 0 && status === "active") {
      addToCart({
        id: product.id,
        title,
        price,
        quantity: selectedQuantity,
        image: product.images?.[0] || "/api/placeholder/100/100?text=Product",
        artisan_id: product.artisan_id,
      });

      // Show success feedback
      const btn = document.querySelector(".btn-add-to-cart");
      const originalText = btn.textContent;
      btn.textContent = "✓ Added to Cart";
      btn.style.background = "#4CAF50";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "#ff6b35";
      }, 2000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const isOutOfStock = stock === 0 || status !== "active";

  return (
    <div className="product-info">
      {/* Product Title */}
      <div className="product-header">
        <h1 className="product-title">{title}</h1>
        {category && <span className="product-category">{category}</span>}
      </div>

      {/* Price Section */}
      <div className="product-pricing">
        <div className="price-main">{formatPrice(price)}</div>
        {price > 1000 && (
          <div className="price-savings">
            <span className="emi-text">
              EMI starting from {formatPrice(price / 12)}/month
            </span>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="stock-status">
        {isOutOfStock ? (
          <span className="out-of-stock">❌ Out of Stock</span>
        ) : stock < 5 ? (
          <span className="low-stock">⚠️ Only {stock} left in stock</span>
        ) : (
          <span className="in-stock">✅ In Stock ({stock} available)</span>
        )}
      </div>

      {/* Product Tags */}
      {tags.length > 0 && (
        <div className="product-tags">
          {tags.map((tag, index) => (
            <span key={index} className="product-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="product-description">
        <h3>About this Product</h3>
        <div
          className={`description-content ${
            showFullDescription ? "expanded" : ""
          }`}
        >
          <p>{description}</p>
        </div>
        {description.length > 200 && (
          <button
            className="btn-show-more"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* Quantity and Add to Cart */}
      <div className="product-actions">
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity:</label>
          <select
            id="quantity"
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
            disabled={isOutOfStock}
          >
            {[...Array(Math.min(stock, 10))].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="action-buttons">
          <button
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
          </button>

          <button
            className="btn-buy-now"
            onClick={() => {
              handleAddToCart();
              // Navigate to checkout or cart
              window.location.href = "/checkout";
            }}
            disabled={isOutOfStock}
          >
            ⚡ Buy Now
          </button>
        </div>
      </div>

      {/* Product Features */}
      <div className="product-features">
        <div className="feature-item">
          <span className="feature-icon">🚚</span>
          <div className="feature-text">
            <strong>Free Delivery</strong>
            <small>For orders above ₹500</small>
          </div>
        </div>

        <div className="feature-item">
          <span className="feature-icon">🔄</span>
          <div className="feature-text">
            <strong>Easy Returns</strong>
            <small>7-day return policy</small>
          </div>
        </div>

        <div className="feature-item">
          <span className="feature-icon">🎨</span>
          <div className="feature-text">
            <strong>Handcrafted</strong>
            <small>Made by skilled artisans</small>
          </div>
        </div>

        <div className="feature-item">
          <span className="feature-icon">✅</span>
          <div className="feature-text">
            <strong>Quality Assured</strong>
            <small>Verified by our experts</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
