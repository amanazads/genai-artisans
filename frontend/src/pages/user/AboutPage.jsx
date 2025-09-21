import React from "react";
import { Link } from "react-router-dom";
import UserLayout from "../../components/user/layout/UserLayout";

const AboutPage = () => {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">KalaKriti</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Celebrating the rich heritage of Indian craftsmanship by connecting
            talented artisans with art lovers worldwide
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              KalaKriti is more than just a marketplace - it's a bridge between
              traditional artisans and modern consumers who appreciate
              authentic, handcrafted beauty. We believe every handmade product
              tells a story of heritage, skill, and passion.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our mission is to preserve and promote traditional Indian crafts
              while providing sustainable livelihoods to skilled artisans across
              the country.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Preserving Heritage
              </h3>
              <p className="text-gray-600">
                Every purchase supports traditional craftsmanship and helps keep
                ancient art forms alive
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Authenticity
              </h3>
              <p className="text-gray-600">
                Every product is genuinely handcrafted by verified artisans,
                ensuring authentic traditional techniques and materials.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sustainability
              </h3>
              <p className="text-gray-600">
                We promote eco-friendly practices and sustainable craftsmanship
                that respects both tradition and the environment.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality
              </h3>
              <p className="text-gray-600">
                We maintain the highest standards of craftsmanship, ensuring
                every piece meets our rigorous quality criteria.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-700 font-medium">Artisans Supported</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                15,000+
              </div>
              <p className="text-gray-700 font-medium">Products Sold</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">28</div>
              <p className="text-gray-700 font-medium">States Covered</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <p className="text-gray-700 font-medium">Traditional Crafts</p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Rich Heritage
              </h3>
              <p className="text-gray-600">
                India's craft traditions span thousands of years, representing
                diverse cultures and regional expertise
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Founded in 2023, KalaKriti was born from a deep appreciation for
              India's rich artistic heritage. Our founders witnessed the
              struggles of talented artisans who lacked access to wider markets
              and fair pricing for their exceptional work.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              We created KalaKriti to change this narrative - to build a
              platform where artisans can showcase their skills, earn fair
              wages, and continue their ancestral crafts with pride.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Today, we're proud to support hundreds of artisans across India,
              helping preserve traditional crafts while bringing these beautiful
              creations to appreciative customers worldwide.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Artisan Verification
              </h3>
              <p className="text-gray-600">
                We carefully verify each artisan's skills, authenticity, and
                commitment to traditional techniques.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality Assurance
              </h3>
              <p className="text-gray-600">
                Every product undergoes thorough quality checks to ensure it
                meets our high standards.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Direct Connection
              </h3>
              <p className="text-gray-600">
                We connect customers directly with artisans, ensuring fair
                compensation and authentic stories.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're an artisan looking to showcase your craft or a
            customer seeking authentic handmade treasures, we invite you to be
            part of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Join as Artisan
            </Link>
            <Link
              to="/categories"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Shop Handcrafted Items
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <span className="mr-3">📧</span>
                hello@kalakriti.com
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-3">📞</span>
                +91 98765 43210
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-3">📍</span>
                New Delhi, India
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span className="text-2xl">📘</span>
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span className="text-2xl">📷</span>
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span className="text-2xl">🐦</span>
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span className="text-2xl">💼</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AboutPage;
