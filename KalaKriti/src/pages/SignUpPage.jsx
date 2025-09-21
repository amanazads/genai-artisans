import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_type: "customer",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-generate username from email if email is being changed and username is empty
    if (name === "email" && !formData.username.trim()) {
      const emailUsername = value.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      setFormData({
        ...formData,
        [name]: value,
        username: emailUsername,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Username validation function
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.full_name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!validateUsername(formData.username)) {
      setError(
        "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
      );
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API call
      const userData = {
        email: formData.email,
        username: formData.username,
        full_name: formData.full_name,
        password: formData.password,
        user_type: formData.user_type,
        phone: formData.phone || null,
      };

      console.log("Registering user with:", userData);

      // Call the registration API through AuthContext
      const result = await register(userData);

      if (result.success) {
        console.log("Registration successful:", result);

        // Navigate to appropriate page based on user type
        if (userData.user_type === "artisan") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">Join the KalaKriti community</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <small className="helper-text">
              3-20 characters, letters, numbers, and underscores only
            </small>
          </div>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="user-type-group">
            <p>I am a...</p>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="user_type"
                  value="customer"
                  checked={formData.user_type === "customer"}
                  onChange={handleChange}
                />
                Customer
              </label>
              <label>
                <input
                  type="radio"
                  name="user_type"
                  value="artisan"
                  checked={formData.user_type === "artisan"}
                  onChange={handleChange}
                />
                Artisan
              </label>
            </div>
          </div>
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
