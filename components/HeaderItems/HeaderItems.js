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
    if (mens) setMenCategory(mens);
    if (women) setWomenCategory(women);
    if (kids) setKidsCategory(kids);
  }, [mens, women, kids]);

  // Handle errors gracefully
  if (mensError || womenError || kidsError) {
    return (
      <ul>
        <li>Error loading categories. Please try again later.</li>
      </ul>
    );
  }

  // Helper to get unique product types
  const getUniqueTypes = (products) =>
    [...new Set(products.map((product) => product.productType))];

  return (
    <ul className="">
      {/* Home */}
      <li className="">
        <Link href="/" className=" text-decoration-none">Home</Link>
      </li>

      {/* Mens */}
      <li className="has-dropdown margin-20">
        <Link href="/shop-2?category=mens" className=" text-decoration-none">Mens</Link>
        <ul className="submenu ">
          {menCategory.length > 0 ? (
            getUniqueTypes(menCategory).map((type, index) => (
              <li key={index}>
                <Link href={`/shop-2?category=${type}`}>{type}</Link>
              </li>
            ))
          ) : (
            <li className="">No mens products</li>
          )}
        </ul>
      </li>

      {/* Womens */}
      <li className="has-dropdown">
        <Link href="/shop-2?category=women" className=" text-decoration-none">Womens</Link>
        <ul className="submenu">
          {womenCategory.length > 0 ? (
            getUniqueTypes(womenCategory).map((type, index) => (
              <li key={index}>
                <Link href={`/shop-2?category=${type}`}>{type}</Link>
              </li>
            ))
          ) : (
            <li>No womens products</li>
          )}
        </ul>
      </li>

      {/* Kids */}
      <li className="has-dropdown">
        <Link href="/shop-2?category=kids" className=" text-decoration-none">Kids</Link>
        <ul className="submenu">
          {kidsCategory.length > 0 ? (
            getUniqueTypes(kidsCategory).map((type, index) => (
              <li key={index}>
                <Link href={`/shop-2?category=${type}`}>{type}</Link>
              </li>
            ))
          ) : (
            <li>No kids products</li>
          )}
        </ul>
      </li>

      {/* Contact */}
      <li>
        <Link href="/contact" className=" text-decoration-none">Contact</Link>
      </li>
    </ul>
  );
};

export default HeaderItems;
