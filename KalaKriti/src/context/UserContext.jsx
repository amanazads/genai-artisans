import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize user from localStorage or default artisan
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      setLoading(true);

      // Check if user data exists in localStorage
      const savedUser = localStorage.getItem("kalakriti_user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Load default artisan for development
        await loadDefaultArtisan();
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
      await loadDefaultArtisan();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultArtisan = async () => {
    try {
      // Try to load artisan_001 as default
      const artisanData = await apiService.getArtisanInfo("artisan_001");
      if (artisanData && !artisanData.error) {
        const defaultUser = {
          ...artisanData,
          isDefault: true,
        };
        setUser(defaultUser);
        setIsAuthenticated(true);
      } else {
        // Create mock user if backend is not available
        const mockUser = {
          name: "Rajesh Kumar",
          state: "Punjab",
          city: "Hoshiarpur",
          artisan_id: "artisan_001",
          experience: 20,
          product_info: [],
          isDefault: true,
          isMock: true,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to load default artisan:", error);
      // Fallback to mock user
      const mockUser = {
        name: "Rajesh Kumar",
        state: "Punjab",
        city: "Hoshiarpur",
        artisan_id: "artisan_001",
        experience: 20,
        product_info: [],
        isDefault: true,
        isMock: true,
      };
      setUser(mockUser);
      setIsAuthenticated(true);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      // Save to backend
      const result = await apiService.saveArtisanInfo(profileData);

      if (result.message) {
        // Update local state
        const updatedUser = { ...profileData };
        setUser(updatedUser);

        // Save to localStorage
        localStorage.setItem("kalakriti_user", JSON.stringify(updatedUser));

        return { success: true, message: result.message };
      }

      throw new Error(result.error || "Failed to save profile");
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      // For now, this is a placeholder
      // In a real app, this would authenticate with backend
      const userData = await apiService.getArtisanInfo(credentials.artisan_id);

      if (userData && !userData.error) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("kalakriti_user", JSON.stringify(userData));
        return { success: true };
      }

      throw new Error("Invalid credentials");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("kalakriti_user");
  };

  const refreshUserData = async () => {
    if (user?.artisan_id) {
      try {
        const freshData = await apiService.getArtisanInfo(user.artisan_id);
        if (freshData && !freshData.error) {
          const updatedUser = { ...freshData };
          setUser(updatedUser);
          localStorage.setItem("kalakriti_user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    updateUserProfile,
    login,
    logout,
    refreshUserData,
    initializeUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
