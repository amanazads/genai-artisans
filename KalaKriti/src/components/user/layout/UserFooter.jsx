import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UserFooter.css";

const UserFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="user-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <span className="footer-logo-icon">🎨</span>
              <span className="footer-logo-text">KalaKriti</span>
            </div>
            <p className="footer-description">
              Discover authentic Indian handicrafts and support traditional
              artisans. Each piece tells a story of heritage, culture, and
              exceptional craftsmanship passed down through generations.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link facebook">
                <span>📘</span>
              </a>
              <a href="#" aria-label="Instagram" className="social-link instagram">
                <span>📷</span>
              </a>
              <a href="#" aria-label="Twitter" className="social-link twitter">
                <span>🐦</span>
              </a>
              <a href="#" aria-label="YouTube" className="social-link youtube">
                <span>📺</span>
              </a>
              <a href="#" aria-label="Pinterest" className="social-link pinterest">
                <span>📌</span>
              </a>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+91-XXXX-XXXXXX</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>hello@kalakriti.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search">Browse Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/artisans">Meet Artisans</Link></li>
              <li><Link to="/new-arrivals">New Arrivals</Link></li>
              <li><Link to="/featured">Featured Products</Link></li>
              <li><Link to="/deals">Special Offers</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/search?category=pottery">Pottery & Ceramics</Link></li>
              <li><Link to="/search?category=textiles">Textiles & Fabrics</Link></li>
              <li><Link to="/search?category=jewelry">Jewelry & Accessories</Link></li>
              <li><Link to="/search?category=paintings">Art & Paintings</Link></li>
              <li><Link to="/search?category=woodwork">Woodwork & Carvings</Link></li>
              <li><Link to="/search?category=metalwork">Metalwork</Link></li>
              <li><Link to="/search?category=home-decor">Home Decor</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/track-order">Track Your Order</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="footer-section">
            <h4 className="footer-heading">About Us</h4>
            <ul className="footer-links">
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/mission">Our Mission</Link></li>
              <li><Link to="/impact">Social Impact</Link></li>
              <li><Link to="/sustainability">Sustainability</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section newsletter-section">
            <h4 className="footer-heading">Stay Connected</h4>
            <p className="newsletter-description">
              Get updates on new arrivals, exclusive offers, and artisan stories
            </p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <div className="newsletter-input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </div>
              {isSubscribed && (
                <div className="subscription-success">
                  <span className="success-icon">✅</span>
                  Thank you for subscribing!
                </div>
              )}
            </form>
            
            <div className="app-download">
              <h5>Download Our App</h5>
              <div className="app-links">
                <a href="#" className="app-link">
                  <span className="app-icon">📱</span>
                  <div className="app-text">
                    <span className="app-store">Download on the</span>
                    <span className="app-name">App Store</span>
                  </div>
                </a>
                <a href="#" className="app-link">
                  <span className="app-icon">🤖</span>
                  <div className="app-text">
                    <span className="app-store">Get it on</span>
                    <span className="app-name">Google Play</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="payment-methods">
              <h5>Secure Payments</h5>
              <div className="payment-icons">
                <span className="payment-icon visa">💳</span>
                <span className="payment-icon mastercard">💳</span>
                <span className="payment-icon upi">📱</span>
                <span className="payment-icon wallet">💰</span>
                <span className="payment-icon bank">🏦</span>
              </div>
              <div className="security-badges">
                <span className="security-badge">🔒 SSL Secured</span>
                <span className="security-badge">✅ Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications & Trust Indicators */}
        <div className="trust-section">
          <div className="trust-content">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <div className="trust-text">
                <h6>Secure Shopping</h6>
                <p>256-bit SSL encryption</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <div className="trust-text">
                <h6>Free Shipping</h6>
                <p>On orders above ₹999</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">↩️</span>
              <div className="trust-text">
                <h6>Easy Returns</h6>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🎨</span>
              <div className="trust-text">
                <h6>Authentic Crafts</h6>
                <p>Directly from artisans</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🏆</span>
              <div className="trust-text">
                <h6>Quality Assured</h6>
                <p>Handpicked products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} KalaKriti. All rights reserved.</p>
              <p className="tagline">Crafted with ❤️ for Indian Heritage</p>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
              <Link to="/accessibility">Accessibility</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
            <div className="language-selector">
              <select className="language-select">
                <option value="en">🇮🇳 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="pa">🇮🇳 ਪੰਜਾਬੀ</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;