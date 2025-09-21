import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Artisan Dashboard Pages
import LoginPage from "../pages/LoginPage";
import DashboardHomePage from "../pages/DashboardHomePage";
import MyProductsPage from "../pages/MyProductsPage";
import AddProductPage from "../pages/AddProductPage";
import ProductEditPage from "../pages/ProductEditPage";
import ProductViewPage from "../pages/ProductViewPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ProfilePage from "../pages/ProfilePage";

const ArtisanRoutes = () => {
  return (
    <Routes>
      {/* Artisan Authentication */}
      <Route path="/artisan/login" element={<LoginPage />} />

      {/* Artisan Dashboard Routes */}
      <Route
        path="/artisan"
        element={<Navigate to="/artisan/dashboard" replace />}
      />
      <Route path="/artisan/dashboard" element={<DashboardHomePage />} />
      <Route path="/artisan/products" element={<MyProductsPage />} />
      <Route path="/artisan/add-product" element={<AddProductPage />} />
      <Route path="/artisan/products/edit/:id" element={<ProductEditPage />} />
      <Route path="/artisan/products/view/:id" element={<ProductViewPage />} />
      <Route path="/artisan/analytics" element={<AnalyticsPage />} />
      <Route path="/artisan/profile" element={<ProfilePage />} />

      {/* Legacy redirects for backward compatibility */}
      <Route
        path="/dashboard"
        element={<Navigate to="/artisan/dashboard" replace />}
      />
      <Route
        path="/admin/*"
        element={<Navigate to="/artisan/dashboard" replace />}
      />
    </Routes>
  );
};

export default ArtisanRoutes;
