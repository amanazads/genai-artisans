import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Grid3X3, List, LayoutGrid } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductTable from "../components/ui/ProductTable";
import ProductGrid from "../components/ui/ProductGrid";
import ProductFilter from "../components/ui/ProductFilter";
import { useLanguage } from "../context/LanguageContext";
import { apiService } from "../services/api";

const MyProductsPage = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    priceMin: 0,
    priceMax: 10000,
    stock: "all",
    sortBy: "newest",
  });

  // Load products from backend
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getProducts("artisan_001"); // Get current artisan's products
      setProducts(result.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setError("Failed to load products. Using sample data.");

      // Fallback to sample data
      setProducts([
        {
          id: "1",
          title: "Traditional Punjabi Phulkari Dupatta",
          category: "textiles",
          price: 2500,
          stock: 8,
          images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop&crop=center",
          ],
          tags: ["Handmade", "Traditional", "Phulkari"],
          status: "active",
        },
        {
          id: "2",
          title: "Handcrafted Clay Water Pot",
          category: "pottery",
          price: 850,
          stock: 0,
          images: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center",
          ],
          tags: ["Clay", "Handmade", "Traditional"],
          status: "active",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      pageTitle: "My Products",
      addNewCreation: "+ Add New Creation",
      searchPlaceholder: "Search products...",
      filter: "Filter",
      totalProducts: "Total Products",
      viewMode: "View Mode",
      tableView: "Table View",
      gridView: "Grid View",
      allCategories: "All Categories",
      textiles: "Textiles",
      pottery: "Pottery",
      jewelry: "Jewelry",
      woodwork: "Woodwork",
    },
    pa: {
      pageTitle: "ਮੇਰੇ ਉਤਪਾਦ",
      addNewCreation: "+ ਨਵੀਂ ਰਚਨਾ ਸ਼ਾਮਲ ਕਰੋ",
      searchPlaceholder: "ਉਤਪਾਦ ਖੋਜੋ...",
      filter: "ਫਿਲਟਰ",
      totalProducts: "ਕੁੱਲ ਉਤਪਾਦ",
      viewMode: "ਦਰਸ਼ਨ ਮੋਡ",
      tableView: "ਟੇਬਲ ਦਰਸ਼ਨ",
      gridView: "ਗਰਿਡ ਦਰਸ਼ਨ",
      allCategories: "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ",
      textiles: "ਕੱਪੜੇ",
      pottery: "ਮਿੱਟੀ ਦੇ ਬਰਤਨ",
      jewelry: "ਗਹਿਣੇ",
      woodwork: "ਲੱਕੜ ਦਾ ਕੰਮ",
    },
  };

  const t = translations[language];

  const handleProductDelete = async (productId) => {
    try {
      await apiService.deleteProduct(productId);
      // Reload products after deletion
      loadProducts();
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to products
  };

  const categories = [
    t.allCategories,
    t.textiles,
    t.pottery,
    t.jewelry,
    t.woodwork,
  ];

  return (
    <DashboardLayout
      title={t.pageTitle}
      language={language}
      onLanguageChange={changeLanguage}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.pageTitle}</h1>
            <p className="text-gray-600 mt-1">
              {t.totalProducts}: {products.length}
            </p>
          </div>

          <button
            onClick={() => navigate("/artisan/add-product")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 w-fit"
          >
            <Plus size={20} />
            <span>{t.addNewCreation}</span>
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title={t.tableView}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title={t.gridView}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          {/* Filter Component */}
          <ProductFilter
            onFilterChange={handleFilterChange}
            language={language}
            priceRange={{ min: 0, max: 10000 }}
            stockFilter="all"
          />
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {language === "en"
                ? "Loading products..."
                : "ਉਤਪਾਦ ਲੋਡ ਹੋ ਰਹੇ ਹਨ..."}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === "en"
                ? "Error loading products"
                : "ਉਤਪਾਦ ਲੋਡ ਕਰਨ ਵਿੱਚ ਗਲਤੀ"}
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadProducts}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {language === "en" ? "Try Again" : "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ"}
            </button>
          </div>
        ) : viewMode === "table" ? (
          <ProductTable
            products={products}
            language={language}
            onDelete={handleProductDelete}
          />
        ) : (
          <ProductGrid
            products={products}
            language={language}
            onDelete={handleProductDelete}
          />
        )}

        {/* Empty State (when no products) */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === "en" ? "No products yet" : "ਅਜੇ ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "Start by adding your first creation to showcase your craft to the world."
                : "ਆਪਣੀ ਕਲਾ ਨੂੰ ਸੰਸਾਰ ਨੂੰ ਦਿਖਾਉਣ ਲਈ ਆਪਣੀ ਪਹਿਲੀ ਰਚਨਾ ਸ਼ਾਮਲ ਕਰਨ ਨਾਲ ਸ਼ੁਰੂਆਤ ਕਰੋ।"}
            </p>
            <button
              onClick={() => navigate("/artisan/add-product")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus size={20} />
              <span>{t.addNewCreation}</span>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProductsPage;
