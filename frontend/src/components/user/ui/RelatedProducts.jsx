import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { userAPI } from "../../../services/user/userAPI";
import "./RelatedProducts.css";

const RelatedProducts = ({ productId, category, artisanId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch related products from API
        let response;
        if (productId) {
          response = await userAPI.getRelatedProducts(productId);
        } else {
          // Fallback to category-based search
          response = await userAPI.searchProducts({ category, limit: 8 });
        }

        if (response.success) {
          // Filter out the current product if it's in the results
          const filtered =
            response.data.products?.filter((p) => p.id !== productId) || [];
          setRelatedProducts(filtered.slice(0, 6)); // Show max 6 related products
        } else {
          // Fallback to mock data
          setRelatedProducts(generateMockRelatedProducts(category, artisanId));
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
        // Fallback to mock data
        setRelatedProducts(generateMockRelatedProducts(category, artisanId));
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, category, artisanId]);

  const generateMockRelatedProducts = (category = "Handicrafts", artisanId) => {
    const categories = [
      "Pottery",
      "Textiles",
      "Jewelry",
      "Paintings",
      "Sculptures",
      "Handicrafts",
    ];
    const currentCategory = categories.includes(category)
      ? category
      : "Handicrafts";

    return Array.from({ length: 6 }, (_, index) => ({
      id: `related_${index + 1}`,
      title: `${currentCategory} Product ${index + 1}`,
      price: Math.floor(Math.random() * 5000) + 500,
      images: [`/api/placeholder/300/300?text=${currentCategory}+${index + 1}`],
      category: currentCategory,
      artisan_id: artisanId || `artisan_${Math.floor(Math.random() * 10) + 1}`,
      rating: 4 + Math.random(),
      total_reviews: Math.floor(Math.random() * 100) + 10,
      tags: [`${currentCategory.toLowerCase()}`, "handmade", "traditional"],
      artisan: {
        full_name: `Artisan ${index + 1}`,
        workshop_location: { city: "Mumbai", state: "Maharashtra" },
      },
    }));
  };

  if (loading) {
    return (
      <div className="related-products">
        <h3>Related Products</h3>
        <div className="related-products-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="product-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || relatedProducts.length === 0) {
    return (
      <div className="related-products">
        <h3>Related Products</h3>
        <div className="no-related-products">
          <p>No related products found at the moment.</p>
          <button
            className="btn-browse-all"
            onClick={() => (window.location.href = "/search")}
          >
            Browse All Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="related-products">
      <div className="related-products-header">
        <h3>You might also like</h3>
        <button
          className="btn-view-all"
          onClick={() => {
            const searchParams = new URLSearchParams();
            if (category) searchParams.set("category", category);
            if (artisanId) searchParams.set("artisan", artisanId);
            window.location.href = `/search?${searchParams.toString()}`;
          }}
        >
          View All
        </button>
      </div>

      <div className="related-products-grid">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} compact={true} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
