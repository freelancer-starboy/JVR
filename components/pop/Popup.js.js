'use client';

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, X } from "lucide-react";
import { AiFillCheckCircle } from "react-icons/ai";

const statuses = {
    Processing: "0",
    Packed : "1",
    Dispatched: "2",
    Delivered: "3",
};

export default function OrderTracker({ status }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);


    // Close modal on "Esc" key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);
    useEffect(() => {
        setCurrentIndex(Object.keys(statuses).indexOf(status));
    }, [status])

    return (
        <div className="popup-container">
            {/* Button to open modal */}
            <button className="track-button" onClick={() => setIsOpen(true)}>
                Track Order
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button className="close-button" onClick={() => setIsOpen(false)}>
                            <X size={24} />
                        </button>

                        <h1 className="order-title">Order Status</h1>

                        <div className="order-box">
                            <div className="status-header">
                                <div className="status-indicator"></div>
                                <h2>{status}</h2>
                            </div>

                            {/* Progress Bar */}
                            <div className="progress-track">
                                <div className="progress-bar" style={{ width: `${(currentIndex + 1) * 25}%` }}>
                                    <div className="shimmer"></div>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="status-grid">
                                {Object.entries(statuses).map(([status, key], index) => (
                                    <div key={index} className={`status-item ${index <= currentIndex ? "active" : ""}`}>
                                        {index <= currentIndex ? <AiFillCheckCircle style={{ color: "#4CAF50" }} className="status-icon" /> : <CheckCircle2 className="status-icon" />}
                                        <span>{status}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Range Input */}
                            <input type="range" min="0" max="3" value={Object.keys(statuses).indexOf(status)}  className="status-slider" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
