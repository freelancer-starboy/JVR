import Link from "next/link"

export default function Footer2() {
    return (
      <>
        <footer>
          <div className="footer-area secondary-footer black-bg-2 pt-65">
            <div className="container">
              <div className="main-footer pb-15 mb-30">
                <div className="row">
                  <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="footer-widget footer-col-1 mb-40">
                      <div
                        className="logo"
                        style={{
                          width: "auto",
                          height: "5rem",
                          display: "flex",
                        }}
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
                      <div className="footer-content mt-3">
                        <p>
                          Wear your style — shop the latest trends in fashion.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="footer-widget footer-col-2 ml-30 mb-40">
                      <h4 className="footer-widget__title mb-30">
                        Information
                      </h4>
                      <div className="footer-widget__links">
                        <ul>
                          <li>
                            <Link href="#">Custom Service</Link>
                          </li>
                          <li>
                            <Link href="#">FAQs</Link>
                          </li>
                          <li>
                            <Link href="/myOrders">Ordering Tracking</Link>
                          </li>
                          <li>
                            <Link href="/contact">Contacts</Link>
                          </li>
                       
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="footer-widget footer-col-3 mb-40">
                      <h4 className="footer-widget__title mb-30">My Account</h4>
                      <div className="footer-widget__links">
                        <ul>
                          <li>
                            <Link href="/contact">Delivery Infomation</Link>
                          </li>
                          <li>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                          </li>
                       
                          <li>
                            <Link href="#">Custom Service</Link>
                          </li>
                          <li>
                            <Link href="/termsAndConditions">
                              Terms & Condition
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="footer-widget footer-col-4 mb-40">
                      <h4 className="footer-widget__title mb-30">
                        Social Network
                      </h4>
                      <div className="footer-widget__links">
                        <ul >
                          <li>
                            <Link href="#" className="footer-widgets" >
                              <i className="fab fa-facebook-f" />
                              Facebook
                            </Link>
                          </li>
                          <li>
                            <Link href="#">
                              <i className="fab fa-instagram" />
                              Instagram
                            </Link>
                          </li>
                          <li>
                            <Link href="#">
                              <i className="fab fa-whatsapp" />
                              Whatsapp
                            </Link>
                          </li>
                         
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-8">
                    <div className="footer-widget footer-col-5 mb-40">
                      <h4 className="footer-widget__title mb-30">
                        Popular Keywords
                      </h4>
                      <div className="footer-widget__links keyword">
                        <Link href="/shop">Shirts</Link>
                        <Link href="/shop">Pants</Link>
                        <Link href="/shop">T-Shirts</Link>
                        <Link href="/shop">Kurthi</Link>
                        <Link href="/shop">Sarees</Link>
                        <Link href="/shop">Western Wear</Link>
                        <Link href="/shop">Ethnic Sets</Link>
                        <Link href="/shop">T-Shirts</Link>
                        <Link href="/shop">Jeans & Pants</Link>
                        <Link href="/shop">Blazers</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-cta pb-20">
                <div className="row justify-content-between">
                  <div className="col-xl-6 col-lg-4 col-md-4 col-sm-6">
                    <div className="footer-cta__contact">
                      <div className="footer-cta__icon">
                        <i className="far fa-phone" />
                      </div>
                      <div className="footer-cta__text">
                        <Link href="/tel:+91 99439 33092">+91 99439 33092</Link>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-xl-6 col-lg-8 col-md-8 col-sm-6">
                                    <div className="footer-cta__source">
                                        <div className="footer-cta__source-content">
                                            <h4 className="footer-cta__source-title">Download App on Mobile</h4>
                                            <p>15% discount on your first purchase</p>
                                        </div>
                                        <div className="footer-cta__source-thumb">
                                            <Link href="#"><img src="/assets/img/footer/f-google.jpg" alt="google" /></Link>
                                            <Link href="#"><img src="/assets/img/footer/f-app.jpg" alt="app" /></Link>
                                        </div>
                                    </div>
                                </div> */}
                </div>
              </div>
            </div>
            <div className="footer-copyright black-bg-2">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-xl-10 col-lg-7 col-md-5">
                    <div className="footer-copyright__content">
                      <span>
                        Copyright <Link href="/">© SRI JVR</Link>
                        <Link href="/"> . Swipe,Shop,Trend and Repeat</Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
}
