import React, { useState, useEffect } from "react";

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const [localFilters, setLocalFilters] = useState({
    category: "",
    priceRange: [0, 10000],
    artisan: "",
    tags: [],
    sortBy: "relevance",
    inStock: true,
    ...filters,
  });

  const categories = [
    "All Categories",
    "Pottery",
    "Textiles",
    "Jewelry",
    "Paintings",
    "Sculptures",
    "Handicrafts",
    "Woodwork",
    "Metalwork",
    "Leather Goods",
  ];

  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
  ];

  const popularTags = [
    "handmade",
    "traditional",
    "vintage",
    "eco-friendly",
    "premium",
    "gift-worthy",
    "decorative",
    "functional",
    "ethnic",
    "modern",
    "artistic",
    "cultural",
  ];

  useEffect(() => {
    setLocalFilters((prev) => ({ ...prev, ...filters }));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTagToggle = (tag) => {
    const currentTags = localFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    handleFilterChange("tags", newTags);
  };

  const handlePriceChange = (index, value) => {
    const newPriceRange = [...localFilters.priceRange];
    newPriceRange[index] = parseInt(value);
    handleFilterChange("priceRange", newPriceRange);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: "",
      priceRange: [0, 10000],
      artisan: "",
      tags: [],
      sortBy: "relevance",
      inStock: true,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="filter-overlay" onClick={onToggle}></div>}

      <div className={`filter-sidebar ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
            <button className="close-filters-btn" onClick={onToggle}>
              ✕
            </button>
          </div>
        </div>

        <div className="filter-content">
          {/* Sort By */}
          <div className="filter-section">
            <h4>Sort By</h4>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="filter-select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4>Category</h4>
            <div className="category-filters">
              {categories.map((category) => (
                <label key={category} className="filter-checkbox">
                  <input
                    type="radio"
                    name="category"
                    value={category === "All Categories" ? "" : category}
                    checked={
                      localFilters.category ===
                      (category === "All Categories" ? "" : category)
                    }
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  />
                  <span className="checkmark"></span>
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-range">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="price-input"
                />
              </div>
              <div className="price-range-slider">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  value={localFilters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="range-input"
                />
                <input
                  type="range"
                  min="0"
                  max="20000"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="range-input"
                />
              </div>
              <div className="price-display">
                {formatPrice(localFilters.priceRange[0])} -{" "}
                {formatPrice(localFilters.priceRange[1])}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="filter-section">
            <h4>Availability</h4>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.inStock}
                onChange={(e) =>
                  handleFilterChange("inStock", e.target.checked)
                }
              />
              <span className="checkmark"></span>
              In Stock Only
            </label>
          </div>

          {/* Tags */}
          <div className="filter-section">
            <h4>Tags</h4>
            <div className="tag-filters">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-filter ${
                    localFilters.tags?.includes(tag) ? "active" : ""
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Artisan Filter */}
          <div className="filter-section">
            <h4>Artisan</h4>
            <input
              type="text"
              placeholder="Search artisan name..."
              value={localFilters.artisan}
              onChange={(e) => handleFilterChange("artisan", e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Apply Filters Button (Mobile) */}
        <div className="filter-footer">
          <button className="apply-filters-btn" onClick={onToggle}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
