import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/user/layout/UserLayout";
import CartSummary from "../../components/user/ui/CartSummary";
import AddressForm from "../../components/user/ui/AddressForm";
import PaymentWidget from "../../components/user/ui/PaymentWidget";
import OrderConfirmation from "../../components/user/ui/OrderConfirmation";
import CheckoutSteps from "../../components/user/ui/CheckoutSteps";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/user/userAPI";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalAmount, getTotalItems } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Address state
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Order state
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          returnUrl: "/checkout",
          message: "Please login to proceed with checkout",
        },
      });
      return;
    }

    if (!cart || cart.length === 0) {
      navigate("/cart");
      return;
    }

    initializeCheckout();
  }, [user, cart]);

  const initializeCheckout = async () => {
    try {
      setLoading(true);

      // Set cart items and calculate total
      setCartItems(cart);
      setTotalAmount(getTotalAmount());

      // Load saved addresses
      const addressResponse = await userAPI.getUserAddresses();
      if (addressResponse.success) {
        setSavedAddresses(addressResponse.data || []);

        // Select default address if available
        const defaultAddress = addressResponse.data?.find(
          (addr) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error("Error initializing checkout:", error);
      setError("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = (step) => {
    if (step <= currentStep + 1) {
      setCurrentStep(step);
    }
  };

  const handleCartUpdate = (updatedItems) => {
    setCartItems(updatedItems);
    setTotalAmount(
      updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  };

  const handleContinueFromCart = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    setCurrentStep(2);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsAddingNewAddress(false);
  };

  const handleNewAddressAdd = async (addressData) => {
    try {
      const response = await userAPI.addUserAddress(addressData);
      if (response.success) {
        const newAddress = response.data;
        setSavedAddresses((prev) => [...prev, newAddress]);
        setSelectedAddress(newAddress);
        setIsAddingNewAddress(false);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      setError("Failed to add address");
    }
  };

  const handleContinueFromAddress = () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
    setCurrentStep(3);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setPaymentLoading(true);

      const orderData = {
        items: cartItems,
        address: selectedAddress,
        paymentMethod,
        paymentData,
        totalAmount,
        totalItems: getTotalItems(),
      };

      const response = await userAPI.createOrder(orderData);

      if (response.success) {
        setOrderId(response.data.orderId);
        setOrderDetails(response.data);
        setCurrentStep(4);
        clearCart(); // Clear cart after successful order
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/orders/${orderId}`);
    }
  };

  const steps = [
    { number: 1, title: "Cart Review", icon: "🛒" },
    { number: 2, title: "Delivery Address", icon: "📍" },
    { number: 3, title: "Payment", icon: "💳" },
    { number: 4, title: "Confirmation", icon: "✅" },
  ];

  if (loading) {
    return (
      <UserLayout>
        <div className="checkout-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="checkout-page">
        <div className="checkout-container">
          <h1 className="checkout-title">Secure Checkout</h1>

          {/* Progress Steps */}
          <CheckoutSteps
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepChange}
          />

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
              <button className="error-close" onClick={() => setError(null)}>
                ×
              </button>
            </div>
          )}

          {/* Step Content */}
          <div className="checkout-content">
            {currentStep === 1 && (
              <CartSummary
                items={cartItems}
                onUpdateItems={handleCartUpdate}
                onContinue={handleContinueFromCart}
                showEditItems={true}
              />
            )}

            {currentStep === 2 && (
              <AddressForm
                savedAddresses={savedAddresses}
                selectedAddress={selectedAddress}
                onAddressSelect={handleAddressSelect}
                onNewAddressAdd={handleNewAddressAdd}
                isAddingNew={isAddingNewAddress}
                onToggleAddNew={() =>
                  setIsAddingNewAddress(!isAddingNewAddress)
                }
                onContinue={handleContinueFromAddress}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <PaymentWidget
                totalAmount={totalAmount}
                orderItems={cartItems}
                deliveryAddress={selectedAddress}
                onPaymentMethodSelect={handlePaymentMethodSelect}
                onPaymentSuccess={handlePaymentSuccess}
                onBack={() => setCurrentStep(2)}
                loading={paymentLoading}
              />
            )}

            {currentStep === 4 && (
              <OrderConfirmation
                orderId={orderId}
                orderDetails={orderDetails}
                onContinueShopping={handleContinueShopping}
                onViewOrder={handleViewOrder}
              />
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CheckoutPage;
