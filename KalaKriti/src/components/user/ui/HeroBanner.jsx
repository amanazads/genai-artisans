import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

const HeroBanner = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/search");
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${category}`);
  };

  return (
    <div className="hero-banner">
      {/* Main Hero Section */}
      <div className="hero-main">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover Authentic
              <span className="hero-highlight"> Indian Handicrafts</span>
            </h1>
            <p className="hero-subtitle">
              Support traditional artisans and bring home unique, handcrafted
              treasures that tell stories of heritage and skill passed down
              through generations.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={handleExploreClick}>
                🎨 Explore Collection
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleCategoryClick("featured")}
              >
                ✨ Featured Items
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">2000+</span>
                <span className="stat-label">Unique Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Skilled Artisans</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Craft Categories</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/api/placeholder/600/500?text=Traditional+Indian+Handicrafts"
              alt="Traditional Indian Handicrafts"
              onError={(e) => {
                e.target.src = "/api/placeholder/600/500?text=Handicrafts";
              }}
            />
            <div className="image-overlay">
              <div className="featured-badge">🏆 Award Winning Artisans</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="hero-categories">
        <div className="categories-container">
          <h3>Shop by Category</h3>
          <div className="categories-grid">
            {[
              { name: "Pottery", icon: "🏺", color: "#e67e22" },
              { name: "Textiles", icon: "🧵", color: "#9b59b6" },
              { name: "Jewelry", icon: "💎", color: "#f39c12" },
              { name: "Paintings", icon: "🎨", color: "#e74c3c" },
              { name: "Sculptures", icon: "🗿", color: "#34495e" },
              { name: "Handicrafts", icon: "🎭", color: "#16a085" },
            ].map((category, index) => (
              <div
                key={category.name}
                className="category-card"
                onClick={() => handleCategoryClick(category.name.toLowerCase())}
                style={{ "--category-color": category.color }}
              >
                <div className="category-icon">{category.icon}</div>
                <span className="category-name">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="hero-features">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">🚚</div>
            <div className="feature-text">
              <h4>Free Shipping</h4>
              <p>On orders above ₹500</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <div className="feature-text">
              <h4>Secure Payments</h4>
              <p>100% protected transactions</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <div className="feature-text">
              <h4>Authentic Crafts</h4>
              <p>Verified artisan products</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔄</div>
            <div className="feature-text">
              <h4>Easy Returns</h4>
              <p>7-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
