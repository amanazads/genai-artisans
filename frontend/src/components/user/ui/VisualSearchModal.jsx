import React, { useState, useRef } from "react";
import "./VisualSearchModal.css";

const VisualSearchModal = ({ isOpen, onClose, onImageSubmit }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    try {
      setIsUploading(true);
      await onImageSubmit(selectedImage);
      handleClose();
    } catch (error) {
      console.error("Error submitting image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setIsDragging(false);
    setIsUploading(false);
    onClose();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="visual-search-modal-overlay" onClick={handleClose}>
      <div className="visual-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Visual Search</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {!selectedImage ? (
            <div className="upload-section">
              <div
                className={`drop-zone ${isDragging ? "dragging" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="drop-zone-content">
                  <div className="upload-icon">📸</div>
                  <h3>Search by Image</h3>
                  <p>Upload an image to find similar handcrafted products</p>

                  <div className="upload-buttons">
                    <button
                      className="upload-btn gallery-btn"
                      onClick={handleGalleryClick}
                    >
                      📁 Upload from Gallery
                    </button>

                    <button
                      className="upload-btn camera-btn"
                      onClick={handleCameraClick}
                    >
                      📷 Take a Photo
                    </button>
                  </div>

                  <p className="upload-hint">Or drag and drop an image here</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="camera"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <div className="preview-section">
              <div className="image-preview">
                <img src={imagePreview} alt="Selected" />
                <button
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                >
                  ×
                </button>
              </div>

              <div className="preview-info">
                <h3>Selected Image</h3>
                <p>We'll find products similar to this image using AI</p>

                <div className="preview-actions">
                  <button className="cancel-btn" onClick={handleRemoveImage}>
                    Choose Different Image
                  </button>

                  <button
                    className="search-btn"
                    onClick={handleSubmit}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Searching...
                      </>
                    ) : (
                      "Find Similar Products"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="tips">
            <h4>💡 Tips for better results:</h4>
            <ul>
              <li>Use clear, well-lit images</li>
              <li>Focus on the craft or pattern you want to find</li>
              <li>Avoid backgrounds that might confuse the AI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSearchModal;
