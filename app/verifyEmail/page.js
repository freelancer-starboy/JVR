'use client'
import React, { useEffect, useState } from 'react';


const EmailVerified = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="custom-email-container">
      <div className={`custom-email-card ${isVisible ? 'custom-email-visible' : ''}`}>
        {/* Top Rainbow Border */}
        <div className="custom-email-rainbow-border-top"></div>

        {/* Success Circle */}
        <div className="custom-email-success-wrapper">
          <div className="custom-email-success-circle">
            <div className="custom-email-success-inner">
              <div className="custom-email-checkmark">✓</div>
            </div>
          </div>
          
          {/* Floating Dots */}
          <div className="custom-email-dots">
            <div className="custom-email-dot custom-email-dot-1"></div>
            <div className="custom-email-dot custom-email-dot-2"></div>
            <div className="custom-email-dot custom-email-dot-3"></div>
            <div className="custom-email-dot custom-email-dot-4"></div>
          </div>
        </div>

        <h1 className="custom-email-title">
          Welcome to JVR Family!
        </h1>
        
        <h2 className="custom-email-subtitle">
          Email Verified Successfully!
        </h2>
        
        <p className="custom-email-text">
          We're thrilled to have you join our community. Your email has been verified, 
          and you're now ready to begin your amazing journey with us! ✨
        </p>
        
        <div className="custom-email-buttons">
          <button className="custom-email-button-primary">
            Start Exploring
          </button>
          
          <button className="custom-email-button-secondary">
            Return to Home
          </button>
        </div>

        {/* Bottom Rainbow Border */}
        <div className="custom-email-rainbow-border-bottom"></div>
      </div>
    </div>
  );
};

export default EmailVerified;