import React, { createContext, useContext, useReducer, useEffect } from "react";
import { userAPI } from "../services/user/userAPI";

// Auth Context
const AuthContext = createContext();

// Auth actions
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  LOAD_USER: "LOAD_USER",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        isAuthenticated: action.payload.user ? true : false,
        user: action.payload.user,
        token: action.payload.token,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Initial auth state
const initialAuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("kalakriti_token");
      const savedUser = localStorage.getItem("kalakriti_user");

      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER,
          payload: {
            user: parsedUser,
            token: savedToken,
          },
        });
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      // Clear invalid data
      localStorage.removeItem("kalakriti_token");
      localStorage.removeItem("kalakriti_user");
    }
  }, []);

  // Auth actions
  const login = async (email, password, userType = "user") => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await userAPI.login(email, password);

      if (response.success) {
        const {
          user_id,
          name,
          email: userEmail,
          username,
          user_type,
          profile,
          token,
        } = response.data;

        const user = {
          id: user_id,
          name,
          email: userEmail,
          username,
          userType: user_type || userType,
          profile: profile || {},
        };

        // Save to localStorage
        localStorage.setItem("kalakriti_token", token);
        localStorage.setItem("kalakriti_user", JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        return { success: true, user };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || "Login failed",
        });
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await userAPI.register(userData);

      if (response.success) {
        const { user_id, name, email, token } = response.data;
        const user = { id: user_id, name, email };

        // Save to localStorage
        localStorage.setItem("kalakriti_token", token);
        localStorage.setItem("kalakriti_user", JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        return { success: true, user };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || "Registration failed",
        });
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || "Registration failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("kalakriti_token");
    localStorage.removeItem("kalakriti_user");

    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Helper functions
  const isLoggedIn = () => {
    return authState.isAuthenticated && authState.user && authState.token;
  };

  const getAuthHeaders = () => {
    if (authState.token) {
      return {
        Authorization: `Bearer ${authState.token}`,
        "Content-Type": "application/json",
      };
    }
    return {
      "Content-Type": "application/json",
    };
  };

  const contextValue = {
    ...authState,
    login,
    register,
    logout,
    clearError,
    isLoggedIn,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
