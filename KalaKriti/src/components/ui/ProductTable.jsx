import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  Tag,
  Instagram,
} from "lucide-react";
import { imageService } from "../../services/imageService";
import { apiService } from "../../services/api";
import InstagramPreview from "./InstagramPreview";
import ConfirmationModal from "./ConfirmationModal";

const ProductTable = ({ products, language = "en", onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [instagramLoading, setInstagramLoading] = useState(null);
  const [showInstagramPreview, setShowInstagramPreview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const translations = {
    en: {
      image: "Image",
      productName: "Product Name",
      category: "Category",
      price: "Price",
      stock: "Stock",
      status: "Status",
      actions: "Actions",
      created: "Created",
      active: "Active",
      inactive: "Inactive",
      draft: "Draft",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      lowStock: "Low Stock",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      postToInstagram: "Post to Instagram",
      confirmDeleteTitle: "Confirm Deletion",
      confirmDeleteMessage:
        "Are you sure you want to delete this product? This action cannot be undone.",
      cancel: "Cancel",
      deleteButton: "Delete",
      postSuccess: "Photo posted successfully!",
      postFail: "Failed to post to Instagram. Please try again.",
    },
    pa: {
      image: "ਚਿੱਤਰ",
      productName: "ਉਤਪਾਦ ਨਾਮ",
      category: "ਸ਼੍ਰੇਣੀ",
      price: "ਕੀਮਤ",
      stock: "ਸਟਾਕ",
      status: "ਸਥਿਤੀ",
      actions: "ਕਾਰਵਾਈਆਂ",
      created: "ਬਣਾਇਆ",
      active: "ਸਰਗਰਮ",
      inactive: "ਅਸਰਗਰਮ",
      draft: "ਡਰਾਫਟ",
      inStock: "ਸਟਾਕ ਵਿੱਚ",
      outOfStock: "ਸਟਾਕ ਖਤਮ",
      lowStock: "ਘੱਟ ਸਟਾਕ",
      edit: "ਸੰਪਾਦਿਤ ਕਰੋ",
      delete: "ਮਿਟਾਓ",
      view: "ਦੇਖੋ",
      postToInstagram: "ਇੰਸਟਾਗ੍ਰਾਮ 'ਤੇ ਪੋਸਟ ਕਰੋ",
      confirmDeleteTitle: "ਮਿਟਾਉਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
      confirmDeleteMessage:
        "ਕੀ ਤੁਸੀਂ ਸੱਚਮੁੱਚ ਇਸ ਉਤਪਾਦ ਨੂੰ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਇਹ ਕਾਰਵਾਈ ਵਾਪਸ ਨਹੀਂ ਲਈ ਜਾ ਸਕਦੀ।",
      cancel: "ਰੱਦ ਕਰੋ",
      deleteButton: "ਮਿਟਾਓ",
      postSuccess: "ਤਸਵੀਰ ਸਫਲਤਾਪੂਰਵਕ ਪੋਸਟ ਕੀਤੀ ਗਈ!",
      postFail:
        "ਇੰਸਟਾਗ੍ਰਾਮ 'ਤੇ ਪੋਸਟ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    },
  };

  const t = translations[language];

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { text: t.outOfStock, color: "bg-red-100 text-red-800" };
    if (stock < 5)
      return { text: t.lowStock, color: "bg-yellow-100 text-yellow-800" };
    return { text: t.inStock, color: "bg-green-100 text-green-800" };
  };

  const getProductStatus = (status) => {
    switch (status) {
      case "active":
        return { text: t.active, color: "bg-green-100 text-green-800" };
      case "inactive":
        return { text: t.inactive, color: "bg-gray-100 text-gray-800" };
      case "draft":
        return { text: t.draft, color: "bg-yellow-100 text-yellow-800" };
      default:
        return { text: t.active, color: "bg-green-100 text-green-800" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const handleAction = (action, product) => {
    setShowDropdown(null);

    switch (action) {
      case "view":
        navigate(`/artisan/products/view/${product.id}`);
        break;
      case "edit":
        navigate(`/artisan/products/edit/${product.id}`);
        break;
      case "delete":
        setProductToDelete(product);
        setShowDeleteModal(true);
        break;
      case "instagram":
        setSelectedProduct(product);
        setShowInstagramPreview(true);
        break;
      default:
        console.log(`${action} product ${product.id}`);
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete && onDelete) {
      onDelete(productToDelete.id);
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInstagramPost = async (product, caption) => {
    try {
      setInstagramLoading(product.id);

      const imagePath = imageService.getImageUrl(product.images?.[0]);
      const result = await apiService.postToInstagram(imagePath, {
        ...product,
        caption: caption,
      });

      showNotification(`✅ ${result.message || t.postSuccess}`, "success");
      setShowInstagramPreview(false);
    } catch (error) {
      console.error("Instagram posting failed:", error);
      showNotification(`❌ ${error.message || t.postFail}`, "error");
    } finally {
      setInstagramLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                {t.image}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                {t.productName}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                {t.category}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                {t.price}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                {t.stock}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                {t.status}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                {t.created}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock || 0);
              const productStatus = getProductStatus(
                product.status || "active"
              );
              return (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? imageService.getImageUrl(product.images[0])
                          : imageService.getFallbackImage(product.category)
                      }
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = imageService.getFallbackImage(
                          product.category
                        );
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.title}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{product.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{product.stock || 0}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${productStatus.color}`}
                    >
                      {productStatus.text}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500">
                      {formatDate(product.created_at)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAction("view", product)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t.view}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleAction("edit", product)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title={t.edit}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleAction("instagram", product)}
                        disabled={instagramLoading === product.id}
                        className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors disabled:opacity-50"
                        title={
                          instagramLoading === product.id
                            ? "Posting..."
                            : t.postToInstagram
                        }
                      >
                        <Instagram size={16} />
                      </button>
                      <button
                        onClick={() => handleAction("delete", product)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t.delete}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div
              key={product.id}
              className="p-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? imageService.getImageUrl(product.images[0])
                      : imageService.getFallbackImage(product.category)
                  }
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = imageService.getFallbackImage(
                      product.category
                    );
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ₹{product.price?.toLocaleString()}
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowDropdown(
                            showDropdown === product.id ? null : product.id
                          )
                        }
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {showDropdown === product.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={() => handleAction("view", product)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Eye size={14} />
                            <span>{t.view}</span>
                          </button>
                          <button
                            onClick={() => handleAction("edit", product)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Edit3 size={14} />
                            <span>{t.edit}</span>
                          </button>
                          <button
                            onClick={() => handleAction("instagram", product)}
                            disabled={instagramLoading === product.id}
                            className="w-full text-left px-4 py-2 text-sm text-pink-600 hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50"
                          >
                            <Instagram size={14} />
                            <span>
                              {instagramLoading === product.id
                                ? "Posting..."
                                : t.postToInstagram}
                            </span>
                          </button>
                          <button
                            onClick={() => handleAction("delete", product)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Trash2 size={14} />
                            <span>{t.delete}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                    >
                      {stockStatus.text}
                    </span>
                    <span className="text-sm text-gray-600">
                      {t.stock}: {product.stock}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instagram Preview Modal */}
      {showInstagramPreview && selectedProduct && (
        <InstagramPreview
          product={selectedProduct}
          language={language}
          onPost={handleInstagramPost}
          onClose={() => {
            setShowInstagramPreview(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          title={t.confirmDeleteTitle}
          message={t.confirmDeleteMessage}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
          confirmText={t.deleteButton}
          cancelText={t.cancel}
        />
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProductTable;
