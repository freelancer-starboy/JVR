import Link from "next/link";
import CartShow from "../elements/CartShow";

export default function HeaderMobSticky({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {
  return (
    <>
      <div
        id="header-mob-sticky"
        className={`tp-md-lg-header d-md-none pt-20 pb-20 ${
          scroll ? "header-sticky" : ""
        }`}
      >
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-4 d-flex justify-content-center align-items-center">
              <div className="header-canvas flex-auto">
                <button className="tp-menu-toggle" onClick={handleMobileMenu}>
                  <i className="far fa-bars" />
                </button>
              </div>
            </div>
            <div className="col-4">
              <div
                className="logo"
                style={{
                  width: "auto",
                  height: "5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
            <div className="col-4 m-0 d-flex justify-content-center align-items-center">
              <div className="header-meta-info d-flex align-items-center justify-content-end ml-25">
                <div className="header-meta m-0 d-flex align-items-center">
                  <div className="header-meta__social d-flex align-items-center">
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
