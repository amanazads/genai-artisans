import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/user/layout/UserLayout";

const ArtisansPage = () => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCraft, setSelectedCraft] = useState("all");

  // Mock artisans data - replace with API call later
  const mockArtisans = [
    {
      id: 1,
      name: "Priya Sharma",
      craft: "Textiles & Embroidery",
      location: "Rajasthan, India",
      experience: "15 years",
      speciality: "Traditional Rajasthani embroidery and mirror work",
      image: "👩‍🎨",
      rating: 4.8,
      totalProducts: 45,
      totalOrders: 234,
      verified: true,
      bio: "Master artisan specializing in traditional Rajasthani textiles with over 15 years of experience.",
    },
    {
      id: 2,
      name: "Raj Kumar",
      craft: "Pottery & Ceramics",
      location: "Gujarat, India",
      experience: "20 years",
      speciality: "Blue pottery and ceramic art",
      image: "👨‍🎨",
      rating: 4.9,
      totalProducts: 67,
      totalOrders: 189,
      verified: true,
      bio: "Renowned potter known for exquisite blue pottery and innovative ceramic designs.",
    },
    {
      id: 3,
      name: "Meera Devi",
      craft: "Jewelry Making",
      location: "Uttar Pradesh, India",
      experience: "12 years",
      speciality: "Silver jewelry and traditional ornaments",
      image: "👩‍💼",
      rating: 4.7,
      totalProducts: 89,
      totalOrders: 345,
      verified: true,
      bio: "Expert in creating beautiful silver jewelry and traditional Indian ornaments.",
    },
    {
      id: 4,
      name: "Arjun Singh",
      craft: "Wood Carving",
      location: "Kashmir, India",
      experience: "18 years",
      speciality: "Walnut wood carving and furniture",
      image: "👨‍🔧",
      rating: 4.8,
      totalProducts: 32,
      totalOrders: 156,
      verified: true,
      bio: "Master wood carver specializing in intricate Kashmiri walnut woodwork.",
    },
    {
      id: 5,
      name: "Lakshmi Iyer",
      craft: "Paintings",
      location: "Tamil Nadu, India",
      experience: "10 years",
      speciality: "Tanjore paintings and traditional art",
      image: "👩‍🎨",
      rating: 4.6,
      totalProducts: 78,
      totalOrders: 267,
      verified: true,
      bio: "Traditional artist known for beautiful Tanjore paintings and South Indian art forms.",
    },
    {
      id: 6,
      name: "Hassan Ali",
      craft: "Metal Crafts",
      location: "Kerala, India",
      experience: "25 years",
      speciality: "Brass work and copper crafts",
      image: "👨‍🏭",
      rating: 4.9,
      totalProducts: 54,
      totalOrders: 198,
      verified: true,
      bio: "Veteran craftsman with expertise in traditional brass and copper metalwork.",
    },
  ];

  const craftTypes = [
    "all",
    "Textiles & Embroidery",
    "Pottery & Ceramics",
    "Jewelry Making",
    "Wood Carving",
    "Paintings",
    "Metal Crafts",
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArtisans(mockArtisans);
      setLoading(false);
    }, 500);
  }, []);

  const filteredArtisans = artisans.filter((artisan) => {
    const matchesSearch =
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCraft =
      selectedCraft === "all" || artisan.craft === selectedCraft;
    return matchesSearch && matchesCraft;
  });

  const handleArtisanClick = (artisanId) => {
    navigate(`/artisan/${artisanId}`);
  };

  const handleViewProducts = (artisanId) => {
    navigate(`/search?artisan=${artisanId}`);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading artisans...</p>
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
            Meet Our Talented Artisans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the skilled craftspeople behind every handmade treasure on
            KalaKriti
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search artisans by name, craft, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCraft}
              onChange={(e) => setSelectedCraft(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {craftTypes.map((craft) => (
                <option key={craft} value={craft}>
                  {craft === "all" ? "All Crafts" : craft}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredArtisans.length} of {artisans.length} artisans
          </p>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Artisan Header */}
              <div className="p-6 text-center border-b border-gray-100">
                <div className="text-5xl mb-3">{artisan.image}</div>
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {artisan.name}
                  </h3>
                  {artisan.verified && (
                    <span
                      className="ml-2 text-blue-500"
                      title="Verified Artisan"
                    >
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-blue-600 font-medium mb-1">
                  {artisan.craft}
                </p>
                <p className="text-gray-500 text-sm mb-3">{artisan.location}</p>

                {/* Rating */}
                <div className="flex items-center justify-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < Math.floor(artisan.rating) ? "★" : "☆"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    {artisan.rating} ({artisan.totalOrders} orders)
                  </span>
                </div>
              </div>

              {/* Artisan Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Speciality:
                  </h4>
                  <p className="text-gray-600 text-sm">{artisan.speciality}</p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm">{artisan.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {artisan.totalProducts}
                    </p>
                    <p className="text-xs text-gray-500">Products</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {artisan.experience}
                    </p>
                    <p className="text-xs text-gray-500">Experience</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewProducts(artisan.id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Products
                  </button>
                  <button
                    onClick={() => handleArtisanClick(artisan.id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredArtisans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No artisans found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCraft("all");
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default ArtisansPage;
