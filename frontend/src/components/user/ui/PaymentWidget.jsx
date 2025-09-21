import React, { useState, useEffect } from "react";
import "./PaymentWidget.css";

const PaymentWidget = ({
  orderTotal = 0,
  onPaymentMethodChange,
  onPaymentValidation,
  onProcessPayment,
  allowedMethods = ["card", "upi", "netbanking", "wallet", "cod"],
}) => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [paymentData, setPaymentData] = useState({
    card: {
      number: "",
      holder_name: "",
      expiry_month: "",
      expiry_year: "",
      cvv: "",
      save_card: false,
    },
    upi: {
      upi_id: "",
      verified: false,
    },
    netbanking: {
      bank: "",
      account_type: "savings",
    },
    wallet: {
      provider: "",
      phone: "",
    },
    cod: {
      confirmed: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedCards, setSavedCards] = useState([]);

  const paymentMethods = {
    card: {
      icon: "💳",
      label: "Credit/Debit Card",
      description: "Visa, Mastercard, RuPay",
    },
    upi: {
      icon: "📱",
      label: "UPI",
      description: "Google Pay, PhonePe, Paytm",
    },
    netbanking: {
      icon: "🏦",
      label: "Net Banking",
      description: "All major banks",
    },
    wallet: {
      icon: "👛",
      label: "Digital Wallet",
      description: "Paytm, Amazon Pay",
    },
    cod: {
      icon: "💰",
      label: "Cash on Delivery",
      description: "Pay when you receive",
    },
  };

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Bank of India",
  ];

  const walletProviders = [
    { id: "paytm", name: "Paytm", icon: "🔵" },
    { id: "amazonpay", name: "Amazon Pay", icon: "🟠" },
    { id: "mobikwik", name: "MobiKwik", icon: "🔴" },
    { id: "freecharge", name: "FreeCharge", icon: "🟢" },
  ];

  useEffect(() => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange(selectedMethod, paymentData[selectedMethod]);
    }
  }, [selectedMethod, paymentData, onPaymentMethodChange]);

  useEffect(() => {
    const isValid = validatePaymentMethod();
    if (onPaymentValidation) {
      onPaymentValidation(isValid);
    }
  }, [selectedMethod, paymentData]);

  useEffect(() => {
    // Load saved cards (mock data)
    setSavedCards([
      {
        id: "1",
        last_four: "4532",
        brand: "Visa",
        holder_name: "JOHN DOE",
        expiry: "12/25",
      },
    ]);
  }, []);

  const validatePaymentMethod = () => {
    const newErrors = {};
    const currentData = paymentData[selectedMethod];

    switch (selectedMethod) {
      case "card":
        if (!currentData.number || currentData.number.length < 16) {
          newErrors.card_number = "Please enter a valid card number";
        }
        if (!currentData.holder_name.trim()) {
          newErrors.card_holder = "Cardholder name is required";
        }
        if (!currentData.expiry_month || !currentData.expiry_year) {
          newErrors.card_expiry = "Please enter expiry date";
        }
        if (!currentData.cvv || currentData.cvv.length < 3) {
          newErrors.card_cvv = "Please enter valid CVV";
        }
        break;

      case "upi":
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        if (!currentData.upi_id || !upiRegex.test(currentData.upi_id)) {
          newErrors.upi_id = "Please enter a valid UPI ID";
        }
        break;

      case "netbanking":
        if (!currentData.bank) {
          newErrors.bank = "Please select your bank";
        }
        break;

      case "wallet":
        if (!currentData.provider) {
          newErrors.wallet_provider = "Please select a wallet provider";
        }
        if (!currentData.phone || currentData.phone.length !== 10) {
          newErrors.wallet_phone = "Please enter a valid phone number";
        }
        break;

      case "cod":
        if (!currentData.confirmed) {
          newErrors.cod_confirm = "Please confirm cash on delivery";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMethodSelect = (method) => {
    if (allowedMethods.includes(method)) {
      setSelectedMethod(method);
      setErrors({});
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      [selectedMethod]: {
        ...prev[selectedMethod],
        [field]: value,
      },
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const getCardBrand = (number) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) return "Visa";
    if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2"))
      return "Mastercard";
    if (cleanNumber.startsWith("6")) return "RuPay";
    if (cleanNumber.startsWith("3")) return "American Express";
    return "";
  };

  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      handleInputChange("number", formatted);
    }
  };

  const verifyUPI = async () => {
    const upiId = paymentData.upi.upi_id;
    if (!upiId) return;

    setIsProcessing(true);
    try {
      // Mock UPI verification
      await new Promise((resolve) => setTimeout(resolve, 1500));
      handleInputChange("verified", true);
    } catch (error) {
      console.error("UPI verification failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async () => {
    if (!validatePaymentMethod()) return;

    setIsProcessing(true);
    try {
      const paymentPayload = {
        method: selectedMethod,
        amount: orderTotal,
        data: paymentData[selectedMethod],
      };

      if (onProcessPayment) {
        await onProcessPayment(paymentPayload);
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCardForm = () => (
    <div className="payment-form card-form">
      {savedCards.length > 0 && (
        <div className="saved-cards">
          <h4>Saved Cards</h4>
          {savedCards.map((card) => (
            <div key={card.id} className="saved-card">
              <div className="card-info">
                <span className="card-brand">{card.brand}</span>
                <span className="card-number">
                  **** **** **** {card.last_four}
                </span>
                <span className="card-expiry">{card.expiry}</span>
              </div>
              <button className="use-card-btn">Use This Card</button>
            </div>
          ))}
          <div className="divider">or use a new card</div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group full-width">
          <label>Card Number</label>
          <div className="card-input">
            <input
              type="text"
              value={paymentData.card.number}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className={errors.card_number ? "error" : ""}
              maxLength="19"
            />
            <span className="card-brand-icon">
              {getCardBrand(paymentData.card.number) &&
                `💳 ${getCardBrand(paymentData.card.number)}`}
            </span>
          </div>
          {errors.card_number && (
            <span className="error-message">{errors.card_number}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label>Cardholder Name</label>
          <input
            type="text"
            value={paymentData.card.holder_name}
            onChange={(e) =>
              handleInputChange("holder_name", e.target.value.toUpperCase())
            }
            placeholder="NAME AS ON CARD"
            className={errors.card_holder ? "error" : ""}
          />
          {errors.card_holder && (
            <span className="error-message">{errors.card_holder}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Expiry Month</label>
          <select
            value={paymentData.card.expiry_month}
            onChange={(e) => handleInputChange("expiry_month", e.target.value)}
            className={errors.card_expiry ? "error" : ""}
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Expiry Year</label>
          <select
            value={paymentData.card.expiry_year}
            onChange={(e) => handleInputChange("expiry_year", e.target.value)}
            className={errors.card_expiry ? "error" : ""}
          >
            <option value="">YYYY</option>
            {Array.from({ length: 20 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input
            type="password"
            value={paymentData.card.cvv}
            onChange={(e) =>
              handleInputChange(
                "cvv",
                e.target.value.replace(/\D/g, "").slice(0, 4)
              )
            }
            placeholder="123"
            className={errors.card_cvv ? "error" : ""}
            maxLength="4"
          />
        </div>
      </div>

      {errors.card_expiry && (
        <span className="error-message">{errors.card_expiry}</span>
      )}
      {errors.card_cvv && (
        <span className="error-message">{errors.card_cvv}</span>
      )}

      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={paymentData.card.save_card}
            onChange={(e) => handleInputChange("save_card", e.target.checked)}
          />
          <span className="checkmark"></span>
          Save this card for future purchases
        </label>
      </div>
    </div>
  );

  const renderUPIForm = () => (
    <div className="payment-form upi-form">
      <div className="form-row">
        <div className="form-group full-width">
          <label>UPI ID</label>
          <div className="upi-input">
            <input
              type="text"
              value={paymentData.upi.upi_id}
              onChange={(e) =>
                handleInputChange("upi_id", e.target.value.toLowerCase())
              }
              placeholder="yourname@paytm"
              className={errors.upi_id ? "error" : ""}
            />
            <button
              className="verify-btn"
              onClick={verifyUPI}
              disabled={!paymentData.upi.upi_id || isProcessing}
            >
              {isProcessing ? "Verifying..." : "Verify"}
            </button>
          </div>
          {errors.upi_id && (
            <span className="error-message">{errors.upi_id}</span>
          )}
          {paymentData.upi.verified && (
            <span className="success-message">
              ✅ UPI ID verified successfully
            </span>
          )}
        </div>
      </div>

      <div className="upi-apps">
        <p>Popular UPI Apps:</p>
        <div className="upi-options">
          <div className="upi-app">📱 Google Pay</div>
          <div className="upi-app">💙 PhonePe</div>
          <div className="upi-app">🔵 Paytm</div>
          <div className="upi-app">🟦 BHIM</div>
        </div>
      </div>
    </div>
  );

  const renderNetBankingForm = () => (
    <div className="payment-form netbanking-form">
      <div className="form-row">
        <div className="form-group full-width">
          <label>Select Your Bank</label>
          <select
            value={paymentData.netbanking.bank}
            onChange={(e) => handleInputChange("bank", e.target.value)}
            className={errors.bank ? "error" : ""}
          >
            <option value="">Choose Bank</option>
            {banks.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bank && <span className="error-message">{errors.bank}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Account Type</label>
          <select
            value={paymentData.netbanking.account_type}
            onChange={(e) => handleInputChange("account_type", e.target.value)}
          >
            <option value="savings">Savings Account</option>
            <option value="current">Current Account</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderWalletForm = () => (
    <div className="payment-form wallet-form">
      <div className="wallet-providers">
        {walletProviders.map((provider) => (
          <div
            key={provider.id}
            className={`wallet-option ${
              paymentData.wallet.provider === provider.id ? "selected" : ""
            }`}
            onClick={() => handleInputChange("provider", provider.id)}
          >
            <span className="wallet-icon">{provider.icon}</span>
            <span className="wallet-name">{provider.name}</span>
          </div>
        ))}
      </div>
      {errors.wallet_provider && (
        <span className="error-message">{errors.wallet_provider}</span>
      )}

      {paymentData.wallet.provider && (
        <div className="form-row">
          <div className="form-group full-width">
            <label>Phone Number</label>
            <input
              type="tel"
              value={paymentData.wallet.phone}
              onChange={(e) =>
                handleInputChange(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              placeholder="Enter registered mobile number"
              className={errors.wallet_phone ? "error" : ""}
              maxLength="10"
            />
            {errors.wallet_phone && (
              <span className="error-message">{errors.wallet_phone}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderCODForm = () => (
    <div className="payment-form cod-form">
      <div className="cod-info">
        <div className="cod-details">
          <h4>Cash on Delivery</h4>
          <p>
            Pay ₹{orderTotal.toLocaleString()} when your order is delivered.
          </p>
          <ul>
            <li>✅ No online payment required</li>
            <li>✅ Pay directly to delivery partner</li>
            <li>✅ Extra convenience charges may apply</li>
            <li>⚠️ Please keep exact change ready</li>
          </ul>
        </div>
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={paymentData.cod.confirmed}
            onChange={(e) => handleInputChange("confirmed", e.target.checked)}
          />
          <span className="checkmark"></span>I confirm to pay ₹
          {orderTotal.toLocaleString()} in cash upon delivery
        </label>
        {errors.cod_confirm && (
          <span className="error-message">{errors.cod_confirm}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="payment-widget">
      <div className="payment-header">
        <h3>Payment Method</h3>
        <div className="security-badge">🔒 256-bit SSL Encrypted</div>
      </div>

      <div className="payment-methods">
        {Object.entries(paymentMethods).map(([method, config]) => {
          if (!allowedMethods.includes(method)) return null;

          return (
            <div
              key={method}
              className={`payment-method ${
                selectedMethod === method ? "selected" : ""
              }`}
              onClick={() => handleMethodSelect(method)}
            >
              <div className="method-info">
                <span className="method-icon">{config.icon}</span>
                <div className="method-details">
                  <span className="method-label">{config.label}</span>
                  <span className="method-description">
                    {config.description}
                  </span>
                </div>
              </div>
              <div className="method-radio">
                <input
                  type="radio"
                  name="payment-method"
                  checked={selectedMethod === method}
                  onChange={() => handleMethodSelect(method)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="payment-form-container">
        {selectedMethod === "card" && renderCardForm()}
        {selectedMethod === "upi" && renderUPIForm()}
        {selectedMethod === "netbanking" && renderNetBankingForm()}
        {selectedMethod === "wallet" && renderWalletForm()}
        {selectedMethod === "cod" && renderCODForm()}
      </div>

      <div className="payment-footer">
        <div className="total-amount">
          <span>Total Amount: ₹{orderTotal.toLocaleString()}</span>
        </div>
        <button
          className="pay-now-btn"
          onClick={processPayment}
          disabled={!validatePaymentMethod() || isProcessing}
        >
          {isProcessing
            ? "Processing..."
            : selectedMethod === "cod"
            ? "Place Order"
            : `Pay ₹${orderTotal.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentWidget;
