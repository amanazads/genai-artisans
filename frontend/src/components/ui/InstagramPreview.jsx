import React, { useState, useEffect } from "react";
import {
  Instagram,
  Eye,
  Download,
  Share2,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from "lucide-react";
import { imageService } from "../../services/imageService";
import { apiService } from "../../services/api";

const InstagramPreview = ({ product, language = "en", onPost, onClose }) => {
  const [caption, setCaption] = useState("");
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const translations = {
    en: {
      title: "Instagram Preview",
      subtitle: "Preview how your post will look on Instagram",
      generateCaption: "Generate Caption",
      regenerateCaption: "Regenerate Caption",
      postToInstagram: "Post to Instagram",
      close: "Close",
      caption: "Caption",
      likes: "likes",
      viewComments: "View all comments",
      addComment: "Add a comment...",
      sponsored: "Sponsored",
      artisanPost: "Artisan Post",
      captionGenerated: "Caption generated successfully!",
      posting: "Posting to Instagram...",
      posted: "Posted successfully!",
      error: "Failed to generate caption",
    },
    pa: {
      title: "ਇੰਸਟਾਗ੍ਰਾਮ ਪ੍ਰੀਵਿਊ",
      subtitle: "ਦੇਖੋ ਕਿ ਤੁਹਾਡੀ ਪੋਸਟ ਇੰਸਟਾਗ੍ਰਾਮ 'ਤੇ ਕਿਵੇਂ ਦਿਖਾਈ ਦੇਵੇਗੀ",
      generateCaption: "ਕੈਪਸ਼ਨ ਬਣਾਓ",
      regenerateCaption: "ਕੈਪਸ਼ਨ ਮੁੜ ਬਣਾਓ",
      postToInstagram: "ਇੰਸਟਾਗ੍ਰਾਮ 'ਤੇ ਪੋਸਟ ਕਰੋ",
      close: "ਬੰਦ ਕਰੋ",
      caption: "ਕੈਪਸ਼ਨ",
      likes: "ਪਸੰਦਾਂ",
      viewComments: "ਸਾਰੀਆਂ ਟਿੱਪਣੀਆਂ ਦੇਖੋ",
      addComment: "ਟਿੱਪਣੀ ਜੋੜੋ...",
      sponsored: "ਸਪਾਂਸਰਡ",
      artisanPost: "ਕਾਰੀਗਰ ਪੋਸਟ",
      captionGenerated: "ਕੈਪਸ਼ਨ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ!",
      posting: "ਇੰਸਟਾਗ੍ਰਾਮ 'ਤੇ ਪੋਸਟ ਕਰ ਰਹੇ ਹਾਂ...",
      posted: "ਸਫਲਤਾਪੂਰਵਕ ਪੋਸਟ ਕੀਤਾ ਗਿਆ!",
      error: "ਕੈਪਸ਼ਨ ਬਣਾਉਣ ਵਿੱਚ ਅਸਫਲ",
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (product) {
      // Set the preview image
      const imagePath = product.images?.[0] || product.image;
      setPreviewImage(
        imageService.getImageUrl(imagePath) ||
          imageService.getFallbackImage(product.category)
      );

      // Generate initial caption
      generateCaption();
    }
  }, [product]);

  const generateCaption = async () => {
    try {
      setIsGeneratingCaption(true);

      // Generate Instagram-style caption based on product data
      const tags = product.tags?.slice(0, 8) || [];
      const hashtags = tags
        .map((tag) => `#${tag.replace(/\s+/g, "")}`)
        .join(" ");

      const generatedCaption = `✨ ${product.title} ✨

${product.description}

💰 Price: ₹${product.price}
🎨 Category: ${product.category}
🏺 Handcrafted with love and tradition

Each piece tells a story of heritage, skill, and passion. When you choose handmade, you're not just buying a product – you're supporting an artisan's dream and preserving ancient crafts for future generations.

${hashtags} #handmade #artisan #traditional #india #crafts #kalakriti #supportlocal #heritage #handcrafted #unique

✨ Order now and be part of our craft story! ✨`;

      setCaption(generatedCaption);
    } catch (error) {
      console.error("Failed to generate caption:", error);
      alert(t.error);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handlePost = async () => {
    try {
      setIsPosting(true);

      if (onPost) {
        await onPost(product, caption);
      } else {
        // Default posting logic
        await apiService.postToInstagram(previewImage, {
          ...product,
          caption: caption,
        });
      }

      alert(t.posted);
      if (onClose) onClose();
    } catch (error) {
      console.error("Posting failed:", error);
      alert("Failed to post to Instagram");
    } finally {
      setIsPosting(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Instagram Mock-up */}
          <div className="lg:w-1/2 p-6 bg-gray-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto">
              {/* Instagram Header */}
              <div className="flex items-center p-4 border-b">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-sm">artisan_official</p>
                  <p className="text-xs text-gray-500">{t.artisanPost}</p>
                </div>
                <button className="text-gray-400">⋯</button>
              </div>

              {/* Image */}
              <div className="aspect-square bg-gray-200">
                <img
                  src={previewImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-4">
                    <Heart className="w-6 h-6" />
                    <MessageCircle className="w-6 h-6" />
                    <Send className="w-6 h-6" />
                  </div>
                  <Bookmark className="w-6 h-6" />
                </div>

                <p className="font-semibold text-sm mb-1">127 {t.likes}</p>

                {/* Caption Preview */}
                <div className="text-sm">
                  <span className="font-semibold">artisan_official</span>
                  <span className="ml-1">
                    {caption.length > 100
                      ? `${caption.substring(0, 100)}...`
                      : caption}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-2">{t.viewComments}</p>

                <div className="mt-3 pt-3 border-t">
                  <input
                    type="text"
                    placeholder={t.addComment}
                    className="w-full text-sm text-gray-500 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Caption Editor */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.caption}
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Write your Instagram caption..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {caption.length}/2200 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={generateCaption}
                  disabled={isGeneratingCaption}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Instagram size={18} />
                  <span>
                    {isGeneratingCaption
                      ? "Generating..."
                      : caption
                      ? t.regenerateCaption
                      : t.generateCaption}
                  </span>
                </button>

                <button
                  onClick={handlePost}
                  disabled={isPosting || !caption}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Instagram size={18} />
                  <span>{isPosting ? t.posting : t.postToInstagram}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramPreview;
