import React from "react";
import "./ArtisanCard.css";

const ArtisanCard = ({ artisan }) => {
  if (!artisan) {
    return (
      <div className="artisan-card">
        <div className="artisan-card-header">
          <h3>Meet the Artisan</h3>
        </div>
        <div className="artisan-card-content">
          <div className="artisan-avatar">
            <img src="/api/placeholder/80/80?text=Artisan" alt="Artisan" />
          </div>
          <div className="artisan-info">
            <h4>Traditional Craftsperson</h4>
            <p className="artisan-location">📍 India</p>
            <p className="artisan-experience">
              🎨 Years of experience in traditional crafts
            </p>
            <div className="artisan-rating">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-text">5.0</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    full_name = "Unknown Artisan",
    profile_image,
    workshop_location = {},
    experience_years = 0,
    rating = 0,
    total_reviews = 0,
    craft_specialization = [],
    story = "",
    verification_status = "pending",
  } = artisan;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    if (hasHalfStar) {
      stars.push("✨");
    }
    while (stars.length < 5) {
      stars.push("☆");
    }

    return stars.join("");
  };

  const getLocationString = () => {
    if (workshop_location.city && workshop_location.state) {
      return `${workshop_location.city}, ${workshop_location.state}`;
    }
    return workshop_location.city || workshop_location.state || "India";
  };

  return (
    <div className="artisan-card">
      <div className="artisan-card-header">
        <h3>Meet the Artisan</h3>
        {verification_status === "verified" && (
          <span className="verified-badge">✓ Verified</span>
        )}
      </div>

      <div className="artisan-card-content">
        <div className="artisan-avatar">
          <img
            src={
              profile_image ||
              "/api/placeholder/80/80?text=" + full_name.charAt(0)
            }
            alt={full_name}
            onError={(e) => {
              e.target.src =
                "/api/placeholder/80/80?text=" + full_name.charAt(0);
            }}
          />
        </div>

        <div className="artisan-info">
          <h4>{full_name}</h4>

          <p className="artisan-location">📍 {getLocationString()}</p>

          {experience_years > 0 && (
            <p className="artisan-experience">
              🎨 {experience_years} years of experience
            </p>
          )}

          {craft_specialization.length > 0 && (
            <div className="artisan-specialization">
              <span className="specialization-label">Specializes in:</span>
              <div className="specialization-tags">
                {craft_specialization.slice(0, 3).map((craft, index) => (
                  <span key={index} className="specialization-tag">
                    {craft}
                  </span>
                ))}
              </div>
            </div>
          )}

          {rating > 0 && (
            <div className="artisan-rating">
              <span className="stars">{renderStars(rating)}</span>
              <span className="rating-text">
                {rating.toFixed(1)} ({total_reviews} reviews)
              </span>
            </div>
          )}

          {story && (
            <div className="artisan-story">
              <p>
                {story.length > 150 ? story.substring(0, 150) + "..." : story}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="artisan-card-actions">
        <button
          className="btn-view-profile"
          onClick={() => {
            // Navigate to artisan profile page
            window.open(`/artisan/${artisan.artisan_id}`, "_blank");
          }}
        >
          View Profile
        </button>
        <button
          className="btn-view-products"
          onClick={() => {
            // Navigate to artisan's products
            window.open(`/search?artisan=${artisan.artisan_id}`, "_blank");
          }}
        >
          View More Products
        </button>
      </div>
    </div>
  );
};

export default ArtisanCard;
