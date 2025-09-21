import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "user", // "user" or "artisan"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const languageOptions = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  ];

  const translations = {
    en: {
      welcome: "Welcome to KalaKriti",
      subtitle: "Discover and shop traditional handcrafted treasures",
      artisanSubtitle: "Showcase your crafts to the world",
      email: "Email Address",
      password: "Password",
      signIn: "Sign In",
      signInAsUser: "Continue as Customer",
      signInAsArtisan: "Continue as Artisan",
      userTab: "Customer",
      artisanTab: "Artisan",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      language: "Language",
      showPassword: "Show password",
      hidePassword: "Hide password",
      invalidEmail: "Please enter a valid email address",
      invalidPassword: "Password must be at least 6 characters",
      loginError: "Invalid email or password",
      userDescription:
        "Shop beautiful handcrafted items from skilled artisans across India",
      artisanDescription:
        "Join our community of talented artisans and grow your craft business",
      userFeatures: [
        "Browse thousands of handcrafted items",
        "Support local artisans",
        "Secure payments & fast delivery",
      ],
      artisanFeatures: [
        "Showcase your crafts",
        "Reach customers nationwide",
        "Grow your business",
      ],
    },
    hi: {
      welcome: "कलाकृति में आपका स्वागत है",
      subtitle: "पारंपरिक हस्तशिल्प खजाने खोजें और खरीदें",
      artisanSubtitle: "अपने शिल्प को दुनिया के सामने प्रस्तुत करें",
      email: "ईमेल पता",
      password: "पासवर्ड",
      signIn: "साइन इन करें",
      signInAsUser: "ग्राहक के रूप में जारी रखें",
      signInAsArtisan: "कारीगर के रूप में जारी रखें",
      userTab: "ग्राहक",
      artisanTab: "कारीगर",
      forgotPassword: "पासवर्ड भूल गए?",
      noAccount: "खाता नहीं है?",
      signUp: "साइन अप करें",
      language: "भाषा",
      showPassword: "पासवर्ड दिखाएं",
      hidePassword: "पासवर्ड छुपाएं",
      invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
      invalidPassword: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
      loginError: "अमान्य ईमेल या पासवर्ड",
      userDescription:
        "भारत भर के कुशल कारीगरों से सुंदर हस्तशिल्प आइटम खरीदें",
      artisanDescription: "प्रतिभाशाली कारीगरों के हमारे समुदाय में शामिल हों",
      userFeatures: [
        "हजारों हस्तशिल्प वस्तुएं देखें",
        "स्थानीय कारीगरों का समर्थन करें",
        "सुरक्षित भुगतान और तेज़ डिलीवरी",
      ],
      artisanFeatures: [
        "अपने शिल्प का प्रदर्शन करें",
        "देशभर के ग्राहकों तक पहुंचें",
        "अपना व्यवसाय बढ़ाएं",
      ],
    },
    pa: {
      welcome: "ਕਲਾਕ੍ਰਿਤੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
      subtitle: "ਪਰੰਪਰਾਗਤ ਹੱਥ ਨਾਲ ਬਣੇ ਖਜ਼ਾਨੇ ਖੋਜੋ ਅਤੇ ਖਰੀਦੋ",
      artisanSubtitle: "ਆਪਣੇ ਸ਼ਿਲਪ ਨੂੰ ਦੁਨੀਆ ਦੇ ਸਾਹਮਣੇ ਪੇਸ਼ ਕਰੋ",
      email: "ਈਮੇਲ ਪਤਾ",
      password: "ਪਾਸਵਰਡ",
      signIn: "ਸਾਈਨ ਇਨ ਕਰੋ",
      signInAsUser: "ਗਾਹਕ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ",
      signInAsArtisan: "ਕਾਰੀਗਰ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ",
      userTab: "ਗਾਹਕ",
      artisanTab: "ਕਾਰੀਗਰ",
      forgotPassword: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
      noAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
      signUp: "ਸਾਈਨ ਅੱਪ ਕਰੋ",
      language: "ਭਾਸ਼ਾ",
      showPassword: "ਪਾਸਵਰਡ ਦਿਖਾਓ",
      hidePassword: "ਪਾਸਵਰਡ ਲੁਕਾਓ",
      invalidEmail: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ",
      invalidPassword: "ਪਾਸਵਰਡ ਘੱਟੋ ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ",
      loginError: "ਗਲਤ ਈਮੇਲ ਜਾਂ ਪਾਸਵਰਡ",
      userDescription:
        "ਭਾਰਤ ਭਰ ਦੇ ਹੁਨਰਮੰਦ ਕਾਰੀਗਰਾਂ ਤੋਂ ਸੁੰਦਰ ਹੱਥ ਨਾਲ ਬਣੇ ਸਮਾਨ ਖਰੀਦੋ",
      artisanDescription:
        "ਪ੍ਰਤਿਭਾਸ਼ਾਲੀ ਕਾਰੀਗਰਾਂ ਦੇ ਸਾਡੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
      userFeatures: [
        "ਹਜ਼ਾਰਾਂ ਹੱਥ ਨਾਲ ਬਣੀਆਂ ਚੀਜ਼ਾਂ ਦੇਖੋ",
        "ਸਥਾਨਕ ਕਾਰੀਗਰਾਂ ਦਾ ਸਮਰਥਨ ਕਰੋ",
        "ਸੁਰੱਖਿਤ ਭੁਗਤਾਨ ਅਤੇ ਤੇਜ਼ ਡਿਲੀਵਰੀ",
      ],
      artisanFeatures: [
        "ਆਪਣੇ ਸ਼ਿਲਪ ਦਾ ਪ੍ਰਦਰਸ਼ਨ ਕਰੋ",
        "ਦੇਸ਼ ਭਰ ਦੇ ਗਾਹਕਾਂ ਤੱਕ ਪਹੁੰਚੋ",
        "ਆਪਣਾ ਕਾਰੋਬਾਰ ਵਧਾਓ",
      ],
    },
  };

  const currentTranslations = translations[language] || translations.en;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleUserTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      userType: type,
    }));
    setError("");
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      setError(currentTranslations.invalidEmail);
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError(currentTranslations.invalidPassword);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const result = await login(
        formData.email,
        formData.password,
        formData.userType
      );

      if (result.success) {
        // Redirect based on user type
        if (formData.userType === "artisan") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(result.error || currentTranslations.loginError);
      }
    } catch (error) {
      setError(currentTranslations.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Language Selector */}
        <div className="language-selector">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-dropdown"
          >
            {languageOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.flag} {option.nativeName}
              </option>
            ))}
          </select>
        </div>

        <div className="login-content">
          {/* Left Side - Branding */}
          <div className="branding-section">
            <div className="brand-logo">
              <span className="logo-icon">🎨</span>
              <span className="logo-text">KalaKriti</span>
            </div>

            <h1 className="welcome-title">{currentTranslations.welcome}</h1>

            {/* Dynamic content based on user type */}
            <div className="user-type-content">
              {formData.userType === "user" ? (
                <>
                  <p className="subtitle">{currentTranslations.subtitle}</p>
                  <p className="description">
                    {currentTranslations.userDescription}
                  </p>
                  <ul className="features-list">
                    {currentTranslations.userFeatures.map((feature, index) => (
                      <li key={index}>
                        <span className="feature-icon">✨</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="subtitle">
                    {currentTranslations.artisanSubtitle}
                  </p>
                  <p className="description">
                    {currentTranslations.artisanDescription}
                  </p>
                  <ul className="features-list">
                    {currentTranslations.artisanFeatures.map(
                      (feature, index) => (
                        <li key={index}>
                          <span className="feature-icon">🚀</span>
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}
            </div>

            {/* Decorative elements */}
            <div className="decorative-elements">
              <div className="craft-icon">🏺</div>
              <div className="craft-icon">🧵</div>
              <div className="craft-icon">💎</div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="form-section">
            <div className="form-container">
              {/* User Type Tabs */}
              <div className="user-type-tabs">
                <button
                  type="button"
                  className={`tab-button ${
                    formData.userType === "user" ? "active" : ""
                  }`}
                  onClick={() => handleUserTypeChange("user")}
                >
                  <span className="tab-icon">🛍️</span>
                  {currentTranslations.userTab}
                </button>
                <button
                  type="button"
                  className={`tab-button ${
                    formData.userType === "artisan" ? "active" : ""
                  }`}
                  onClick={() => handleUserTypeChange("artisan")}
                >
                  <span className="tab-icon">🎨</span>
                  {currentTranslations.artisanTab}
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    {currentTranslations.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="artisan@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    {currentTranslations.password}
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      title={
                        showPassword
                          ? currentTranslations.hidePassword
                          : currentTranslations.showPassword
                      }
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span className="button-icon">
                        {formData.userType === "user" ? "🛍️" : "🎨"}
                      </span>
                      {formData.userType === "user"
                        ? currentTranslations.signInAsUser
                        : currentTranslations.signInAsArtisan}
                    </>
                  )}
                </button>

                {/* Additional Links */}
                <div className="form-links">
                  <Link to="/forgot-password" className="forgot-password-link">
                    {currentTranslations.forgotPassword}
                  </Link>
                </div>

                <div className="signup-prompt">
                  <span>{currentTranslations.noAccount}</span>
                  <Link to="/register" className="signup-link">
                    {currentTranslations.signUp}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
