"use client";
import Link from "next/link";
import CartShow from "../elements/CartShow";
import WishListShow from "../elements/WishListShow";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HeaderItems from "../HeaderItems/HeaderItems";

export default function HeaderSticky({
  scroll,
  isCartSidebar,
  handleCartSidebar,
}) {
  const { userId } = useAuth();
  const [userName, setUserName] = useState(null);
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

  return (
    <>
      <div
        id="header-sticky"
        className={`logo-area tp-sticky-one mainmenu-5 ${
          scroll ? "header-sticky" : ""
        }`}
      >
        <div className="container ">
          <div className="row align-items-center m-0 justify-content-between d-flex ">
            <div className="col-xl-2 col-lg-3 ">
              <div className="">
                <Link href="/">
                  <img
                    className="logo-image"
                    src="/assets/css/images/jvr-logo-3.png"
                    alt="logo"
                    style={{
                      width: "auto",
                      height: "3rem",
                      display: "block",
                    }}
                  />
                </Link>
              </div>
            </div>
            <div className="col-xl-6 col-lg-2 ">
              <div className="main-menu">
                <nav id="mobile-menu ">
                  <HeaderItems />
                </nav>
              </div>
            </div>
            <div className="col-xl-4 col-lg-3 col-md-4 col-sm-5 col-6">
              <div className=" d-flex align-items-center ">
                <div className="header-meta__social d-flex align-items-center">
                  <button
                    className="header-cart p-relative tp-cart-toggle"
                    onClick={handleCartSidebar}
                  >
                    <i className="fal fa-shopping-cart" />
                    <CartShow />
                  </button>
                  {userId && userName ? (
                    <Link href="/user">
                      <i className="fal fa-user text-success fw-bolder" />
                    </Link>
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
                <div className="header-meta__search-5 ml-25 w-100">
                  <div className="header-search-bar-5">
                    <form action="#">
                      <div className="search-info-5 p-relative">
                        <button className="header-search-icon-5">
                          <i className="fal " />
                        </button>
                        <input type="text" placeholder="Search products..." />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
