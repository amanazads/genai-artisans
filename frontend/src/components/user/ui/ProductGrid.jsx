import React, { useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({
  products = [],
  onProductClick,
  onLoadMore,
  hasMore = false,
  loading = false,
  showLoadMore = true,
}) => {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!showLoadMore || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading, onLoadMore, showLoadMore]);

  const handleProductClick = (productId) => {
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  if (products.length === 0 && !loading) {
    return (
      <div className="product-grid-empty">
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or browse our featured collections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="product-grid-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading more products...</p>
          </div>
        </div>
      )}

      {/* Load more trigger */}
      {showLoadMore && hasMore && !loading && (
        <div ref={loadMoreRef} className="load-more-trigger">
          <button className="load-more-btn" onClick={onLoadMore}>
            Load More Products
          </button>
        </div>
      )}

      {/* End of results */}
      {!hasMore && products.length > 0 && (
        <div className="end-of-results">
          <p>You've seen all our amazing products! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
