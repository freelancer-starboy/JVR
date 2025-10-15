import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-area black-bg-2 pt-65">
        <div className="container">
          <div className="main-footer pb-15 mb-30">
            <div className="row">

              {/* COMPANY INFO */}
              <div className="col-lg-3 col-md-6">
                <div className="footer-widget mb-40">
                  <div className="logo" style={{ height: "5rem" }}>
                    <Link href="/">
                      <img src="/assets/css/images/jvr-logo-3.png" alt="JVR Logo" style={{ height: "100%" }} />
                    </Link>
                  </div>
                  <p className="mt-3">
                    Wear your style — shop the latest trends in fashion.
                  </p>
                </div>

                <div>
                  
                </div>
              </div>

              {/* CUSTOMER SERVICE */}
              <div className="col-lg-2 col-md-6 ">
                <div className="footer-widget mb-40">
                  <h4 className="footer-widget__title mb-10 text-white">Customer Service</h4>
                  <ul className="footer-widget__links text-white hover:text-gray-300">
                    <li className="mb-2"><Link href="/contact">Contact Us</Link></li>
                    <li className="mb-2"><Link href="#">FAQs</Link></li>
                    <li className="mb-2"><Link href="/returns">Returns & Exchanges</Link></li>
                    <li className="mb-2"><Link href="/shipping">Shipping Info</Link></li>
                    <li className="mb-2"><Link href="/track-order">Track Your Order</Link></li>
                    <li className="mb-2"><Link href="/size-guide">Size Guide</Link></li>
                  </ul>
                </div>
              </div>

              {/* MY ACCOUNT */}
              <div className="col-lg-2 col-md-6">
                <div className="footer-widget mb-40 text-white hover:text-gray-300">
                  <h4 className="footer-widget__title mb-10">My Account</h4>
                  <ul className="footer-widget__links text-white hover:text-gray-300">
                    <li className="mb-2"><Link href="/login">Login / Register</Link></li>
                    <li className="mb-2"><Link href="/myOrders">Order History</Link></li>
                    <li className="mb-2"><Link href="/wishlist">Wishlist</Link></li>
                    <li className="mb-2"><Link href="/privacy-policy">Privacy Policy</Link></li>
                    <li className="mb-2"><Link href="/termsAndConditions">Terms & Conditions</Link></li>
                  </ul>
                </div>
              </div>

              {/* CATEGORIES / POPULAR */}
              <div className="col-lg-2 col-md-6">
                <div className="footer-widget mb-40">
                  <h4 className="footer-widget__title mb-10 text-white hover:text-gray-300">Shop Categories</h4>
                  <ul className="footer-widget__links text-white hover:text-gray-300">
                    <li className="mb-2"><Link href="/shop">Shirts</Link></li>
                    <li className="mb-2"><Link href="/shop">T-Shirts</Link></li>
                    <li className="mb-2"><Link href="/shop">Jeans & Pants</Link></li>
                    <li className="mb-2"><Link href="/shop">Kurtis</Link></li>
                    <li className="mb-2"><Link href="/shop">Sarees</Link></li>
                    <li className="mb-2"><Link href="/shop">Western Wear</Link></li>
                    <li className="mb-2"><Link href="/shop">Blazers</Link></li>
                  </ul>
                </div>
              </div>

              {/* SOCIAL & CONTACT */}
              <div className="col-lg-3 col-md-6">
                <div className="footer-widget mb-40">
                  <h4 className="footer-widget__title mb-30 text-white hover:text-gray-300">Connect With Us</h4>
                  <ul className="footer-widget__links text-white hover:text-gray-300">
                    <li className="mb-2"><Link href="#"><i className="fab fa-facebook-f" /> Facebook</Link></li>
                    <li className="mb-2"><Link href="#"><i className="fab fa-instagram" /> Instagram</Link></li>
                    <li className="mb-2"><Link href="#"><i className="fab fa-whatsapp" /> WhatsApp</Link></li>
                  </ul>
                  <div className="footer-cta__contact mt-3">
                    <i className="far fa-phone" /> <Link href="tel:+919943933092">+91 99439 33092</Link>
                  </div>
                </div>
              </div>

            </div>

            {/* NEWSLETTER */}
            <div className="row mt-30 text-white hover:text-gray-300">
              <div className="col-md-6">
                <h5 className="footer-widget__title mb-2 text-white hover:text-gray-300" >Subscribe to our Newsletter</h5>
                <p className="text-white hover:text-gray-300">Get the latest updates, offers, and styles right to your inbox.</p>
                <form className="newsletter-form mt-2">
                  <input type="email" placeholder="Enter your email" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>



            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="footer-copyright black-bg-2">
            <div className="container text-center py-3">
              <span>
                © {new Date().getFullYear()} <Link href="/">SRI JVR</Link>. Swipe, Shop, Trend and Repeat.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
