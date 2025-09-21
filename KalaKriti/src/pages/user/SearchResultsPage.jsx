import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import UserLayout from "../../components/user/layout/UserLayout";
import SearchBar from "../../components/user/ui/SearchBar";
import FilterSidebar from "../../components/user/ui/FilterSidebar";
import ProductGrid from "../../components/user/ui/ProductGrid";
import ExtractedTags from "../../components/user/ui/ExtractedTags";
import VisualSearchModal from "../../components/user/ui/VisualSearchModal";
import { userAPI } from "../../services/user/userAPI";
import "./SearchResultsPage.css";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [extractedTags, setExtractedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isVisualSearch, setIsVisualSearch] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  useEffect(() => {
    initializeSearch();
  }, [location, searchParams]);

  const initializeSearch = async () => {
    const query = searchParams.get("q");
    const visualSearchData = location.state;

    if (visualSearchData?.visualSearch && visualSearchData?.imageFile) {
      // Handle visual search
      setIsVisualSearch(true);
      setSearchImage(visualSearchData.imageFile);
      await performVisualSearch(visualSearchData.imageFile);
    } else if (query) {
      // Handle text search
      setIsVisualSearch(false);
      setSearchQuery(query);
      await performTextSearch(query);
    } else {
      // No search parameters, redirect to home
      navigate("/");
    }
  };

  const performTextSearch = async (query, newFilters = {}, pageNum = 1) => {
    try {
      setLoading(true);
      const response = await userAPI.searchProducts(query, {
        ...filters,
        ...newFilters,
        page: pageNum,
        limit: 20,
      });

      if (pageNum === 1) {
        setProducts(response.data || []);
      } else {
        setProducts((prev) => [...prev, ...(response.data || [])]);
      }

      setTotalResults(response.total || 0);
      setHasMore(response.hasMore || false);
      setPage(pageNum);
    } catch (error) {
      console.error("Error performing text search:", error);
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const performVisualSearch = async (imageFile, tagsToExclude = []) => {
    try {
      setLoading(true);
      const response = await userAPI.visualSearch(imageFile, {
        excludeTags: tagsToExclude,
        ...filters,
        page: 1,
        limit: 20,
      });

      setProducts(response.data || []);
      setExtractedTags(response.extractedTags || []);
      setTotalResults(response.total || 0);
      setHasMore(response.hasMore || false);
      setPage(1);
    } catch (error) {
      console.error("Error performing visual search:", error);
      setProducts([]);
      setExtractedTags([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsVisualSearch(false);
    setSearchImage(null);
    setExtractedTags([]);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleVisualSearch = (imageFile) => {
    setIsVisualSearch(true);
    setSearchImage(imageFile);
    setSearchQuery("");
    performVisualSearch(imageFile);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (isVisualSearch && searchImage) {
      performVisualSearch(searchImage);
    } else if (searchQuery) {
      performTextSearch(searchQuery, newFilters);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    const updatedTags = extractedTags.filter((tag) => tag !== tagToRemove);
    setExtractedTags(updatedTags);

    if (searchImage) {
      const tagsToExclude = extractedTags.filter((tag) => tag === tagToRemove);
      performVisualSearch(searchImage, tagsToExclude);
    }
  };

  const loadMoreProducts = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    if (isVisualSearch && searchImage) {
      // For visual search, we need to implement pagination differently
      // as we can't easily paginate AI results
      return;
    } else if (searchQuery) {
      performTextSearch(searchQuery, filters, nextPage);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getSearchDisplayText = () => {
    if (isVisualSearch) {
      return "Showing results for your image";
    }
    return `Showing results for "${searchQuery}"`;
  };

  return (
    <UserLayout>
      <div className="search-results-page">
        {/* Search Bar */}
        <div className="search-section">
          <SearchBar
            initialValue={searchQuery}
            onSearch={handleSearch}
            onVisualSearchClick={() => setIsVisualSearchOpen(true)}
            placeholder="Refine your search..."
          />

          <div className="search-info">
            <span className="search-display">{getSearchDisplayText()}</span>
            <span className="results-count">
              ({totalResults} results found)
            </span>
          </div>
        </div>

        {/* Extracted Tags (for visual search) */}
        {isVisualSearch && extractedTags.length > 0 && (
          <div className="tags-section">
            <ExtractedTags tags={extractedTags} onTagRemove={handleTagRemove} />
          </div>
        )}

        <div className="search-content">
          {/* Filter Sidebar */}
          <FilterSidebar
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />

          {/* Results Grid */}
          <div className="results-section">
            {loading && page === 1 ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Finding the perfect crafts for you...</p>
              </div>
            ) : products.length > 0 ? (
              <ProductGrid
                products={products}
                onProductClick={handleProductClick}
                onLoadMore={loadMoreProducts}
                hasMore={hasMore && !isVisualSearch}
                loading={loading}
                showLoadMore={!isVisualSearch}
              />
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your search terms or filters</p>
                <button
                  className="search-suggestions-btn"
                  onClick={() => navigate("/")}
                >
                  Explore Featured Products
                </button>
              </div>
            )}
          </div>
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

export default SearchResultsPage;
