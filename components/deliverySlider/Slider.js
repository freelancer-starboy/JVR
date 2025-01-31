import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  Home, 
  X 
} from 'lucide-react';

const DeliveryStatusSlider = ({ 
  status, 
  setTrackShipment,
  orderDetails 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const steps = {
    'processing': 0,
    'ordered': 0,
    'confirmed': 0,
    'dispatched': 1,
    'shipped': 1,
    'out_for_delivery': 2,
    'delivered': 3
  };

  const currentStep = steps[status.toLowerCase()] || 0;

  const statusDetails = [
    { 
      icon: Package, 
      label: 'Ordered' 
    },
    { 
      icon: CheckCircle, 
      label: 'Dispatched' 
    },
    { 
      icon: Truck, 
      label: 'Out for Delivery' 
    },
    { 
      icon: Home, 
      label: 'Delivered' 
    }
  ];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setTrackShipment(false), 300);
  };

  return (
    <div 
      className={`delivery-status-overlay ${isVisible ? 'visible' : ''}`}
      onClick={handleClose}
    >
      <div 
        className={`delivery-status-container ${isVisible ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="delivery-status-close" 
          onClick={handleClose}
        >
          <X size={24} />
        </button>

        <div className="delivery-status-header">
          <h2 className="delivery-status-title">Delivery Status</h2>
          <p className="delivery-status-current">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
        </div>

        <div className="delivery-status-progress">
          <div 
            className="delivery-status-progress-bar"
            style={{
              width: `${(currentStep / (statusDetails.length - 1)) * 100}%`
            }}
          />
        </div>

        <div className="delivery-status-steps">
          {statusDetails.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;

            return (
              <div 
                key={step.label} 
                className={`delivery-status-step ${isActive ? 'active' : ''}`}
              >
                <div className="delivery-status-step-icon">
                  <Icon size={24} />
                </div>
                <span className="delivery-status-step-label">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryStatusSlider;