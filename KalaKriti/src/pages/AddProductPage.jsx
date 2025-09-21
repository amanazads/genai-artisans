import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import { apiService } from "../services/api";
import { imageService } from "../services/imageService";

const AddProductPage = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState(null);
  const [aiResult, setAiResult] = useState(null); // Store complete AI result
  const [posterPath, setPosterPath] = useState(null); // Store generated poster
  const [instagramStatus, setInstagramStatus] = useState(null); // Store Instagram status
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    tags: [],
  });
  const [artisanInfo, setArtisanInfo] = useState({
    name: "Rajesh Kumar", // Get from auth context in real app
    location: "Punjab, India", // Get from user profile
  });

  const translations = {
    en: {
      pageTitle: "Add New Creation",
      step1Title: "Upload Your Photo",
      step1Subtitle: "Show us your beautiful creation",
      step2Title: "AI Magic & Review",
      step2Subtitle: "Review and refine the details",
      takePhoto: "Take Photo",
      chooseFromGallery: "Choose from Gallery",
      dragDrop: "Drag and drop your image here",
      or: "or",
      processing: "Our AI is preparing your listing...",
      productTitle: "Product Title",
      description: "Description",
      price: "Price (₹)",
      category: "Category",
      tags: "Tags",
      addTag: "Add Tag",
      removeTag: "Remove",
      looksGood: "Looks Good, Post It!",
      backToProducts: "Back to Products",
      nextStep: "Next Step",
      previousStep: "Previous Step",
      selectCategory: "Select Category",
      textiles: "Textiles",
      pottery: "Pottery",
      jewelry: "Jewelry",
      woodwork: "Woodwork",
      painting: "Painting",
      other: "Other",
    },
    pa: {
      pageTitle: "ਨਵੀਂ ਰਚਨਾ ਸ਼ਾਮਲ ਕਰੋ",
      step1Title: "ਆਪਣੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ",
      step1Subtitle: "ਸਾਨੂੰ ਆਪਣੀ ਸੁੰਦਰ ਰਚਨਾ ਦਿਖਾਓ",
      step2Title: "AI ਜਾਦੂ ਅਤੇ ਸਮੀਖਿਆ",
      step2Subtitle: "ਵੇਰਵਿਆਂ ਦੀ ਸਮੀਖਿਆ ਅਤੇ ਸੁਧਾਰ ਕਰੋ",
      takePhoto: "ਫੋਟੋ ਲਓ",
      chooseFromGallery: "ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ",
      dragDrop: "ਆਪਣੀ ਫੋਟੋ ਇੱਥੇ ਖਿੱਚੋ ਅਤੇ ਛੱਡੋ",
      or: "ਜਾਂ",
      processing: "ਸਾਡੀ AI ਤੁਹਾਡੀ ਲਿਸਟਿੰਗ ਤਿਆਰ ਕਰ ਰਹੀ ਹੈ...",
      productTitle: "ਉਤਪਾਦ ਸਿਰਲੇਖ",
      description: "ਵਰਣਨ",
      price: "ਕੀਮਤ (₹)",
      category: "ਸ਼੍ਰੇਣੀ",
      tags: "ਟੈਗ",
      addTag: "ਟੈਗ ਸ਼ਾਮਲ ਕਰੋ",
      removeTag: "ਹਟਾਓ",
      looksGood: "ਵਧੀਆ ਲੱਗ ਰਿਹਾ, ਪੋਸਟ ਕਰੋ!",
      backToProducts: "ਉਤਪਾਦਾਂ ਵਿੱਚ ਵਾਪਸ",
      nextStep: "ਅਗਲਾ ਕਦਮ",
      previousStep: "ਪਿਛਲਾ ਕਦਮ",
      selectCategory: "ਸ਼੍ਰੇਣੀ ਚੁਣੋ",
      textiles: "ਕੱਪੜੇ",
      pottery: "ਮਿੱਟੀ ਦੇ ਬਰਤਨ",
      jewelry: "ਗਹਿਣੇ",
      woodwork: "ਲੱਕੜ ਦਾ ਕੰਮ",
      painting: "ਪੇਂਟਿੰਗ",
      other: "ਹੋਰ",
    },
  };

  const t = translations[language];

  const categories = [
    { value: "", label: t.selectCategory },
    { value: "textiles", label: t.textiles },
    { value: "pottery", label: t.pottery },
    { value: "jewelry", label: t.jewelry },
    { value: "woodwork", label: t.woodwork },
    { value: "painting", label: t.painting },
    { value: "other", label: t.other },
  ];

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setUploadedFile(file);
        processWithAI(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const processWithAI = async (file) => {
    setIsProcessing(true);
    setProcessingError(null);

    try {
      // Call the backend API with updated service method
      const result = await apiService.processAndPost(
        file,
        artisanInfo.name,
        artisanInfo.location
      );

      // Store complete AI result
      setAiResult(result);

      // Store poster path if available
      if (result.poster_path) {
        setPosterPath(result.poster_path);
      }

      // Store Instagram status
      if (result.insta_post) {
        setInstagramStatus(result.insta_post);
      }

      // Update product data with AI-generated listing
      if (result.refined_listing) {
        // Try to determine category from tags
        const tags = result.refined_listing.tags || [];
        const category = determineCategory(tags);

        setProductData({
          title: result.refined_listing.title || "",
          description: result.refined_listing.long_description || "",
          price: result.refined_listing.suggested_price?.toString() || "",
          category: category,
          tags: tags,
        });
      }

      setIsProcessing(false);
      setCurrentStep(2);
    } catch (error) {
      console.error("Error processing image:", error);
      setProcessingError(
        error.response?.data?.error ||
          error.message ||
          "Failed to process image. Please try again."
      );
      setIsProcessing(false);

      // Fallback to mock data for demo purposes
      setProductData({
        title: "Traditional Punjabi Phulkari Dupatta",
        description:
          "A beautiful hand-embroidered Phulkari dupatta featuring intricate floral patterns in vibrant colors. This traditional Punjabi textile showcases the rich heritage of Punjab's textile artistry. Made with premium cotton fabric and silk threads, this dupatta is perfect for special occasions and cultural celebrations.",
        price: "2500",
        category: "textiles",
        tags: [
          "traditional",
          "phulkari",
          "punjabi",
          "handmade",
          "embroidered",
          "dupatta",
        ],
      });
      setCurrentStep(2);
    }
  };

  // Helper function to determine category from tags
  const determineCategory = (tags) => {
    const tagStr = tags.join(" ").toLowerCase();
    if (
      tagStr.includes("textile") ||
      tagStr.includes("fabric") ||
      tagStr.includes("cloth") ||
      tagStr.includes("phulkari") ||
      tagStr.includes("dupatta")
    ) {
      return "textiles";
    } else if (
      tagStr.includes("pottery") ||
      tagStr.includes("clay") ||
      tagStr.includes("ceramic")
    ) {
      return "pottery";
    } else if (
      tagStr.includes("jewelry") ||
      tagStr.includes("jewellery") ||
      tagStr.includes("ornament") ||
      tagStr.includes("necklace") ||
      tagStr.includes("earring")
    ) {
      return "jewelry";
    } else if (
      tagStr.includes("wood") ||
      tagStr.includes("carv") ||
      tagStr.includes("timber")
    ) {
      return "woodwork";
    } else if (
      tagStr.includes("paint") ||
      tagStr.includes("art") ||
      tagStr.includes("canvas")
    ) {
      return "painting";
    }
    return "other";
  };

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = (tag) => {
    if (tag && !productData.tags.includes(tag)) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    try {
      // Process images for storage
      let imagesToSave = [];
      if (uploadedImage) {
        // In a real app, you would upload the image to a cloud service or backend
        // For now, we'll use the data URL or poster path if available
        if (posterPath) {
          imagesToSave.push(posterPath); // Use the AI-generated poster
        } else {
          imagesToSave.push(uploadedImage); // Use the original uploaded image
        }
      }

      // Prepare product data for backend
      const productToSave = {
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price) || 0,
        category: productData.category,
        tags: productData.tags,
        artisan_id: "artisan_001", // Get from auth context in real app
        stock: 10, // Default stock
        status: "active",
        images: imagesToSave,
      };

      const result = await apiService.createProduct(productToSave);

      if (result.message || result.product_id) {
        console.log("Product created successfully:", result);

        // Show success message with Instagram status if available
        let successMessage = "Product created successfully!";
        if (instagramStatus) {
          successMessage += ` Instagram: ${instagramStatus.status}`;
        }
        alert(successMessage);

        navigate("/artisan/products");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to create product. Please try again.";
      alert(errorMessage);

      // For development - still navigate to show the flow
      console.log("Product data that failed to save:", productData);
      if (
        window.confirm(
          "Save failed. Continue to products page anyway? (Dev mode)"
        )
      ) {
        navigate("/artisan/products");
      }
    }
  };

  return (
    <DashboardLayout
      title={t.pageTitle}
      language={language}
      onLanguageChange={changeLanguage}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-8">
          <div
            className={`flex items-center space-x-2 ${
              currentStep >= 1 ? "text-purple-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="font-medium">Upload</span>
          </div>

          <div
            className={`flex-1 h-1 rounded ${
              currentStep >= 2 ? "bg-purple-600" : "bg-gray-200"
            }`}
          />

          <div
            className={`flex items-center space-x-2 ${
              currentStep >= 2 ? "text-purple-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="font-medium">Review</span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t.step1Title}
              </h2>
              <p className="text-gray-600">{t.step1Subtitle}</p>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("file-input").click()}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} className="text-purple-600" />
              </div>

              <p className="text-lg font-medium text-gray-900 mb-2">
                {t.dragDrop}
              </p>

              <p className="text-gray-500 mb-6">{t.or}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2">
                  <Camera size={20} />
                  <span>{t.takePhoto}</span>
                </button>

                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2">
                  <ImageIcon size={20} />
                  <span>{t.chooseFromGallery}</span>
                </button>
              </div>

              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles size={32} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t.processing}
            </h3>
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {/* Error State */}
        {processingError && !isProcessing && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Processing Failed
              </h3>
              <p className="text-red-600 mb-4">{processingError}</p>
              <button
                onClick={() => {
                  setProcessingError(null);
                  setCurrentStep(1);
                  setUploadedImage(null);
                  setUploadedFile(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {currentStep === 2 && !isProcessing && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t.step2Title}
              </h2>
              <p className="text-gray-600">{t.step2Subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Preview
                </h3>
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  {uploadedImage && (
                    <img
                      src={uploadedImage}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.productTitle}
                  </label>
                  <input
                    type="text"
                    value={productData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.description}
                  </label>
                  <textarea
                    value={productData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      {t.category}
                    </label>
                    <select
                      value={productData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.tags}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {productData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-purple-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder={t.addTag}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addTag(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/artisan/products")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t.backToProducts}</span>
          </button>

          {currentStep === 2 && !isProcessing && (
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Check size={20} />
              <span>{t.looksGood}</span>
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProductPage;
