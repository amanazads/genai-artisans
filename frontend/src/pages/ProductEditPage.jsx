import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Tag,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import { apiService } from "../services/api";
import { imageService } from "../services/imageService";

const ProductEditPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { language, changeLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [productData, setProductData] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    category: "",
    tags: [],
    stock: 1,
    images: [],
    status: "active",
  });

  const translations = {
    en: {
      pageTitle: "Edit Product",
      loading: "Loading product details...",
      productTitle: "Product Title",
      productDescription: "Product Description",
      price: "Price (₹)",
      category: "Category",
      tags: "Tags",
      stock: "Stock Quantity",
      status: "Status",
      images: "Product Images",
      addTag: "Add Tag",
      removeTag: "Remove",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      goBack: "Go Back",
      addImage: "Add Image",
      mainImage: "Main Image",
      deleteImage: "Delete Image",
      saving: "Saving...",
      productUpdated: "Product updated successfully!",
      categories: {
        textiles: "Textiles & Fabrics",
        pottery: "Pottery & Ceramics",
        jewelry: "Jewelry & Accessories",
        woodwork: "Woodwork",
        metalwork: "Metalwork",
        painting: "Paintings & Art",
        other: "Other Crafts",
      },
      statusOptions: {
        active: "Active",
        inactive: "Inactive",
        outOfStock: "Out of Stock",
        draft: "Draft",
      },
      suggestedTags: [
        "Handmade",
        "Traditional",
        "Authentic",
        "Vintage",
        "Artisan",
        "Cultural",
      ],
      titlePlaceholder: "Enter a descriptive title for your creation",
      descriptionPlaceholder:
        "Describe your creation, materials used, and what makes it special...",
      tagPlaceholder: "Enter tag name",
    },
    pa: {
      pageTitle: "ਉਤਪਾਦ ਸੰਪਾਦਿਤ ਕਰੋ",
      loading: "ਉਤਪਾਦ ਵੇਰਵੇ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...",
      productTitle: "ਉਤਪਾਦ ਸਿਰਲੇਖ",
      productDescription: "ਉਤਪਾਦ ਵਰਣਨ",
      price: "ਕੀਮਤ (₹)",
      category: "ਸ਼੍ਰੇਣੀ",
      tags: "ਟੈਗ",
      stock: "ਸਟਾਕ ਮਾਤਰਾ",
      status: "ਸਥਿਤੀ",
      images: "ਉਤਪਾਦ ਚਿੱਤਰ",
      addTag: "ਟੈਗ ਸ਼ਾਮਲ ਕਰੋ",
      removeTag: "ਹਟਾਓ",
      saveChanges: "ਤਬਦੀਲੀਆਂ ਸੇਵ ਕਰੋ",
      cancel: "ਰੱਦ ਕਰੋ",
      goBack: "ਵਾਪਸ ਜਾਓ",
      addImage: "ਚਿੱਤਰ ਸ਼ਾਮਲ ਕਰੋ",
      mainImage: "ਮੁੱਖ ਚਿੱਤਰ",
      deleteImage: "ਚਿੱਤਰ ਮਿਟਾਓ",
      saving: "ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ...",
      productUpdated: "ਉਤਪਾਦ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਹੋਇਆ!",
      categories: {
        textiles: "ਕੱਪੜੇ ਅਤੇ ਫੈਬਰਿਕ",
        pottery: "ਮਿੱਟੀ ਅਤੇ ਸਿਰਾਮਿਕ",
        jewelry: "ਗਹਿਣੇ ਅਤੇ ਐਕਸੈਸਰੀਜ਼",
        woodwork: "ਲੱਕੜ ਦਾ ਕੰਮ",
        metalwork: "ਧਾਤੂ ਦਾ ਕੰਮ",
        painting: "ਪੇਂਟਿੰਗ ਅਤੇ ਕਲਾ",
        other: "ਹੋਰ ਸ਼ਿਲਪਕਾਰੀ",
      },
      statusOptions: {
        active: "ਸਰਗਰਮ",
        inactive: "ਅਸਰਗਰਮ",
        outOfStock: "ਸਟਾਕ ਖਤਮ",
        draft: "ਡਰਾਫਟ",
      },
      suggestedTags: [
        "ਹੱਥ ਨਾਲ ਬਣਿਆ",
        "ਪਰੰਪਰਾਗਤ",
        "ਪ੍ਰਮਾਣਿਕ",
        "ਪੁਰਾਤਨ",
        "ਕਾਰੀਗਰ",
        "ਸਭਿਆਚਾਰਕ",
      ],
      titlePlaceholder: "ਆਪਣੀ ਰਚਨਾ ਲਈ ਇੱਕ ਵਰਣਨਾਤਮਕ ਸਿਰਲੇਖ ਦਰਜ ਕਰੋ",
      descriptionPlaceholder:
        "ਆਪਣੀ ਰਚਨਾ, ਵਰਤੀ ਗਈ ਸਮੱਗਰੀ, ਅਤੇ ਇਸ ਨੂੰ ਖਾਸ ਬਣਾਉਣ ਵਾਲੀ ਚੀਜ਼ ਦਾ ਵਰਣਨ ਕਰੋ...",
      tagPlaceholder: "ਟੈਗ ਨਾਮ ਦਰਜ ਕਰੋ",
    },
  };

  const t = translations[language];

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);

        // Load real product data from backend
        const result = await apiService.getProduct(productId);

        if (result && !result.error) {
          setProductData({
            id: result.id || productId,
            title: result.title || "",
            description: result.description || "",
            price: result.price?.toString() || "",
            category: result.category || "",
            tags: result.tags || [],
            stock: result.stock || 1,
            status: result.status || "active",
            images: result.images || [],
          });
        } else {
          console.error("Product not found:", result.error);
          // Fallback to mock data for development
          setProductData({
            id: productId,
            title: "Traditional Punjabi Phulkari Dupatta",
            description:
              "A beautiful handcrafted Phulkari dupatta featuring intricate embroidery work. Made with premium cotton fabric and adorned with vibrant silk threads in traditional patterns.",
            price: "2500",
            category: "textiles",
            tags: [
              "Handmade",
              "Traditional",
              "Phulkari",
              "Punjab",
              "Embroidery",
            ],
            stock: 8,
            status: "active",
            images: [
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop",
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
            ],
          });
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        // Use fallback data on error
        setProductData({
          id: productId,
          title: "",
          description: "",
          price: "",
          category: "",
          tags: [],
          stock: 1,
          status: "active",
          images: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagAdd = (tagName) => {
    if (tagName && !productData.tags.includes(tagName)) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagName],
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // For now, convert to data URL for display
        // In a real app, you would upload to server first
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          setProductData((prev) => ({
            ...prev,
            images: [...prev.images, dataUrl],
          }));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleImageDelete = (indexToRemove) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Prepare product data for API
      const productToUpdate = {
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price) || 0,
        category: productData.category,
        tags: productData.tags,
        stock: parseInt(productData.stock) || 0,
        status: productData.status,
        images: productData.images,
        artisan_id: "artisan_001", // This should come from user context
      };

      // Call the API to update the product
      const result = await apiService.updateProduct(productId, productToUpdate);

      if (result.message || result.success) {
        alert(t.productUpdated);
        navigate("/artisan/products");
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to update product. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const TagInput = () => {
    const [newTag, setNewTag] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (newTag.trim()) {
        handleTagAdd(newTag.trim());
        setNewTag("");
      }
    };

    return (
      <div className="space-y-3">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder={t.tagPlaceholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>{t.addTag}</span>
          </button>
        </form>

        {/* Suggested Tags */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Suggested:</p>
          <div className="flex flex-wrap gap-2">
            {t.suggestedTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagAdd(tag)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Current Tags */}
        {productData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {productData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                <Tag size={14} />
                <span>{tag}</span>
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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

  return (
    <DashboardLayout
      title={t.pageTitle}
      language={language}
      onLanguageChange={changeLanguage}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/artisan/products")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t.goBack}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.images}
              </h3>

              <div className="space-y-4">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {t.mainImage}
                      </div>
                    )}
                    <button
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Add Image Button */}
                <label className="block w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm font-medium">{t.addImage}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Product Details Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Edit3 size={20} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Details
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.productTitle}
                  </label>
                  <input
                    type="text"
                    value={productData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder={t.titlePlaceholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.productDescription}
                  </label>
                  <textarea
                    value={productData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder={t.descriptionPlaceholder}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.price}
                    </label>
                    <input
                      type="number"
                      value={productData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.stock}
                    </label>
                    <input
                      type="number"
                      value={productData.stock}
                      onChange={(e) =>
                        handleInputChange("stock", parseInt(e.target.value))
                      }
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.status}
                    </label>
                    <select
                      value={productData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    >
                      {Object.entries(t.statusOptions).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.category}
                  </label>
                  <select
                    value={productData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  >
                    {Object.entries(t.categories).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.tags}
                  </label>
                  <TagInput />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t.saving}</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>{t.saveChanges}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate("/artisan/products")}
                    className="flex-1 sm:flex-initial border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductEditPage;
