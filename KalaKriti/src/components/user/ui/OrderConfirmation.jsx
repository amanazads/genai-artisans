import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = ({
  orderData = null,
  onOrderComplete,
  showContinueShopping = true,
}) => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    if (orderData) {
      setOrderDetails(orderData);
      setIsLoading(false);
      generateTrackingInfo(orderData);
    } else {
      // Mock order data if none provided
      setTimeout(() => {
        const mockOrder = generateMockOrder();
        setOrderDetails(mockOrder);
        setIsLoading(false);
        generateTrackingInfo(mockOrder);
      }, 1000);
    }
  }, [orderData]);

  const generateMockOrder = () => {
    const orderId = `KK${Date.now().toString().slice(-8)}`;
    return {
      id: orderId,
      order_number: orderId,
      status: "confirmed",
      total_amount: 4500,
      payment_method: "card",
      estimated_delivery: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      delivery_address: {
        full_name: "John Doe",
        address_line1: "123 Main Street",
        address_line2: "Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      },
      items: [
        {
          id: "1",
          title: "Handcrafted Pottery Vase",
          price: 2500,
          quantity: 1,
          image: "/api/placeholder/150/150?text=Vase",
          artisan: "Rajesh Kumar",
        },
        {
          id: "2",
          title: "Traditional Textile Art",
          price: 2000,
          quantity: 1,
          image: "/api/placeholder/150/150?text=Textile",
          artisan: "Priya Sharma",
        },
      ],
      created_at: new Date().toISOString(),
    };
  };

  const generateTrackingInfo = (order) => {
    const trackingId = `TRK${order.id}${Math.random()
      .toString(36)
      .slice(-4)
      .toUpperCase()}`;
    setTrackingInfo({
      tracking_id: trackingId,
      courier_partner: "KalaKriti Express",
      estimated_delivery: order.estimated_delivery,
      current_status: "Order Confirmed",
      timeline: [
        {
          status: "Order Placed",
          timestamp: new Date(),
          completed: true,
          description: "Your order has been successfully placed",
        },
        {
          status: "Payment Confirmed",
          timestamp: new Date(),
          completed: true,
          description: "Payment received and verified",
        },
        {
          status: "Being Prepared",
          timestamp: null,
          completed: false,
          description: "Artisan is preparing your order",
        },
        {
          status: "Shipped",
          timestamp: null,
          completed: false,
          description: "Order dispatched from artisan workshop",
        },
        {
          status: "Out for Delivery",
          timestamp: null,
          completed: false,
          description: "Order is out for delivery",
        },
        {
          status: "Delivered",
          timestamp: null,
          completed: false,
          description: "Order delivered successfully",
        },
      ],
    });
  };

  const handleContinueShopping = () => {
    if (onOrderComplete) {
      onOrderComplete();
    }
    navigate("/");
  };

  const handleTrackOrder = () => {
    navigate(`/orders/${orderDetails.id}`);
  };

  const handleDownloadInvoice = () => {
    // Mock invoice download
    const link = document.createElement("a");
    link.href = "#";
    link.download = `invoice-${orderDetails.order_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: "My KalaKriti Order",
        text: `I just ordered beautiful handcrafted items from KalaKriti! Order #${orderDetails.order_number}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `I just ordered beautiful handcrafted items from KalaKriti! Order #${orderDetails.order_number} - ${window.location.href}`
      );
      alert("Order details copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="order-confirmation loading">
        <div className="loading-content">
          <div className="spinner">⏳</div>
          <h2>Processing your order...</h2>
          <p>Please wait while we confirm your order details.</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="order-confirmation error">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2>Order Not Found</h2>
          <p>
            We couldn't find your order details. Please contact support if this
            issue persists.
          </p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✅</div>
        <h1>Order Confirmed!</h1>
        <p className="order-number">Order #{orderDetails.order_number}</p>
        <p className="thank-you-message">
          Thank you for supporting traditional artisans and choosing KalaKriti!
        </p>
      </div>

      <div className="confirmation-content">
        <div className="main-details">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {orderDetails.items.map((item, index) => (
                <div key={item.id || index} className="order-item">
                  <img
                    src={item.image || "/api/placeholder/80/80?text=Product"}
                    alt={item.title}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <p className="artisan">by {item.artisan}</p>
                    <p className="quantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>
                  ₹
                  {orderDetails.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final-total">
                <span>Total Paid:</span>
                <span>₹{orderDetails.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="delivery-info">
            <h3>Delivery Information</h3>
            <div className="delivery-address">
              <h4>Shipping Address</h4>
              <div className="address-details">
                <p className="recipient">
                  {orderDetails.delivery_address.full_name}
                </p>
                <p>{orderDetails.delivery_address.address_line1}</p>
                {orderDetails.delivery_address.address_line2 && (
                  <p>{orderDetails.delivery_address.address_line2}</p>
                )}
                <p>
                  {orderDetails.delivery_address.city},{" "}
                  {orderDetails.delivery_address.state}{" "}
                  {orderDetails.delivery_address.pincode}
                </p>
              </div>
            </div>

            <div className="delivery-estimate">
              <h4>Estimated Delivery</h4>
              <p className="delivery-date">{orderDetails.estimated_delivery}</p>
              <p className="delivery-note">
                📦 Your items will be carefully packaged by our artisan partners
              </p>
            </div>
          </div>
        </div>

        <div className="sidebar-details">
          {trackingInfo && (
            <div className="tracking-info">
              <h3>Order Tracking</h3>
              <div className="tracking-id">
                <strong>Tracking ID:</strong> {trackingInfo.tracking_id}
              </div>
              <div className="courier-info">
                <strong>Courier Partner:</strong> {trackingInfo.courier_partner}
              </div>

              <div className="order-timeline">
                <h4>Order Status</h4>
                {trackingInfo.timeline.map((step, index) => (
                  <div
                    key={index}
                    className={`timeline-step ${
                      step.completed ? "completed" : "pending"
                    }`}
                  >
                    <div className="step-indicator">
                      {step.completed ? "✅" : "⏳"}
                    </div>
                    <div className="step-content">
                      <h5>{step.status}</h5>
                      <p>{step.description}</p>
                      {step.timestamp && (
                        <span className="timestamp">
                          {new Date(step.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="payment-info">
            <h3>Payment Details</h3>
            <div className="payment-method">
              <strong>Payment Method:</strong>
              <span className="method-display">
                {orderDetails.payment_method === "card" &&
                  "💳 Credit/Debit Card"}
                {orderDetails.payment_method === "upi" && "📱 UPI"}
                {orderDetails.payment_method === "netbanking" &&
                  "🏦 Net Banking"}
                {orderDetails.payment_method === "wallet" &&
                  "👛 Digital Wallet"}
                {orderDetails.payment_method === "cod" && "💰 Cash on Delivery"}
              </span>
            </div>
            <div className="payment-status">
              <strong>Status:</strong>{" "}
              <span className="paid-status">✅ Paid</span>
            </div>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <div className="primary-actions">
          <button className="primary-btn" onClick={handleTrackOrder}>
            📦 Track Order
          </button>
          {showContinueShopping && (
            <button className="secondary-btn" onClick={handleContinueShopping}>
              🛍️ Continue Shopping
            </button>
          )}
        </div>

        <div className="secondary-actions">
          <button className="action-btn" onClick={handleDownloadInvoice}>
            📄 Download Invoice
          </button>
          <button className="action-btn" onClick={shareOrder}>
            📤 Share Order
          </button>
          <button className="action-btn" onClick={() => navigate("/support")}>
            💬 Contact Support
          </button>
        </div>
      </div>

      <div className="artisan-message">
        <div className="message-content">
          <h3>🎨 Supporting Artisan Communities</h3>
          <p>
            Your purchase directly supports traditional artisans and helps
            preserve India's rich cultural heritage. Thank you for making a
            difference!
          </p>
          <div className="impact-stats">
            <div className="stat">
              <strong>2 Artisans</strong>
              <span>benefited from your order</span>
            </div>
            <div className="stat">
              <strong>Traditional Crafts</strong>
              <span>preserved through your support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
