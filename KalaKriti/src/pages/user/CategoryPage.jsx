import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/user/layout/UserLayout";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock categories for now - you can replace with API call later
  const mockCategories = [
    {
      id: 1,
      name: "Textiles & Fabrics",
      description:
        "Handwoven fabrics, traditional sarees, and embroidered textiles",
      image: "🧵",
      productCount: 156,
      subcategories: ["Sarees", "Scarves", "Fabrics", "Embroidery"],
    },
    {
      id: 2,
      name: "Pottery & Ceramics",
      description: "Traditional pottery, ceramic art, and clay crafts",
      image: "🏺",
      productCount: 89,
      subcategories: ["Vases", "Bowls", "Decorative Items", "Dinnerware"],
    },
    {
      id: 3,
      name: "Jewelry & Accessories",
      description:
        "Handcrafted jewelry, traditional ornaments, and accessories",
      image: "💍",
      productCount: 234,
      subcategories: ["Necklaces", "Earrings", "Bracelets", "Rings"],
    },
    {
      id: 4,
      name: "Wood & Bamboo Crafts",
      description: "Wooden artifacts, bamboo crafts, and furniture",
      image: "🎋",
      productCount: 78,
      subcategories: ["Furniture", "Decorative Items", "Utensils", "Toys"],
    },
    {
      id: 5,
      name: "Metal Crafts",
      description: "Brass work, copper crafts, and metal art",
      image: "🔶",
      productCount: 112,
      subcategories: [
        "Brass Items",
        "Copper Work",
        "Silver Crafts",
        "Iron Crafts",
      ],
    },
    {
      id: 6,
      name: "Paintings & Art",
      description: "Traditional paintings, folk art, and contemporary works",
      image: "🎨",
      productCount: 145,
      subcategories: [
        "Folk Paintings",
        "Miniature Art",
        "Canvas Art",
        "Wall Art",
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/search?subcategory=${encodeURIComponent(subcategory)}`);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse by Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic handcrafted treasures organized by traditional
            art forms and crafts
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group"
              onClick={() => handleCategoryClick(category.id)}
            >
              {/* Category Header */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="text-6xl mb-4">{category.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {category.description}
                </p>
                <div className="text-blue-600 font-medium">
                  {category.productCount} products
                </div>
              </div>

              {/* Subcategories */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Popular Subcategories:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.map((subcategory, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubcategoryClick(subcategory);
                      }}
                      className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full transition-colors duration-200"
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              Use our search to find specific products or browse all items
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/search")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Search All Products
              </button>
              <button
                onClick={() => navigate("/artisans")}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Artisans
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CategoryPage;
