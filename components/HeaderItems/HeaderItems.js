import { useRelatedProductsQuery } from "@/features/api/productApi";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const HeaderItems = () => {
  const [menCategory, setMenCategory] = useState([]);
  const [womenCategory, setWomenCategory] = useState([]);
  const [kidsCategory, setKidsCategory] = useState([]);

  const { data: mens, error: mensError } = useRelatedProductsQuery("mens");
  const { data: women, error: womenError } = useRelatedProductsQuery("women");
  const { data: kids, error: kidsError } = useRelatedProductsQuery("kids");

  useEffect(() => {
    // Only set state if data is fetched successfully
    if (mens) setMenCategory(mens);
    if (women) setWomenCategory(women);
    if (kids) setKidsCategory(kids);
  }, [mens, women, kids]);

  // Error handling - can display an error message or fallback UI
  if (mensError || womenError || kidsError) {
    return (
      <ul>
        <li>Error loading categories. Please try again later.</li>
      </ul>
    );
  }

  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>

      <li className="has-dropdown has-megamenu">
        <Link href="/shop-2">Shop</Link>
        <ul className="submenu mega-menu">
          <li>
            <a href="/shop-2?category=mens" className="mega-menu-title">
              Mens
            </a>
            <ul>
              {menCategory.length > 0 ? (
                [
                  ...new Set(menCategory.map((product) => product.productType)),
                ].map((type, index) => (
                  <li key={index}>
                    <Link href={`/shop-2?category=${type}`}>{type}</Link>
                  </li>
                ))
              ) : (
                <li>No products available</li>
              )}
            </ul>
          </li>
          <li>
            <a className="mega-menu-title">Women</a>
            <ul>
              {womenCategory.length > 0 ? (
                [
                  ...new Set(
                    womenCategory.map((product) => product.productType)
                  ),
                ].map((type, index) => (
                  <li key={index}>
                    <Link href={`/shop-2?category=${type}`}>{type}</Link>
                  </li>
                ))
              ) : (
                <li>No products available</li>
              )}
            </ul>
          </li>

          <li>
            <a className="mega-menu-title">Kids</a>
            <ul>
              {kidsCategory.length > 0 ? (
                [
                  ...new Set(
                    kidsCategory.map((product) => product.productType)
                  ),
                ].map((type, index) => (
                  <li key={index}>
                    <Link href={`/shop-2?category=${type}`}>{type}</Link>
                  </li>
                ))
              ) : (
                <li>No products available</li>
              )}
            </ul>
          </li>
        </ul>
      </li>

      <li className="has-dropdown">
        <Link href="/shop">Direct Links</Link>
        <ul className="submenu">
          <li>
            <Link href="/user">My Account</Link>
          </li>
          <li>
            <Link href="/myOrders">My Orders</Link>
          </li>
          <li>
            <Link href="/security">Authentication Settings</Link>
          </li>
          <li>
            <Link href="/termsAndConditions">Terms and conditions</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      </li>

      <li>
        <Link href="/contact">Contact</Link>
      </li>
    </ul>
  );
};

export default HeaderItems;
