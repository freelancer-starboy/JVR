import Link from "next/link";
import CartShow from "../elements/CartShow";
import WishListShow from "../elements/WishListShow";

export default function HeaderTabSticky({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {
  return (
    <>
      <div
        id="header-tab-sticky"
        className={`tp-md-lg-header d-none d-md-block d-xl-none pt-30 pb-30 ${
          scroll ? "header-sticky" : ""
        }`}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-4 d-flex align-items-center">
              <div className="header-canvas ">
                <button className="tp-menu-toggle" onClick={handleMobileMenu}>
                  <i className="far fa-bars" />
                </button>
              </div>
              <div
                className="logo"
                style={{ width: "auto", height: "3rem", display: "flex" }}
              >
                <Link href="/">
                  <img
                    style={{
                      width: "auto",
                      height: "3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    src="/assets/css/images/jvr-logo-3.png"
                    alt="logo"
                  />
                </Link>
              </div>
            </div>
            <div className="col-lg-9 col-md-8 d-flex justify-content-end align-items-center">
              <div className="header-meta-info d-flex  justify-content-end">
                <div className="header-search-bar">
                  <form action="#">
                    <div className="search-info p-relative">
                      <button className=" mt-3 header-search-icon">
                        <i />
                      </button>
                      <input type="text" placeholder="Search " />
                    </div>
                  </form>
                </div>
                <div className="header-meta__social d-flex align-items-center ml-25">
                  <button
                    className="header-cart p-relative tp-cart-toggle"
                    onClick={handleCartSidebar}
                  >
                    <i className="fal fa-shopping-cart" />
                    <CartShow />
                  </button>
                  <Link href="/user">
                    <i className="fal fa-user" />
                  </Link>
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
    </>
  );
}
