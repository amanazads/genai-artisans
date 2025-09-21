import React, { useState } from "react";
import { Filter, X, Search, SlidersHorizontal } from "lucide-react";

const ProductFilter = ({
  onFilterChange,
  language = "en",
  categories = [],
  priceRange = { min: 0, max: 10000 },
  stockFilter = "all",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    stock: stockFilter,
    sortBy: "newest",
  });

  const translations = {
    en: {
      filters: "Filters",
      category: "Category",
      priceRange: "Price Range",
      stockStatus: "Stock Status",
      sortBy: "Sort By",
      allCategories: "All Categories",
      allStock: "All Items",
      inStock: "In Stock Only",
      outOfStock: "Out of Stock",
      lowStock: "Low Stock",
      newest: "Newest First",
      oldest: "Oldest First",
      priceLowHigh: "Price: Low to High",
      priceHighLow: "Price: High to Low",
      nameAZ: "Name: A to Z",
      nameZA: "Name: Z to A",
      applyFilters: "Apply Filters",
      clearFilters: "Clear All",
      from: "From",
      to: "To",
      close: "Close",
    },
    pa: {
      filters: "ਫਿਲਟਰ",
      category: "ਸ਼੍ਰੇਣੀ",
      priceRange: "ਕੀਮਤ ਰੇਂਜ",
      stockStatus: "ਸਟਾਕ ਸਥਿਤੀ",
      sortBy: "ਇਸ ਦੁਆਰਾ ਤਰਤੀਬ ਦਿਓ",
      allCategories: "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ",
      allStock: "ਸਾਰੇ ਆਈਟਮ",
      inStock: "ਸਿਰਫ਼ ਸਟਾਕ ਵਿੱਚ",
      outOfStock: "ਸਟਾਕ ਖਤਮ",
      lowStock: "ਘੱਟ ਸਟਾਕ",
      newest: "ਪਹਿਲਾਂ ਨਵੇਂ",
      oldest: "ਪਹਿਲਾਂ ਪੁਰਾਣੇ",
      priceLowHigh: "ਕੀਮਤ: ਘੱਟ ਤੋਂ ਵੱਧ",
      priceHighLow: "ਕੀਮਤ: ਵੱਧ ਤੋਂ ਘੱਟ",
      nameAZ: "ਨਾਮ: A ਤੋਂ Z",
      nameZA: "ਨਾਮ: Z ਤੋਂ A",
      applyFilters: "ਫਿਲਟਰ ਲਾਗੂ ਕਰੋ",
      clearFilters: "ਸਾਰੇ ਸਾਫ਼ ਕਰੋ",
      from: "ਤੋਂ",
      to: "ਤੱਕ",
      close: "ਬੰਦ ਕਰੋ",
    },
  };

  const t = translations[language];

  const categoryOptions = [
    { value: "all", label: t.allCategories },
    {
      value: "textiles",
      label: language === "en" ? "Textiles & Fabrics" : "ਕੱਪੜੇ ਅਤੇ ਫੈਬਰਿਕ",
    },
    {
      value: "pottery",
      label: language === "en" ? "Pottery & Ceramics" : "ਮਿੱਟੀ ਅਤੇ ਸਿਰਾਮਿਕ",
    },
    {
      value: "jewelry",
      label:
        language === "en" ? "Jewelry & Accessories" : "ਗਹਿਣੇ ਅਤੇ ਐਕਸੈਸਰੀਜ਼",
    },
    {
      value: "woodwork",
      label: language === "en" ? "Woodwork" : "ਲੱਕੜ ਦਾ ਕੰਮ",
    },
    {
      value: "metalwork",
      label: language === "en" ? "Metalwork" : "ਧਾਤੂ ਦਾ ਕੰਮ",
    },
    {
      value: "painting",
      label: language === "en" ? "Paintings & Art" : "ਪੇਂਟਿੰਗ ਅਤੇ ਕਲਾ",
    },
    {
      value: "other",
      label: language === "en" ? "Other Crafts" : "ਹੋਰ ਸ਼ਿਲਪਕਾਰੀ",
    },
  ];

  const stockOptions = [
    { value: "all", label: t.allStock },
    { value: "inStock", label: t.inStock },
    { value: "lowStock", label: t.lowStock },
    { value: "outOfStock", label: t.outOfStock },
  ];

  const sortOptions = [
    { value: "newest", label: t.newest },
    { value: "oldest", label: t.oldest },
    { value: "priceLowHigh", label: t.priceLowHigh },
    { value: "priceHighLow", label: t.priceHighLow },
    { value: "nameAZ", label: t.nameAZ },
    { value: "nameZA", label: t.nameZA },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange && onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      category: "all",
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      stock: "all",
      sortBy: "newest",
    };
    setFilters(defaultFilters);
    onFilterChange && onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.stock !== "all" ||
    filters.priceMin !== priceRange.min ||
    filters.priceMax !== priceRange.max;

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
          hasActiveFilters
            ? "border-purple-500 bg-purple-50 text-purple-700"
            : "border-gray-300 hover:bg-gray-50 text-gray-700"
        }`}
      >
        <SlidersHorizontal size={18} />
        <span>{t.filters}</span>
        {hasActiveFilters && (
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Content */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 lg:relative lg:top-0 lg:right-auto lg:mt-0 lg:shadow-none lg:border-none">
            <div className="p-6 lg:p-0 lg:bg-transparent">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.filters}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.category}
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.priceRange}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t.from}
                      </label>
                      <input
                        type="number"
                        value={filters.priceMin}
                        onChange={(e) =>
                          handleFilterChange(
                            "priceMin",
                            parseInt(e.target.value) || 0
                          )
                        }
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t.to}
                      </label>
                      <input
                        type="number"
                        value={filters.priceMax}
                        onChange={(e) =>
                          handleFilterChange(
                            "priceMax",
                            parseInt(e.target.value) || 0
                          )
                        }
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.stockStatus}
                  </label>
                  <select
                    value={filters.stock}
                    onChange={(e) =>
                      handleFilterChange("stock", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  >
                    {stockOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.sortBy}
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {t.applyFilters}
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {t.clearFilters}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductFilter;
