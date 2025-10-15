"use client";

import CartShow from "@/components/elements/CartShow";
import WishListShow from "@/components/elements/WishListShow";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMobSticky from "../HeaderMobSticky";
import HeaderSticky from "../HeaderSticky";
import HeaderTabSticky from "../HeaderTabSticky";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useDeleteTokenMutation } from "@/features/api/authApi";
import { toast } from "react-toastify";
import HeaderItems from "@/components/HeaderItems/HeaderItems";
import { useSearchItemsQuery, useWordsSearchQuery } from "@/features/api/searchApi";
import { useRouter } from "next/navigation";
import SidebarSearch from "../../SearchSidebar/Sidebar-Search";

export default function Header3({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {
  const { userId } = useAuth();
  const [userName, setUserName] = useState(null);
  const auth = getAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const router = useRouter();
  const [isSearchSidebar, setIsSearchSidebar] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserName(user.displayName);
    });
    return () => unsubscribe();
  }, [auth]);

  const [deleteCookies] = useDeleteTokenMutation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const response = await deleteCookies().unwrap();
      if (response.success) {
        toast.success("Logout Successful");
        window.location.reload();
      } else {
        toast.error("Logout Failed");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: searchItems } = useSearchItemsQuery(debounce, {
    skip: !debounce.trim(),
  });

  const { data: wordsSearch } = useWordsSearchQuery();

  const handleProductClick = (id) => {
    router.push(`/ShopDetails/${id}`);
    setIsSearchSidebar(false);
  };

  const handleSuggestionClick = (suggestion) => {
    router.push(`/shop-2?search=${encodeURIComponent(suggestion)}`);
    setIsSearchSidebar(false);
  };

  return (
    <>
      <header className="relative d-none d-xl-block">

        {/* Header Top */}
        <div className=" bg-black text-white">
          <div className="">
            <div className="row">
              <div className="col-md-12">
                <div className="header-welcome-text">
                  <marquee className="marquee-reverse">
                    <span>From the Hills of Ooty, Woven with Love.</span>
                  </marquee>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="all-section">
          <div className="flex text-end items-center text-[10px] gap-2 py-2">
            <Link href="/track" className="hover:underline mx-2">Track Order</Link>
            <span>|</span>
            <Link href="/store-locator" className="hover:underline mx-2">Store Locator</Link>
            <span>|</span>
            <Link href="/contact" className="hover:underline ms-2">Contact Us</Link>
          </div>
        </div>





        {/* Main Header */}
        <div className="top-stick top-0 z-50 bg-white py-2  xl:flex items-center border border-grey-200 " id="header-sticky">
          <div className="all-section">
            <div className="row align-items-center">
              {/* Logo */}
              <div className="col-xl-2 col-lg-2">
                <div className="logo d-flex justify-content-start align-items-center" style={{ height: "3rem" }}>
                  <Link href="/">
                    <img
                      src="/assets/css/images/jvr-logo-3.png"
                      alt="logo"
                      style={{ height: "3rem", width: "auto" }}
                    />
                  </Link>
                </div>
              </div>

              {/* Navigation */}
              <div className="col-xl-8 col-lg-6">
                <div className="main-menu d-flex justify-content-center">
                  <nav id="mobile-menu">
                    <HeaderItems />
                  </nav>
                </div>
              </div>

              {/* Right Icons */}
              <div className="col-xl-2 col-lg-4">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  {/* Search */}
                  <button
                    onClick={() => setIsSearchSidebar(true)}
                    className="d-flex align-items-center"

                  >
                    <i className="fal fa-search fs-5" />
                  </button>

                  <SidebarSearch
                    isOpen={isSearchSidebar}
                    onClose={() => setIsSearchSidebar(false)}
                    searchItems={searchItems}
                    wordsSearch={wordsSearch}
                    onProductClick={handleProductClick}
                    onSuggestionClick={handleSuggestionClick}
                  />

                  {/* Cart */}
                  <button className="header-cart p-relative tp-cart-toggle" onClick={handleCartSidebar}>
                    <i className="fal fa-shopping-cart fs-5" />
                    <CartShow />
                  </button>

                  {/* Profile */}
                  {userId && userName ? (
                    <div className="custom-menu user-dropdown">
                      <Link href="/user">
                        <i className="fal fa-user text-success fw-bolder" />
                      </Link>
                      <div className="user-dropdown-menu">
                        <Link href="/user">My Account</Link>
                        <Link href="/myOrders">My Orders</Link>
                        <button onClick={handleLogout} className="logout-btns">
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link href="/sign-in">
                      <i className="fal fa-user fs-5" />
                    </Link>
                  )}

                  {/* Wishlist */}
                  {/* <Link href="/wishlist" className="header-cart p-relative tp-cart-toggle">
                    <i className="fal fa-heart" />
                    <WishListShow />
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <HeaderSticky
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
        searchItems={searchItems}
        wordsSearch={wordsSearch}
        handleProductClick={handleProductClick}
        handleSuggestionClick={handleSuggestionClick}
      />

      {/* Sticky Headers */}
      <HeaderTabSticky
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
      <HeaderMobSticky
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
    </>
  );
}
