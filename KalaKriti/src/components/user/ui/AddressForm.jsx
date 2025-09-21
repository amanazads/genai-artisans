import React, { useState, useEffect } from "react";
import "./AddressForm.css";

const AddressForm = ({
  initialAddress = {},
  onAddressChange,
  onValidationChange,
  showSavedAddresses = true,
  allowAddressBook = true,
}) => {
  const [address, setAddress] = useState({
    type: "home", // 'home', 'work', 'other'
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    landmark: "",
    is_default: false,
    ...initialAddress,
  });

  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
    "Andaman and Nicobar Islands",
  ];

  useEffect(() => {
    if (showSavedAddresses) {
      loadSavedAddresses();
    }
  }, [showSavedAddresses]);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(address);
    }
  }, [address, onAddressChange]);

  useEffect(() => {
    const isValid = validateForm();
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [address, onValidationChange]);

  const loadSavedAddresses = async () => {
    try {
      // Mock saved addresses - replace with actual API call
      const mockAddresses = [
        {
          id: "1",
          type: "home",
          full_name: "John Doe",
          phone: "9876543210",
          address_line1: "123 Main Street",
          address_line2: "Apartment 4B",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          country: "India",
          landmark: "Near City Mall",
          is_default: true,
        },
        {
          id: "2",
          type: "work",
          full_name: "John Doe",
          phone: "9876543210",
          address_line1: "456 Business District",
          address_line2: "Floor 12, Office 1201",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400051",
          country: "India",
          landmark: "Opposite Metro Station",
          is_default: false,
        },
      ];
      setSavedAddresses(mockAddresses);
    } catch (error) {
      console.error("Failed to load saved addresses:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!address.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!address.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(address.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!address.address_line1.trim()) {
      newErrors.address_line1 = "Address line 1 is required";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!address.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePincodeChange = async (pincode) => {
    handleInputChange("pincode", pincode);

    if (pincode.length === 6) {
      setIsValidating(true);
      try {
        // Mock pincode validation - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data for pincode lookup
        const mockPincodeData = {
          400001: { city: "Mumbai", state: "Maharashtra" },
          110001: { city: "New Delhi", state: "Delhi" },
          560001: { city: "Bangalore", state: "Karnataka" },
          600001: { city: "Chennai", state: "Tamil Nadu" },
          700001: { city: "Kolkata", state: "West Bengal" },
        };

        const pincodeData = mockPincodeData[pincode];
        if (pincodeData) {
          setAddress((prev) => ({
            ...prev,
            city: pincodeData.city,
            state: pincodeData.state,
          }));
        }
      } catch (error) {
        console.error("Pincode validation failed:", error);
      } finally {
        setIsValidating(false);
      }
    }
  };

  const selectSavedAddress = (savedAddress) => {
    const { id, ...addressData } = savedAddress;
    setAddress(addressData);
    setShowAddressBook(false);
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "home":
        return "🏠";
      case "work":
        return "🏢";
      default:
        return "📍";
    }
  };

  return (
    <div className="address-form">
      <div className="form-header">
        <h3>Delivery Address</h3>
        {allowAddressBook && savedAddresses.length > 0 && (
          <button
            className="address-book-btn"
            onClick={() => setShowAddressBook(!showAddressBook)}
          >
            📋 Address Book ({savedAddresses.length})
          </button>
        )}
      </div>

      {showAddressBook && (
        <div className="address-book">
          <h4>Saved Addresses</h4>
          <div className="saved-addresses">
            {savedAddresses.map((savedAddr) => (
              <div
                key={savedAddr.id}
                className={`saved-address ${
                  savedAddr.is_default ? "default" : ""
                }`}
                onClick={() => selectSavedAddress(savedAddr)}
              >
                <div className="address-header">
                  <span className="address-type">
                    {getAddressTypeIcon(savedAddr.type)}{" "}
                    {savedAddr.type.charAt(0).toUpperCase() +
                      savedAddr.type.slice(1)}
                  </span>
                  {savedAddr.is_default && (
                    <span className="default-badge">Default</span>
                  )}
                </div>
                <div className="address-content">
                  <p className="recipient">
                    {savedAddr.full_name} • {savedAddr.phone}
                  </p>
                  <p className="address-text">
                    {savedAddr.address_line1},{" "}
                    {savedAddr.address_line2 && `${savedAddr.address_line2}, `}
                    {savedAddr.city}, {savedAddr.state} {savedAddr.pincode}
                  </p>
                  {savedAddr.landmark && (
                    <p className="landmark">📍 {savedAddr.landmark}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form className="address-input-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address-type">Address Type</label>
            <select
              id="address-type"
              value={address.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
            >
              <option value="home">🏠 Home</option>
              <option value="work">🏢 Work</option>
              <option value="other">📍 Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="full-name">Full Name *</label>
            <input
              type="text"
              id="full-name"
              value={address.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className={errors.full_name ? "error" : ""}
              placeholder="Enter your full name"
            />
            {errors.full_name && (
              <span className="error-message">{errors.full_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              value={address.phone}
              onChange={(e) =>
                handleInputChange(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              className={errors.phone ? "error" : ""}
              placeholder="10-digit mobile number"
              maxLength="10"
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="address-line1">Address Line 1 *</label>
            <input
              type="text"
              id="address-line1"
              value={address.address_line1}
              onChange={(e) =>
                handleInputChange("address_line1", e.target.value)
              }
              className={errors.address_line1 ? "error" : ""}
              placeholder="House/Flat No., Building Name, Street"
            />
            {errors.address_line1 && (
              <span className="error-message">{errors.address_line1}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="address-line2">Address Line 2</label>
            <input
              type="text"
              id="address-line2"
              value={address.address_line2}
              onChange={(e) =>
                handleInputChange("address_line2", e.target.value)
              }
              placeholder="Area, Colony, Sector (Optional)"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pincode">Pincode *</label>
            <div className="pincode-input">
              <input
                type="text"
                id="pincode"
                value={address.pincode}
                onChange={(e) =>
                  handlePincodeChange(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                className={errors.pincode ? "error" : ""}
                placeholder="6-digit pincode"
                maxLength="6"
              />
              {isValidating && <span className="validation-spinner">⏳</span>}
            </div>
            {errors.pincode && (
              <span className="error-message">{errors.pincode}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              value={address.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={errors.city ? "error" : ""}
              placeholder="Enter city"
            />
            {errors.city && (
              <span className="error-message">{errors.city}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="state">State *</label>
            <select
              id="state"
              value={address.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className={errors.state ? "error" : ""}
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && (
              <span className="error-message">{errors.state}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              value={address.country}
              readOnly
              className="readonly"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="landmark">Landmark</label>
            <input
              type="text"
              id="landmark"
              value={address.landmark}
              onChange={(e) => handleInputChange("landmark", e.target.value)}
              placeholder="Nearby landmark for easy delivery (Optional)"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={address.is_default}
                onChange={(e) =>
                  handleInputChange("is_default", e.target.checked)
                }
              />
              <span className="checkmark"></span>
              Make this my default address
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
