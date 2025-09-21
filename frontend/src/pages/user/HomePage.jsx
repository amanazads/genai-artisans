import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/user/layout/UserLayout";
import HeroBanner from "../../components/user/ui/HeroBanner";
import SearchBar from "../../components/user/ui/SearchBar";
import ProductCarousel from "../../components/user/ui/ProductCarousel";
import ProductGrid from "../../components/user/ui/ProductGrid";
import VisualSearchModal from "../../components/user/ui/VisualSearchModal";
import { userAPI } from "../../services/user/userAPI";
import "./HomePage.css";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load featured products, new arrivals, and bestsellers
      const [featuredRes, newArrivalsRes, bestsellersRes, allProductsRes] =
        await Promise.all([
          userAPI.getFeaturedProducts(),
          userAPI.getNewArrivals(),
          userAPI.getBestsellers(),
          userAPI.getAllProducts(1, 20),
        ]);

      setFeaturedProducts(featuredRes.data || []);
      setNewArrivals(newArrivalsRes.data || []);
      setBestsellers(bestsellersRes.data || []);
      setAllProducts(allProductsRes.data || []);
      setHasMore(allProductsRes.hasMore || false);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await userAPI.getAllProducts(nextPage, 20);

      if (response.data && response.data.length > 0) {
        setAllProducts((prev) => [...prev, ...response.data]);
        setPage(nextPage);
        setHasMore(response.hasMore || false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleVisualSearch = (imageFile) => {
    navigate("/search", {
      state: {
        visualSearch: true,
        imageFile,
      },
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <UserLayout>
      <div className="home-page">
        {/* Search Bar */}
        <div className="search-section">
          <SearchBar
            onSearch={handleSearch}
            onVisualSearchClick={() => setIsVisualSearchOpen(true)}
            placeholder="Search for handcrafted treasures..."
          />
        </div>

        {/* Hero Banner */}
        <HeroBanner
          products={featuredProducts}
          onProductClick={handleProductClick}
        />

        {/* Curated Carousels */}
        <div className="carousels-section">
          <ProductCarousel
            title="✨ New Arrivals"
            products={newArrivals}
            onProductClick={handleProductClick}
          />

          <ProductCarousel
            title="🔥 Bestsellers"
            products={bestsellers}
            onProductClick={handleProductClick}
          />

          <ProductCarousel
            title="🎨 Shop by Craft"
            products={featuredProducts.slice(0, 10)}
            onProductClick={handleProductClick}
            showCraftFilter={true}
          />
        </div>

        {/* Infinite Scroll Grid */}
        <div className="products-grid-section">
          <h2 className="section-title">Discover Handcrafted Treasures</h2>
          <ProductGrid
            products={allProducts}
            onProductClick={handleProductClick}
            onLoadMore={loadMoreProducts}
            hasMore={hasMore}
            loading={loading}
          />
        </div>

        {/* Visual Search Modal */}
        <VisualSearchModal
          isOpen={isVisualSearchOpen}
          onClose={() => setIsVisualSearchOpen(false)}
          onImageSubmit={handleVisualSearch}
        />
      </div>
    </UserLayout>
  );
};

export default HomePage;
