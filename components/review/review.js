'use client'

import { useState, useEffect, useRef } from 'react';

const ReviewDisplay = ({ reviews }) => {
  // Set the first review as the current review initially
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Ref for timer to allow cleanup
  const slideTimerRef = useRef(null);
  
  // Interval duration in milliseconds
  const slideInterval = 5000; // 5 seconds per slide
  
  // Auto-sliding effect
  useEffect(() => {
    // Clear any existing timer when component mounts or dependencies change
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
    }
    
    // Only set timer if playing and we have multiple reviews
    if (isPlaying && reviews && reviews.length > 1) {
      slideTimerRef.current = setInterval(() => {
        setCurrentReviewIndex(prevIndex => (prevIndex + 1) % reviews.length);
      }, slideInterval);
    }
    
    // Cleanup timer when component unmounts
    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [isPlaying, reviews]);
  
  // Pause auto-slide when modal is open
  useEffect(() => {
    if (showModal) {
      setIsPlaying(false);
    }
  }, [showModal]);

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // Navigate to next review
  const handleNextReview = () => {
    // Clear timer to prevent double transitions
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
    }
    
    setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    
    // Reset timer after manual navigation if playing
    if (isPlaying) {
      slideTimerRef.current = setInterval(() => {
        setCurrentReviewIndex(prevIndex => (prevIndex + 1) % reviews.length);
      }, slideInterval);
    }
  };

  // Navigate to previous review
  const handlePrevReview = () => {
    // Clear timer to prevent double transitions
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
    }
    
    setCurrentReviewIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    
    // Reset timer after manual navigation if playing
    if (isPlaying) {
      slideTimerRef.current = setInterval(() => {
        setCurrentReviewIndex(prevIndex => (prevIndex + 1) % reviews.length);
      }, slideInterval);
    }
  };

  // Handle thumbnail click
  const handleImageClick = (index) => {
    setActiveImageIndex(index);
    setShowModal(true);
  };

  // Navigate to next image in modal
  const handleNextImage = (e) => {
    e.stopPropagation();
    const images = reviews[currentReviewIndex].imageUrls || [];
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Navigate to previous image in modal
  const handlePrevImage = (e) => {
    e.stopPropagation();
    const images = reviews[currentReviewIndex].imageUrls || [];
    setActiveImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Early return if no reviews
  if (!reviews || reviews.length === 0) {
    return <div>No reviews available.</div>;
  }

  return (
    <div className="review-slider-container">
      {/* Slider Header with Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold">Customer Reviews ({reviews.length})</h5>
        <div className="slider-controls d-flex align-items-center">
          <button 
            className="btn btn-sm btn-outline-dark me-2"
            onClick={handlePrevReview}
            disabled={reviews.length <= 1}
          >
            <span>&lsaquo;</span>
          </button>
          
          {/* Play/Pause Button */}
          <button 
            className={`btn btn-sm ${isPlaying ? 'btn-dark' : 'btn-outline-dark'} me-2`}
            onClick={togglePlayPause}
            disabled={reviews.length <= 1}
          >
            <span>{isPlaying ? '❚❚' : '▶'}</span>
          </button>
          
          <span className="mx-2 text-center" style={{ minWidth: '40px' }}>
            {currentReviewIndex + 1} / {reviews.length}
          </span>
          
          <button 
            className="btn btn-sm btn-outline-dark ms-2"
            onClick={handleNextReview}
            disabled={reviews.length <= 1}
          >
            <span>&rsaquo;</span>
          </button>
        </div>
      </div>

      {/* Review Slides Container */}
      <div className="review-slides-container position-relative">
        {/* Current Review Display */}
        <div 
          className="review-slide"
          style={{
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <div
            className="border-0 p-4 rounded shadow-sm"
            style={{
              backgroundColor: "#f8f9fa",
              borderLeft: "4px solid #000",
            }}
          >
            <div className="d-flex mb-3 align-items-center">
              <div className="reviewer-avatar me-3">
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px" }}
                >
                  <span className="fw-bold">
                    {reviews[currentReviewIndex].user.slice(0, 1).toUpperCase() +
                      reviews[currentReviewIndex].user.slice(1, 2).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h6 className="mb-0 fw-bold">
                  {reviews[currentReviewIndex].user}
                </h6>
                <div className="d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#000" }}>
                      {i < reviews[currentReviewIndex].rating ? "★" : "☆"}
                    </span>
                  ))}

                  <small className="text-muted ms-2">
  {new Date(reviews[currentReviewIndex].createdAt).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',

  })}

                  </small>
                  <span className="badge bg-dark text-white ms-2">
                    Verified Purchase
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced image gallery section */}
            {reviews[currentReviewIndex].imageUrls?.length > 0 && (
              <div className="review-images-container mt-3 mb-4">
                <h6 className="mb-2 fw-bold">Images from this review</h6>
                <div className="d-flex flex-wrap gap-2">
                  {reviews[currentReviewIndex].imageUrls.map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="review-image-wrapper rounded-3 overflow-hidden shadow-sm position-relative" 
                      style={{ 
                        width: "80px", 
                        height: "80px",
                        cursor: "pointer",
                        transition: "transform 0.3s"
                      }}
                      onClick={() => handleImageClick(index)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`review-image-${index}`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                      <div 
                        className="position-absolute top-0 end-0 bg-dark text-white rounded-bottom-start px-2 py-1" 
                        style={{ fontSize: "10px", opacity: 0.8 }}
                      >
                        {index + 1}/{reviews[currentReviewIndex].imageUrls.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mb-3">
              {reviews[currentReviewIndex].comment}
            </p>
          </div>
        </div>
      </div>

      {/* Review Progress Indicators */}
      {reviews.length > 1 && (
        <div className="review-progress mt-4">
          <div className="d-flex justify-content-center gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                className="p-0 border-0 bg-transparent"
                onClick={() => {
                  setCurrentReviewIndex(index);
                  // Pause auto-slide when manually selecting a slide
                  setIsPlaying(false);
                }}
                aria-label={`Go to review ${index + 1}`}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: index === currentReviewIndex ? "#000" : "#ccc",
                    transition: "all 0.3s ease"
                  }}
                ></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal for full size image */}
      {showModal && reviews[currentReviewIndex].imageUrls?.length > 0 && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: "rgba(0,0,0,0.9)", 
            zIndex: 1050,
            cursor: "pointer"
          }}
          onClick={handleCloseModal}
        >
          {/* Close button */}
          <button 
            className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
            onClick={handleCloseModal}
            style={{ fontSize: "24px" }}
          ></button>

          {/* Image container */}
          <div 
            className="position-relative"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={reviews[currentReviewIndex].imageUrls[activeImageIndex]}
              alt={`review-full-image-${activeImageIndex}`}
              style={{ 
                maxWidth: "100%", 
                maxHeight: "85vh",
                objectFit: "contain",
                border: "2px solid white"
              }}
            />
            
            {/* Navigation buttons */}
            {reviews[currentReviewIndex].imageUrls.length > 1 && (
              <>
                <button 
                  className="btn btn-dark position-absolute top-50 start-0 translate-middle-y rounded-circle"
                  style={{ 
                    width: "40px", 
                    height: "40px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginLeft: "-20px",
                    opacity: 0.8 
                  }}
                  onClick={handlePrevImage}
                >
                  <span>&lsaquo;</span>
                </button>
                
                <button 
                  className="btn btn-dark position-absolute top-50 end-0 translate-middle-y rounded-circle"
                  style={{ 
                    width: "40px", 
                    height: "40px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginRight: "-20px",
                    opacity: 0.8 
                  }}
                  onClick={handleNextImage}
                >
                  <span>&rsaquo;</span>
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div 
              className="position-absolute bottom-0 start-50 translate-middle-x bg-dark text-white px-3 py-2 rounded-top"
              style={{ opacity: 0.8 }}
            >
              {activeImageIndex + 1} / {reviews[currentReviewIndex].imageUrls.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;