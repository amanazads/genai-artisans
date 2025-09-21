import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { userAPI } from "../../../services/user/userAPI";
import "./ProductCarousel.css";

const ProductCarousel = ({ title, category, limit = 8, type = "featured" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        switch (type) {
          case "featured":
            response = await userAPI.getFeaturedProducts();
            break;
          case "new-arrivals":
            response = await userAPI.getNewArrivals();
            break;
          case "bestsellers":
            response = await userAPI.getBestsellers();
            break;
          default:
            response = await userAPI.getAllProducts({ limit, category });
        }

        if (response.success) {
          setProducts(response.data.products || []);
        } else {
          // Fallback to mock data
          setProducts(generateMockProducts());
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts(generateMockProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit, type]);

  const generateMockProducts = () => {
    const categories = [
      "Pottery",
      "Textiles",
      "Jewelry",
      "Paintings",
      "Sculptures",
    ];
    const currentCategory =
      category || categories[Math.floor(Math.random() * categories.length)];

    return Array.from({ length: limit }, (_, index) => ({
      id: `${type}_${index + 1}`,
      title: `${currentCategory} Product ${index + 1}`,
      price: Math.floor(Math.random() * 5000) + 500,
      images: [`/api/placeholder/300/300?text=${currentCategory}+${index + 1}`],
      category: currentCategory,
      artisan_id: `artisan_${Math.floor(Math.random() * 10) + 1}`,
      rating: 4 + Math.random(),
      total_reviews: Math.floor(Math.random() * 100) + 10,
      tags: [`${currentCategory.toLowerCase()}`, "handmade", "traditional"],
      artisan: {
        full_name: `Artisan ${index + 1}`,
        workshop_location: { city: "Mumbai", state: "Maharashtra" },
      },
    }));
  };

  const getVisibleCount = () => {
    const width = window.innerWidth;
    if (width < 480) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxSlide = Math.max(0, products.length - visibleCount);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(Math.min(index, maxSlide));
  };

  if (loading) {
    return (
      <div className="product-carousel">
        <div className="carousel-header">
          <h2>{title || "Loading Products..."}</h2>
        </div>
        <div className="carousel-content">
          <div className="carousel-track">
            {Array.from({ length: visibleCount }, (_, index) => (
              <div key={index} className="carousel-slide">
                <div className="product-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-carousel">
        <div className="carousel-header">
          <h2>{title || "No Products Found"}</h2>
        </div>
        <div className="no-products">
          <p>No products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-carousel">
      <div className="carousel-header">
        <h2>{title || "Featured Products"}</h2>
        {products.length > visibleCount && (
          <div className="carousel-controls">
            <button
              className="carousel-btn prev"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              aria-label="Previous products"
            >
              ‹
            </button>
            <button
              className="carousel-btn next"
              onClick={nextSlide}
              disabled={currentSlide >= maxSlide}
              aria-label="Next products"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="carousel-content" ref={carouselRef}>
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentSlide * (100 / visibleCount)}%)`,
            width: `${(products.length / visibleCount) * 100}%`,
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="carousel-slide"
              style={{ width: `${100 / products.length}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {products.length > visibleCount && (
        <div className="carousel-dots">
          {Array.from({ length: maxSlide + 1 }, (_, index) => (
            <button
              key={index}
              className={`carousel-dot ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="carousel-footer">
        <button
          className="view-all-btn"
          onClick={() => {
            const searchParams = new URLSearchParams();
            if (category) searchParams.set("category", category);
            if (type !== "featured") searchParams.set("type", type);
            window.location.href = `/search?${searchParams.toString()}`;
          }}
        >
          View All {title || "Products"} →
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
