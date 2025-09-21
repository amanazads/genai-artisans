import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserLayout from "../../components/user/layout/UserLayout";
import ImageGallery from "../../components/user/ui/ImageGallery";
import ArtisanCard from "../../components/user/ui/ArtisanCard";
import ProductInfo from "../../components/user/ui/ProductInfo";
import RelatedProducts from "../../components/user/ui/RelatedProducts";
import { userAPI } from "../../services/user/userAPI";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProductDetails();
    }
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userAPI.getProduct(productId);

      if (response.success) {
        setProduct(response.data);

        // Load artisan details
        if (response.data.artisanId) {
          const artisanResponse = await userAPI.getArtisan(
            response.data.artisanId
          );
          if (artisanResponse.success) {
            setArtisan(artisanResponse.data);
          }
        }

        // Load related products
        const relatedResponse = await userAPI.getRelatedProducts(productId);
        if (relatedResponse.success) {
          setRelatedProducts(relatedResponse.data || []);
        }
      } else {
        setError("Product not found");
      }
    } catch (error) {
      console.error("Error loading product details:", error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);

      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: selectedQuantity,
        artisanName: artisan?.name || "Unknown Artisan",
      };

      await addToCart(cartItem);

      // Show success notification
      alert(`Added ${selectedQuantity} ${product.name}(s) to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          returnUrl: `/product/${productId}`,
          message: "Please login to proceed with purchase",
        },
      });
      return;
    }

    await handleAddToCart();
    navigate("/cart");
  };

  const handleArtisanClick = () => {
    if (artisan) {
      navigate(`/artisan/${artisan._id}`);
    }
  };

  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/product/${relatedProductId}`);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="product-detail-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error || !product) {
    return (
      <UserLayout>
        <div className="product-detail-error">
          <div className="error-content">
            <h2>Product Not Found</h2>
            <p>{error || "The product you are looking for does not exist."}</p>
            <button className="back-to-home-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="product-detail-page">
        <div className="product-container">
          {/* Product Images */}
          <div className="product-images-section">
            <ImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            <ProductInfo
              product={product}
              selectedQuantity={selectedQuantity}
              onQuantityChange={setSelectedQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isAddingToCart={isAddingToCart}
            />
          </div>
        </div>

        {/* Meet the Artisan Section */}
        {artisan && (
          <div className="artisan-section">
            <h2 className="section-title">Meet the Artisan</h2>
            <ArtisanCard
              artisan={artisan}
              onClick={handleArtisanClick}
              showFullProfile={true}
            />
          </div>
        )}

        {/* Product Description */}
        <div className="description-section">
          <h2 className="section-title">Product Description</h2>
          <div className="description-content">
            <div className="ai-description">
              <h3>✨ AI-Generated Description</h3>
              <p>
                {product.aiDescription ||
                  "This handcrafted piece represents the rich cultural heritage and skilled artisanship passed down through generations."}
              </p>
            </div>

            {product.description && (
              <div className="manual-description">
                <h3>📝 Artisan's Notes</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product-details">
              <h3>🔍 Product Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Material:</span>
                  <span className="detail-value">
                    {product.material || "Handcrafted materials"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dimensions:</span>
                  <span className="detail-value">
                    {product.dimensions || "Custom size"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Origin:</span>
                  <span className="detail-value">
                    {product.origin || artisan?.location || "India"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Craft Type:</span>
                  <span className="detail-value">
                    {product.craftType || "Traditional handicraft"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="section-title">You Might Also Like</h2>
            <RelatedProducts
              products={relatedProducts}
              onProductClick={handleRelatedProductClick}
            />
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default ProductDetailPage;
