import React, { useState } from "react";
import "./ImageGallery.css";

const ImageGallery = ({ images = [], productTitle = "Product" }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const defaultImages = ["/api/placeholder/600/600?text=No+Image"];

  const displayImages = images.length > 0 ? images : defaultImages;

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const handlePrevious = () => {
    setSelectedImage((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImage((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="image-gallery">
      {/* Main Image Display */}
      <div className="main-image-container">
        <div className={`main-image ${isZoomed ? "zoomed" : ""}`}>
          <img
            src={displayImages[selectedImage]}
            alt={`${productTitle} - Image ${selectedImage + 1}`}
            onClick={toggleZoom}
            onError={(e) => {
              e.target.src = "/api/placeholder/600/600?text=Image+Not+Found";
            }}
          />

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                className="nav-arrow nav-arrow-left"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button
                className="nav-arrow nav-arrow-right"
                onClick={handleNext}
                aria-label="Next image"
              >
                &#8250;
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="zoom-indicator">
            <span>🔍 Click to {isZoomed ? "zoom out" : "zoom in"}</span>
          </div>
        </div>

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="image-counter">
            {selectedImage + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="thumbnail-strip">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${index === selectedImage ? "active" : ""}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={image}
                alt={`${productTitle} thumbnail ${index + 1}`}
                onError={(e) => {
                  e.target.src = "/api/placeholder/100/100?text=Thumb";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
