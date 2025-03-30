import { useRelatedProductsQuery } from "@/features/api/productApi";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const HeaderItems = () => {
  const [menCategory, setMenCategory] = useState(null);
  const [womenCategory, setWomenCategory] = useState(null);
  const [kidsCategory, setKidsCategory] = useState(null);

  const { data: mens } = useRelatedProductsQuery("mens");
  const { data: women } = useRelatedProductsQuery("women");
  const { data: kids } = useRelatedProductsQuery("kids");

  useEffect(() => {
    if (mens && women && kids) {
      setMenCategory(mens);
      setWomenCategory(women);
      setKidsCategory(kids);
      console.log("men category : ", mens);
    }
  }, [mens, women, kids]);
  return (
    <ul className="">
      <li className="">
        <Link href="/">Home</Link>
      </li>

      <li className="has-dropdown has-megamenu">
        <Link href="/about">Shop</Link>
        <ul className="submenu mega-menu">
          <li>
            <a href="/user" className="mega-menu-title">
              Mens
            </a>
            <ul>
              {[
                ...new Set(menCategory?.map((product) => product.productType)),
              ].map((type, index) => (
                <li key={index}>
                  <Link href={`/shop-2?category=${type}`}>{type}</Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <a className="mega-menu-title">Women</a>
            <ul>
              {[
                ...new Set(
                  womenCategory?.map((product) => product.productType)
                ),
              ].map((type, index) => (
                <li key={index}>
                  <Link href={`/shop-2?category=${type}`}>{type}</Link>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <a className="mega-menu-title">Kids</a>
            <ul>
              {[
                ...new Set(kidsCategory?.map((product) => product.productType)),
              ].map((type, index) => (
                <li key={index}>
                  <Link href={`/shop-2?category=${type}`}>{type}</Link>
                </li>
              ))}
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
