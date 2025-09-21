import React from "react";
import "./ProductCard.css";

const ProductCard = ({
  product,
  onClick,
  showArtisan = true,
  className = "",
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product.id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`product-card ${className}`} onClick={handleClick}>
      <div className="product-image">
        <img
          src={product.images?.[0] || "/uploads/placeholder.jpg"}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = "/uploads/placeholder.jpg";
          }}
        />
        {product.rating && (
          <div className="product-rating">⭐ {product.rating}</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>

        {showArtisan && product.artisan_name && (
          <p className="product-artisan">by {product.artisan_name}</p>
        )}

        <div className="product-price">{formatPrice(product.price)}</div>

        {product.craft_type && (
          <div className="product-craft-type">{product.craft_type}</div>
        )}
      </div>

      <div className="product-overlay">
        <button className="quick-view-btn">👁️ Quick View</button>
      </div>
    </div>
  );
};

export default ProductCard;
