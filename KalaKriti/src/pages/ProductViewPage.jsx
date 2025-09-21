import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Tag,
  Package,
  IndianRupee,
  Calendar,
  Eye,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";

const ProductViewPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { language, changeLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);

  const translations = {
    en: {
      pageTitle: "Product Details",
      loading: "Loading product...",
      edit: "Edit Product",
      delete: "Delete Product",
      goBack: "Go Back",
      price: "Price",
      stock: "Stock Available",
      category: "Category",
      tags: "Tags",
      description: "Description",
      createdOn: "Created On",
      lastUpdated: "Last Updated",
      views: "Views",
      likes: "Likes",
      status: "Status",
      images: "Product Images",
      mainImage: "Main Image",
      additionalImages: "Additional Images",
      noDescription: "No description available",
      noTags: "No tags added",
      confirmDelete:
        "Are you sure you want to delete this product? This action cannot be undone.",
      productDeleted: "Product deleted successfully",
      statusOptions: {
        active: "Active",
        inactive: "Inactive",
        outOfStock: "Out of Stock",
        draft: "Draft",
      },
      stockStatus: {
        inStock: "In Stock",
        lowStock: "Low Stock",
        outOfStock: "Out of Stock",
      },
    },
    pa: {
      pageTitle: "ਉਤਪਾਦ ਵੇਰਵੇ",
      loading: "ਉਤਪਾਦ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      edit: "ਉਤਪਾਦ ਸੰਪਾਦਿਤ ਕਰੋ",
      delete: "ਉਤਪਾਦ ਮਿਟਾਓ",
      goBack: "ਵਾਪਸ ਜਾਓ",
      price: "ਕੀਮਤ",
      stock: "ਸਟਾਕ ਉਪਲਬਧ",
      category: "ਸ਼੍ਰੇਣੀ",
      tags: "ਟੈਗ",
      description: "ਵਰਣਨ",
      createdOn: "ਬਣਾਇਆ ਗਿਆ",
      lastUpdated: "ਆਖਰੀ ਅਪਡੇਟ",
      views: "ਦਰਸ਼ਨ",
      likes: "ਪਸੰਦ",
      status: "ਸਥਿਤੀ",
      images: "ਉਤਪਾਦ ਚਿੱਤਰ",
      mainImage: "ਮੁੱਖ ਚਿੱਤਰ",
      additionalImages: "ਵਾਧੂ ਚਿੱਤਰ",
      noDescription: "ਕੋਈ ਵਰਣਨ ਉਪਲਬਧ ਨਹੀਂ",
      noTags: "ਕੋਈ ਟੈਗ ਸ਼ਾਮਲ ਨਹੀਂ",
      confirmDelete:
        "ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਤੌਰ ਤੇ ਇਸ ਉਤਪਾਦ ਨੂੰ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਇਹ ਕਿਰਿਆ ਵਾਪਸ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।",
      productDeleted: "ਉਤਪਾਦ ਸਫਲਤਾਪੂਰਵਕ ਮਿਟਾਇਆ ਗਿਆ",
      statusOptions: {
        active: "ਸਰਗਰਮ",
        inactive: "ਅਸਰਗਰਮ",
        outOfStock: "ਸਟਾਕ ਖਤਮ",
        draft: "ਡਰਾਫਟ",
      },
      stockStatus: {
        inStock: "ਸਟਾਕ ਵਿੱਚ",
        lowStock: "ਘੱਟ ਸਟਾਕ",
        outOfStock: "ਸਟਾਕ ਖਤਮ",
      },
    },
  };

  const t = translations[language];

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Mock product data
        setProduct({
          id: productId,
          name: "Traditional Punjabi Phulkari Dupatta",
          description:
            "A beautiful handcrafted Phulkari dupatta featuring intricate embroidery work. Made with premium cotton fabric and adorned with vibrant silk threads in traditional patterns. This piece represents the rich cultural heritage of Punjab and is perfect for special occasions and festivals. Each thread is carefully placed by skilled artisans who have been practicing this art for generations.",
          price: "2500",
          category: "Textiles & Fabrics",
          tags: [
            "Handmade",
            "Traditional",
            "Phulkari",
            "Punjab",
            "Embroidery",
            "Cultural",
            "Festive",
          ],
          stock: 8,
          status: "active",
          images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=500&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
          ],
          createdOn: "2024-01-15",
          lastUpdated: "2024-01-20",
          views: 245,
          likes: 18,
        });
        setIsLoading(false);
      }, 1000);
    };

    loadProduct();
  }, [productId]);

  const getStockStatus = (stock) => {
    if (stock === 0)
      return {
        text: t.stockStatus.outOfStock,
        color: "text-red-600 bg-red-50",
      };
    if (stock < 5)
      return {
        text: t.stockStatus.lowStock,
        color: "text-yellow-600 bg-yellow-50",
      };
    return { text: t.stockStatus.inStock, color: "text-green-600 bg-green-50" };
  };

  const handleEdit = () => {
    navigate(`/artisan/products/edit/${productId}`);
  };

  const handleDelete = () => {
    if (window.confirm(t.confirmDelete)) {
      // Simulate delete API call
      setTimeout(() => {
        alert(t.productDeleted);
        navigate("/artisan/products");
      }, 1000);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout
        title={t.pageTitle}
        language={language}
        onLanguageChange={changeLanguage}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t.loading}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout
        title={t.pageTitle}
        language={language}
        onLanguageChange={changeLanguage}
      >
        <div className="text-center py-12">
          <p className="text-gray-600">Product not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <DashboardLayout
      title={t.pageTitle}
      language={language}
      onLanguageChange={changeLanguage}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/artisan/products")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t.goBack}</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Edit3 size={18} />
              <span>{t.edit}</span>
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Trash2 size={18} />
              <span>{t.delete}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? "border-purple-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Status */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}
                >
                  {stockStatus.text}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {t.statusOptions[product.status]}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <IndianRupee size={24} className="text-gray-600" />
              <span className="text-3xl font-bold text-purple-600">
                ₹{product.price}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                  <Package size={16} />
                  <span className="text-sm">{t.stock}</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {product.stock}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                  <Eye size={16} />
                  <span className="text-sm">{t.views}</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {product.views}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                  <Heart size={16} />
                  <span className="text-sm">{t.likes}</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {product.likes}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {t.category}
              </h3>
              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {t.tags}
              </h3>
              {product.tags && product.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">{t.noTags}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {t.description}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {product.description ? (
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">{t.noDescription}</p>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {t.createdOn}:{" "}
                    {new Date(product.createdOn).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {t.lastUpdated}:{" "}
                    {new Date(product.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductViewPage;
