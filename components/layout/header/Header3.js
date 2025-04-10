"use client";
import CartShow from "@/components/elements/CartShow";
import WishListShow from "@/components/elements/WishListShow";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

export default function Header3({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {
  const { userId } = useAuth();
  const [userName, setUserName] = useState(null);
  const [toggledLogout, setToggledLogout] = useState(false);
  const auth = getAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const router = useRouter();
  const searchContainerRef = useRef(null);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName);
      }
    });
    return () => unsubscribe();
  }, [userId, auth]);

  // Handle clicks outside of search container
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [deleteCookies] = useDeleteTokenMutation();

  const [isToggled, setToggled] = useState(false);
  const handleToggle = () => setToggled(!isToggled);

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

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { data: searchItems } = useSearchItemsQuery(debounce, {
    skip: !debounce || debounce.trim() === "",
  });

  const { data : wordsSearch } = useWordsSearchQuery()
  const handleProductClick = (id) => {
    router.push(`/ShopDetails/${id}`);
    setShowResults(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    router.push(`/shop-2?search=${encodeURIComponent(suggestion)}`);
    setShowResults(false);
  };

  return (
    <>
      <header>
        {/* Header Top Section */}
        <div className="header-top tertiary-header-top space-bg">
          <div className="container">
            <div className="row">
              <div className="col-xl-7 col-lg-12 col-md-12 ">
                <div className="header-welcome-text">
                  <span>From the Hills of Ooty, Woven with Love. </span>
                  <Link href="/shop-2">
                    Shop Now
                    <i className="fal fa-long-arrow-right" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-5 d-none d-xl-block">
                <div className="headertoplag d-flex align-items-center justify-content-end">
                  <div className="headertoplag__lang">
                    <ul>
                      <li className="profile-container">
                        <Link
                          href={userId ? "#" : "/sign-in"}
                          onClick={(e) => {
                            if (userId) {
                              e.preventDefault();
                              // handle any additional click actions if needed
                            }
                          }}
                          className="position-relative"
                        >
                          <i className="fal fa-user" />
                          {userId && userName ? userName : "Login"}
                        </Link>

                        {/* Logout button will appear on hover */}
                        {userId && (
                          <div className="dropdown-menu">
                            <button
                              onClick={handleLogout}
                              className="dropdown-item d-flex align-items-center"
                            >
                              <i className="fal fa-sign-out mr-2" />
                              Logout
                            </button>
                          </div>
                        )}

                        <Link className="order-tick" href="/myOrders">
                          <i className="fal fa-plane-departure" />
                          Track Your Order
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="menu-top-social">
                    <Link href="#">
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-twitter" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-youtube" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-linkedin" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo and Search Bar Section */}
        <div className="mt-20 d-none d-xl-block">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2">
                <div
                  className="logo"
                  style={{
                    width: "3rem",
                    height: "3rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link href="/">
                    <img
                      style={{
                        width: "auto",
                        height: "3rem",
                        display: "block",
                      }}
                      src="/assets/css/images/jvr-logo-3.png"
                      alt="logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="col-xl-10 col-lg-9">
                <div className="header-meta-info d-flex align-items-center justify-content-end">
                  <div>
                    <div className="position-relative w-100" ref={searchContainerRef}>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                        onFocus={() => setShowResults(true)}
                        style={{ minWidth: "300px" }}
                      />

                      {/* Search Results Dropdown */}
                      {((showResults && debounce && searchItems?.products?.length > 0) ||
                        (showResults && searchItems?.wordSuggestions?.length > 0)) && (
                        <div className="dropdown-menu show position-absolute w-100">
                          {/* Word suggestions section */}
                          {searchItems?.wordSuggestions?.length > 0 && (
                            <div className="p-2 border-bottom">
                              <div className="small font-weight-bold text-muted mb-1">
                                <span>Search Suggestions</span>
                              </div>
                              {searchItems.wordSuggestions.map(
                                (suggestion, index) => (
                                  <div
                                    key={`suggestion-${index}`}
                                    className="d-flex align-items-center py-1 px-2 suggestion-item"
                                    onClick={() =>
                                      handleSuggestionClick(suggestion)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i className="fal fa-search mr-2 text-secondary" />
                                    <span>{suggestion}</span>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* Products section */}
                          {searchItems?.products?.length > 0 && (
                            <div className="p-2">
                              <div className="small font-weight-bold text-muted mb-1">
                                <span>Products</span>
                              </div>
                              {searchItems.products.slice(0, 5).map((item) => (
                                <div
                                  key={item._id}
                                  className="d-flex align-items-center py-1 px-2 product-item"
                                  onClick={() => handleProductClick(item._id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <img
                                    src={item.productVariants?.[0]?.images?.[0]}
                                    alt={item.productName}
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      objectFit: "cover",
                                      marginRight: "8px",
                                    }}
                                  />
                                  <span>{item.productName}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="header-meta header-brand d-flex align-items-center">
                    <div className="header-meta__social d-flex align-items-center ml-25">
                      <button
                        className="header-cart p-relative tp-cart-toggle"
                        onClick={handleCartSidebar}
                      >
                        <i className="fal fa-shopping-cart" />
                        <CartShow />
                      </button>
                      {userId && userName ? (
                        <div className="custom-menu">
                          <Link href="/user">
                            <i className="fal fa-user text-success fw-bolder" />
                          </Link>
                        </div>
                      ) : (
                        <Link href="/sign-in">
                          <i className="fal fa-user" />
                        </Link>
                      )}

                      <Link
                        href="/wishlist"
                        className="header-cart p-relative tp-cart-toggle"
                      >
                        <i className="fal fa-heart" />
                        <WishListShow />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu Area */}
        <div className="main-menu-area tertiary-main-menu mt-20 d-none d-xl-block">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-3">
                <div className="cat-menu__category p-relative">
                  <a onClick={handleToggle} href="#">
                    <i className="fal fa-bars" />
                    Categories
                  </a>
                  <div
                    className="category-menu"
                    style={{ display: `${isToggled ? "block" : "none"}` }}
                  >
                    <ul className="cat-menu__list">
                      <li>
                        <Link href="/shop-2?category=mens">
                          <i className="fal fa-tshirt" /> Mens
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2?category=women">
                          <i className="fal fa-female" /> Women
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2?shopCategory=kids">
                          <i className="fal fa-child" /> Kids
                        </Link>
                      </li>
                    </ul>
                    <div className="coupon-offer d-flex align-items-center justify-content-between">
                      <span>
                        Coupon: <Link href="/shop">WELCOMEJVR</Link>
                      </span>
                      <Link href="#">
                        <i
                          className="fal fa-copy"
                          onClick={() => {
                            navigator.clipboard.writeText("WELCOMEJVR");
                            toast.success("Copied to clipboard");
                          }}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-7 col-lg-6">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <HeaderItems />
                  </nav>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3">
                <div className="menu-contact">
                  <ul>
                    <li>
                      <div className="menu-contact__item">
                        <div className="menu-contact__icon">
                          <i className="fal fa-phone" />
                        </div>
                        <div className="menu-contact__info">
                          <Link href="tel:9943933092">+91 99439 33092</Link>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="menu-contact__item">
                        <div className="menu-contact__icon">
                          <i className="fal fa-map-marker-alt" />
                        </div>
                        <div className="menu-contact__info">
                          <Link
                            target="_blank"
                            href="https://www.google.com/maps/place/SRI+JVR+TEXTILES/@11.4744836,73.9416017,8z/data=!4m10!1m2!2m1!1sjvr+textiles!3m6!1s0x3ba61f6912412f27:0x3e8682c2757f270f!8m2!3d11.4744836!4d76.3805665!15sCgxqdnIgdGV4dGlsZXNaDiIManZyIHRleHRpbGVzkgEOY2xvdGhpbmdfc3RvcmWaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVTnFhRFZFVERGUlJSQULgAQD6AQQIABAQ!16s%2Fg%2F11sszrq395?entry=ttu&g_ep=EgoyMDI1MDEyNy4wIKXMDSoASAFQAw%3D%3D"
                          >
                            Find Store
                          </Link>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Header Components */}
      <HeaderSticky
        scroll={scroll}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
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