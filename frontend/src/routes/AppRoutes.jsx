import React from "react";
import { useLocation } from "react-router-dom";
import ArtisanRoutes from "./ArtisanRoutes";
import UserRoutes from "./UserRoutes";

const AppRoutes = () => {
  const location = useLocation();

  // Check if the current path is an artisan route
  const isArtisanRoute =
    location.pathname.startsWith("/artisan") ||
    location.pathname.startsWith("/admin") || // Legacy admin routes
    location.pathname === "/dashboard";

  // Render appropriate routes based on the path
  if (isArtisanRoute) {
    return <ArtisanRoutes />;
  }

  return <UserRoutes />;
};

export default AppRoutes;
