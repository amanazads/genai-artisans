import React from "react";
import "./CheckoutSteps.css";

const CheckoutSteps = ({
  currentStep = 1,
  onStepClick,
  allowStepNavigation = false,
  completedSteps = [],
  steps = [
    {
      id: 1,
      label: "Cart Review",
      icon: "🛒",
      description: "Review your items",
    },
    { id: 2, label: "Delivery", icon: "📦", description: "Shipping address" },
    { id: 3, label: "Payment", icon: "💳", description: "Payment method" },
    { id: 4, label: "Confirmation", icon: "✅", description: "Order complete" },
  ],
}) => {
  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) {
      return "completed";
    } else if (stepId === currentStep) {
      return "active";
    } else if (stepId < currentStep) {
      return "completed";
    } else {
      return "pending";
    }
  };

  const handleStepClick = (stepId) => {
    if (allowStepNavigation && onStepClick) {
      // Only allow navigation to completed steps or current step
      if (stepId <= currentStep || completedSteps.includes(stepId)) {
        onStepClick(stepId);
      }
    }
  };

  const isStepClickable = (stepId) => {
    return (
      allowStepNavigation &&
      (stepId <= currentStep || completedSteps.includes(stepId))
    );
  };

  return (
    <div className="checkout-steps">
      <div className="steps-container">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = isStepClickable(step.id);
          const isLastStep = index === steps.length - 1;

          return (
            <div key={step.id} className="step-wrapper">
              <div
                className={`step ${status} ${isClickable ? "clickable" : ""}`}
                onClick={() => handleStepClick(step.id)}
                role={isClickable ? "button" : "listitem"}
                tabIndex={isClickable ? 0 : -1}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleStepClick(step.id);
                  }
                }}
                aria-label={`Step ${step.id}: ${step.label} - ${status}`}
              >
                <div className="step-indicator">
                  <div className="step-icon">
                    {status === "completed" ? "✓" : step.icon}
                  </div>
                  <div className="step-number">{step.id}</div>
                </div>

                <div className="step-content">
                  <h3 className="step-label">{step.label}</h3>
                  <p className="step-description">{step.description}</p>
                </div>

                {status === "active" && (
                  <div className="step-pulse">
                    <div className="pulse-ring"></div>
                  </div>
                )}
              </div>

              {!isLastStep && (
                <div
                  className={`step-connector ${
                    index < currentStep - 1 ? "completed" : ""
                  }`}
                >
                  <div className="connector-line"></div>
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
        <div className="progress-text">
          Step {currentStep} of {steps.length}
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="mobile-step-indicator">
        <div className="current-step">
          <span className="step-icon-mobile">
            {steps[currentStep - 1]?.icon}
          </span>
          <div className="step-info-mobile">
            <h4>{steps[currentStep - 1]?.label}</h4>
            <p>{steps[currentStep - 1]?.description}</p>
          </div>
        </div>

        <div className="step-dots">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`step-dot ${getStepStatus(step.id)}`}
              onClick={() => handleStepClick(step.id)}
            ></div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="step-navigation">
        {currentStep > 1 && allowStepNavigation && (
          <button
            className="nav-btn prev-btn"
            onClick={() => handleStepClick(currentStep - 1)}
            aria-label="Go to previous step"
          >
            ← Previous
          </button>
        )}

        <div className="step-status-text">
          {currentStep === 1 && "Review your cart items"}
          {currentStep === 2 && "Enter delivery address"}
          {currentStep === 3 && "Choose payment method"}
          {currentStep === 4 && "Order confirmation"}
        </div>

        {currentStep < steps.length && allowStepNavigation && (
          <button
            className="nav-btn next-btn"
            onClick={() => handleStepClick(currentStep + 1)}
            aria-label="Go to next step"
          >
            Next →
          </button>
        )}
      </div>

      {/* Estimated Time */}
      <div className="estimated-time">
        <div className="time-info">
          <span className="time-icon">⏱️</span>
          <span className="time-text">
            {currentStep === 1 && "Est. 2 minutes remaining"}
            {currentStep === 2 && "Est. 1-2 minutes remaining"}
            {currentStep === 3 && "Est. 1 minute remaining"}
            {currentStep === 4 && "Order completed!"}
          </span>
        </div>

        {currentStep < steps.length && (
          <div className="security-badge">🔒 Secure Checkout</div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
