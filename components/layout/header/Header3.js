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
import { set } from "mongoose";
import { useDeleteTokenMutation } from "@/features/api/authApi";
import { toast } from "react-toastify";

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
  const [isOpen, setIsOpen] = useState(false);
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName);
        console.log(user.displayName);
      }
    });
    return () => unsubscribe();
  }, [userId]);
    const [deleteCookies ] = useDeleteTokenMutation()
  
  const [isToggled, setToggled] = useState(false);
  const handleToggle = () => setToggled(!isToggled);
  const handleLogout = async() => {
      try {
        await signOut(auth)
        const response = await deleteCookies().unwrap()
        if (response.success) {
          toast.success('Logout Successful')
          window.location.reload()
        }else{
          toast.error('Logout Failed')
        }
      } catch (error) {
        console.error('Error during sign-out:', error);
        
      }
    }
  return (
    <>
      <header>
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
                      <li>
                        <Link
                          href={userId ? "#" : "/sign-in"}
                          onClick={(e) => {
                            if (userId) {
                              e.preventDefault(); // Prevent navigation when user is logged in
                              setToggledLogout((prev) => !prev);
                            }
                          }}
                          className="position-relative"
                        >
                          <i className="fal fa-user" />
                          {userId && userName ? userName : "Login"}
                        </Link>

                        {userId && toggledLogout && (
                          <div className="custom-logout-container">
                            <span className="fal fa-logout"></span>
                            <button onClick={handleLogout}>Logout</button>
                          </div>
                        )}

                        <Link className="order-tick" href="#">
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
                      <i className="fab fa-behance" />
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
        <div className="logo-area green-logo-area mt-30 d-none d-xl-block">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2">
                <div
                  className="logo"
                  style={{ width: "auto", height: "5rem", display: "flex" }}
                >
                  <Link href="/">
                    <img
                      style={{
                        width: "auto",
                        height: "5rem",
                        display: "block",
                      }}
                      src="/assets/css/images/jvr-logo-3.png"
                      alt="logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="col-xl-10 col-lg-9">
                <div className="header-meta-info d-flex align-items-center justify-content-between">
                  <div className="header-search-bar">
                    <form action="#">
                      <div className="search-info p-relative">
                        <button className="header-search-icon">
                          <i className="fal fa-search" />
                        </button>
                        <input type="text" placeholder="Search products..." />
                      </div>
                    </form>
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
        <div className="main-menu-area tertiary-main-menu mt-25 d-none d-xl-block">
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
                        <Link href="/shop-2">
                          <i className="fal fa-chair" /> Furniture
                        </Link>
                      </li>
                      <li className="menu-item-has-children">
                        <Link href="/shop">
                          <i className="far fa-campfire" />
                          Cooking{" "}
                        </Link>
                        <ul className="submenu">
                          <li>
                            <Link href="/shop-2">Chair</Link>
                          </li>
                          <li>
                            <Link href="/shop-2">Table</Link>
                          </li>
                          <li>
                            <Link href="/shop">Wooden</Link>
                          </li>
                          <li>
                            <Link href="/shop">furniture</Link>
                          </li>
                          <li>
                            <Link href="/shop">Clock</Link>
                          </li>
                          <li>
                            <Link href="/shop">Gifts</Link>
                          </li>
                          <li>
                            <Link href="/shop">Crafts</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-shoe-prints" />
                          Accessories
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-tshirt" />
                          Fashion
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-clock" />
                          Clocks
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-light-ceiling" />
                          Lighting
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-gift" />
                          Toys
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-basketball-ball" />
                          Hand Made
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-gift" />
                          Minimalism
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-lightbulb-dollar" />
                          Electronics
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop-2">
                          <i className="fal fa-car-alt" />
                          Cars
                        </Link>
                      </li>
                    </ul>
                    <div className="coupon-offer d-flex align-items-center justify-content-between">
                      <span>
                        Coupon: <Link href="/shop">Offers50</Link>
                      </span>
                      <Link href="#">
                        {" "}
                        <i className="fal fa-copy" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-7 col-lg-6">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-dropdown">
                        <Link href="/">Home</Link>
                        <ul className="submenu">
                          <li>
                            <Link href="/">Wooden Home</Link>
                          </li>
                          <li>
                            <Link href="/index-2">Fashion Home</Link>
                          </li>
                          <li>
                            <Link href="/index-3">Furniture Home</Link>
                          </li>
                          <li>
                            <Link href="/index-4">Cosmetics Home</Link>
                          </li>
                          <li>
                            <Link href="/index-5">Food Grocery</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="has-dropdown">
                        <Link href="/shop">Shop</Link>
                        <ul className="submenu">
                          <li>
                            <Link href="/shop">Shop</Link>
                          </li>
                          <li>
                            <Link href="/shop-2">Shop 2</Link>
                          </li>
                          <li>
                            <Link href="/shop-details">Shop Details </Link>
                          </li>
                          <li>
                            <Link href="/shop-details-2">Shop Details 2</Link>
                          </li>
                          <li>
                            <Link href="/shop-location">Shop Location</Link>
                          </li>
                          <li>
                            <Link href="/cart">Cart</Link>
                          </li>
                          <li>
                            <Link href="/sign-in">Sign In</Link>
                          </li>
                          <li>
                            <Link href="/checkout">Checkout</Link>
                          </li>
                          <li>
                            <Link href="/wishlist">Wishlist</Link>
                          </li>
                          <li>
                            <Link href="/track">Product Track</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="has-dropdown has-megamenu">
                        <Link href="/about">Pages</Link>
                        <ul className="submenu mega-menu">
                          <li>
                            <a className="mega-menu-title">Page layout</a>
                            <ul>
                              <li>
                                <Link href="/shop">Shop filters v1</Link>
                              </li>
                              <li>
                                <Link href="/shop-2">Shop filters v2</Link>
                              </li>
                              <li>
                                <Link href="/shop-details">Shop sidebar</Link>
                              </li>
                              <li>
                                <Link href="/shop-details-2">
                                  Shop Right sidebar
                                </Link>
                              </li>
                              <li>
                                <Link href="/shop-location">
                                  Shop List view
                                </Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a className="mega-menu-title">Page layout</a>
                            <ul>
                              <li>
                                <Link href="/about">About</Link>
                              </li>
                              <li>
                                <Link href="/cart">Cart</Link>
                              </li>
                              <li>
                                <Link href="/checkout">Checkout</Link>
                              </li>
                              <li>
                                <Link href="/sign-in">Sign In</Link>
                              </li>
                              <li>
                                <Link href="/sign-in">Log In</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a className="mega-menu-title">Page type</a>
                            <ul>
                              <li>
                                <Link href="/track">Product Track</Link>
                              </li>
                              <li>
                                <Link href="/wishlist">Wishlist</Link>
                              </li>
                              <li>
                                <Link href="/not-found">404 / Error</Link>
                              </li>
                              <li>
                                <Link href="/coming-soon">Coming Soon</Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li className="has-dropdown">
                        <Link href="/blog">Blog</Link>
                        <ul className="submenu">
                          <li>
                            <Link href="/blog">Blog</Link>
                          </li>
                          <li>
                            <Link href="/blog-details">Blog Details</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/contact">Contact</Link>
                      </li>
                    </ul>
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
                          <Link href="/tel:0123456">908. 408. 501. 89</Link>
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
