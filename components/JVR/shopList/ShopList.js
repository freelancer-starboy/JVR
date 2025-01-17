'use client';
import Link from 'next/link';
import { useState } from 'react';

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
}) => {
  const [value, setValue] = useState(0);

  // Calculate discount percentage
  let discount = 0;
  if (oldPrice > price) {
    discount = ((oldPrice - price) / oldPrice) * 100;
  }

  return (
    <>
      <div className="custom-product-card" key={id}>
        <Link href={`/ShopDetails/${id}`}>
          <div className="custom-product-image">
            <img src={thumb1} alt={name} />
          </div>
          <div className="custom-content-main">
            <h6>{brand}</h6>
            <h3 className="custom-product-title">{name}</h3>

            <p className="custom-product-price">
              ₹ <span>{price}</span>
              {oldPrice && (
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: 'gray',
                    fontSize: '1rem',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                  }}
                >
                  ₹{oldPrice}
                </span>
              )}
              {discount > 0 && (
                <span
                  style={{
                    color: '#866528',
                    fontSize: '1rem',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                  }}
                >
                  ({discount.toFixed(0)}% off)
                </span>
              )}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ShopList;
