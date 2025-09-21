import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// User-side Pages
import HomePage from "../pages/user/HomePage";
import SearchResultsPage from "../pages/user/SearchResultsPage";
import ProductDetailPage from "../pages/user/ProductDetailPage";
import CheckoutPage from "../pages/user/CheckoutPage";
import CategoryPage from "../pages/user/CategoryPage";
import ArtisansPage from "../pages/user/ArtisansPage";
import AboutPage from "../pages/user/AboutPage";
import CartPage from "../pages/user/CartPage";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";

const UserRoutes = () => {
  return (
    <Routes>
      {/* User-side Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/artisans" element={<ArtisansPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* User Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default UserRoutes;
