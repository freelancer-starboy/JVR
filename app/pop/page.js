'use client';

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import style from "../../public/assets/css/order.css"; 
const statuses = ["Processing", "Packed", "Dispatched", "Delivered"];

export default function OrderTracker() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSliderChange = (e) => {
        setCurrentIndex(parseInt(e.target.value));
    };

    return (
        <div className="order-tracker">
            <div className="order-container">
                <h1 className="order-title">Order Processing</h1>

                <div className="order-box">
                    <div className="status-header">
                        <div className="status-indicator"></div>
                        <h2>{statuses[currentIndex]}</h2>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-track">
                        <div className="progress-bar" style={{ width: `${(currentIndex + 1) * 25}%` }}>
                            <div className="shimmer"></div>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="status-grid">
                        {statuses.map((status, index) => (
                            <div key={index} className={`status-item ${index <= currentIndex ? "active" : ""}`}>
                                <CheckCircle2 className="status-icon" />
                                <span>{status}</span>
                            </div>
                        ))}
                    </div>

                    {/* Range Input */}
                    <input type="range" min="0" max="3" value={currentIndex} onChange={handleSliderChange} className="status-slider" />
                </div>
            </div>
        </div>
    );
}
