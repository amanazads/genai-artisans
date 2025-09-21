import React, { useState } from "react";
import { Edit3, Trash2, Eye, Tag, Package, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { imageService } from "../../services/imageService";
import { apiService } from "../../services/api";
import InstagramPreview from "./InstagramPreview";

const ProductCard = ({
  product,
  language = "en",
  onDelete,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isPostingToInstagram, setIsPostingToInstagram] = useState(false);
  const [showInstagramPreview, setShowInstagramPreview] = useState(false);

  const translations = {
    en: {
      edit: "Edit",
      delete: "Delete",
      view: "View",
      postToInstagram: "Post to Instagram",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      lowStock: "Low Stock",
      price: "Price",
      stock: "Stock",
      category: "Category",
      status: "Status",
      actions: "Actions",
    },
    pa: {
      edit: "ਸੰਪਾਦਿਤ ਕਰੋ",
      delete: "ਮਿਟਾਓ",
      view: "ਦੇਖੋ",
      postToInstagram: "ਇੰਸਟਾਗ੍ਰਾਮ 'ਤੇ ਪੋਸਟ ਕਰੋ",
      inStock: "ਸਟਾਕ ਵਿੱਚ",
      outOfStock: "ਸਟਾਕ ਖਤਮ",
      lowStock: "ਘੱਟ ਸਟਾਕ",
      price: "ਕੀਮਤ",
      stock: "ਸਟਾਕ",
      category: "ਸ਼੍ਰੇਣੀ",
      status: "ਸਥਿਤੀ",
      actions: "ਕਾਰਵਾਈਆਂ",
    },
  };

  const t = translations[language];

  const getStockStatus = (stock) => {
    if (stock === 0)
      return {
        text: t.outOfStock,
        color: "bg-red-100 text-red-800 border-red-200",
      };
    if (stock < 5)
      return {
        text: t.lowStock,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    return {
      text: t.inStock,
      color: "bg-green-100 text-green-800 border-green-200",
    };
  };

  const stockStatus = getStockStatus(product.stock);

  const handleEdit = () => {
    navigate(`/artisan/products/edit/${product.id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete && onDelete(product.id);
    }
  };

  const handleView = () => {
    navigate(`/artisan/products/view/${product.id}`);
  };

  const handleInstagramPost = async () => {
    // Show preview instead of posting directly
    setShowInstagramPreview(true);
  };

  const handleInstagramPostConfirm = async (product, caption) => {
    try {
      setIsPostingToInstagram(true);

      const imagePath = imageService.getImageUrl(
        product.image || product.images?.[0]
      );
      const result = await apiService.postToInstagram(imagePath, {
        ...product,
        caption: caption,
      });

      alert(`✅ ${result.message}`);
      setShowInstagramPreview(false);
    } catch (error) {
      console.error("Instagram posting failed:", error);
      alert("❌ Failed to post to Instagram. Please try again.");
    } finally {
      setIsPostingToInstagram(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={
            imageError
              ? imageService.getFallbackImage(product.category)
              : imageService.getImageUrl(product.image || product.images?.[0])
          }
          alt={product.title || product.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />

        {/* Stock Status Badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}
        >
          {stockStatus.text}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
          <button
            onClick={handleView}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-lg transition-colors"
            title={t.view}
          >
            <Eye size={18} />
          </button>
          <button
            onClick={handleEdit}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-lg transition-colors"
            title={t.edit}
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={handleInstagramPost}
            disabled={isPostingToInstagram}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-pink-600 p-2 rounded-lg transition-colors disabled:opacity-50"
            title={isPostingToInstagram ? "Posting..." : t.postToInstagram}
          >
            <Instagram size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 p-2 rounded-lg transition-colors"
            title={t.delete}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">{product.category}</p>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold text-purple-600">
            ₹{product.price}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Package size={14} />
            <span>{product.stock}</span>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  <Tag size={10} />
                  <span>{tag}</span>
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1"
          >
            <Edit3 size={14} />
            <span>{t.edit}</span>
          </button>
          <button
            onClick={handleView}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1"
          >
            <Eye size={14} />
            <span>{t.view}</span>
          </button>
        </div>
      </div>

      {/* Instagram Preview Modal */}
      {showInstagramPreview && (
        <InstagramPreview
          product={product}
          language={language}
          onPost={handleInstagramPostConfirm}
          onClose={() => setShowInstagramPreview(false)}
        />
      )}
    </div>
  );
};

export default ProductCard;
