'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ShopList = ({
  id,
  name,
  thumb1,
  thumb2,
  description,
  price,
  category,
  type,
  brand,
  oldPrice,
  color,
  variants
}) => {
  const [hoveredColor, setHoveredColor] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  let discount = 0;
  if (oldPrice > price) {
    discount = ((oldPrice - price) / oldPrice) * 100;
  }

  return (
    <div 
      className="card h-100 border-0 shadow-sm position-relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2" 
      key={id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >


      <Link href={`/ShopDetails/${id}`} className="text-decoration-none">
        <div className="position-relative overflow-hidden tpproduct" style={{ maxHeight: '350px'}}>
        {/* {!isHovered && variants && variants.length > 0 && variants[0].images.length > 0 && ( */}

            <img
              src={variants[0].images[0]}
              alt={name}
              className="card-img-top"
              style={{ 
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
          {/* ) 
          } */}
          {/* {isHovered && variants && variants.length > 0 && variants[0].images.length > 0 && ( */}
            <div className='product-thumb-secondary'>

              <img
              
                src={variants[0].images[1]}
                alt={name}
                className="card-img-top"
                style={{ 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />
            </div>
          {/* )
          } */}
       
          {discount > 0 && (
            <div className="position-absolute top-0 start-0 m-2">
              <span className="badge bg-danger py-2 px-2 rounded-pill fw-normal" 
                    style={{ fontSize: '0.7rem' }}>
                {discount.toFixed(0)}% OFF
              </span>
            </div>
          )}
        </div>
        
        <div className="card-body p-2 p-md-3">
          <div className="mb-1 mb-md-2">
            <p className="text-muted mb-1 small text-uppercase" 
               style={{ fontSize: '0.7rem' }}>{brand}</p>
            <h5 className="card-title mb-1 text-dark fw-normal" 
                style={{ fontSize: '0.85rem' }}>
              {name}
            </h5>
          </div>
          
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-1 mb-md-0">
              <span className="fw-bold me-1" 
                    style={{ fontSize: '0.9rem', color: '#2c3e50' }}>₹{price}</span>
              {oldPrice && (
                <span className="text-muted text-decoration-line-through" 
                      style={{ fontSize: '0.75rem' }}>
                  ₹{oldPrice}
                </span>
              )}
            </div>
            
            {color && color.length > 0 && (
              <div className="d-flex gap-1 align-items-center">
                {color.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="rounded-circle border"
                    style={{ 
                      backgroundColor: item,
                      width: '1rem',
                      height: '1rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      transform: hoveredColor === index ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: hoveredColor === index ? '0 0 0 1px white, 0 0 0 2px ' + item : 'none'
                    }}
                    onMouseEnter={() => setHoveredColor(index)}
                    onMouseLeave={() => setHoveredColor(null)}
                  />
                ))}
                {color.length > 3 && (
                  <span className="small text-muted" 
                        style={{ fontSize: '0.7rem' }}>
                    +{color.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShopList;