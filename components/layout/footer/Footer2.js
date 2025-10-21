import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-5">
      <div className="container">
        <div className="row mb-4">

          {/* Logo Section */}
          <div className="col-md-3 mb-4">
            <img src="/assets/img/logo/footer-logo.png" alt="JVR Logo" style={{ height: "60px", width: "auto" }} />
            <p className="text-muted small mt-2 hover-link">
              Quality fashion for everyone. Comfort meets style.
            </p>
          </div>

          {/* Support Links */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold text-uppercase text-white mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/contact" legacyBehavior>
                  <a className="text-muted text-decoration-none hover-link">Contact Us</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/faqs" legacyBehavior>
                  <a className="text-muted text-decoration-none hover-link">FAQs</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/myOrders" legacyBehavior>
                  <a className="text-muted text-decoration-none hover-link">Track Order</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/terms-and-conditions" legacyBehavior>
                  <a className="text-muted text-decoration-none hover-link">Terms and Conditions</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/privacy-policy" legacyBehavior>
                  <a className="text-muted text-decoration-none hover-link">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold text-uppercase text-white mb-3">Shop</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/shop-2?category=mens" legacyBehavior>
                  <a className="text-muted text-decoration-none hover-link">Men</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/shop-2?category=women" legacyBehavior>
                  <a className="text-muted text-decoration-none hover-link">Women</a>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/shop-2?category=kids" legacyBehavior>
                  <a className="text-muted text-decoration-none hover-link">Kids</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold text-uppercase text-white mb-3">Contact</h5>
            <p className="text-muted small mb-2 hover-link">
              <i className="fas fa-phone me-2 "></i>+91 99439 33092
            </p>
            <p className="text-muted small mb-3 hover-link">
              <i className="fas fa-envelope me-2"></i>sreejvrtexttiles@gmail.com
            </p>
            <div className="d-flex gap-3">
              {/* External links can keep plain <a> */}
              <Link href="#" className="text-muted text-decoration-none hover-link">
                <i className="fab fa-facebook"></i>
              </Link>
              <Link href="#" className="text-muted text-decoration-none hover-link">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link href="#" className="text-muted text-decoration-none hover-link">
                <i className="fab fa-whatsapp"></i>
              </Link>
            </div>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center hover-link">
          <p className="text-muted small mb-0 hover-link">
            © {new Date().getFullYear()} JVR Textiles. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        .hover-link {
          transition: color 0.3s ease;
          color: grey !important;
        }
        .hover-link:hover {
          color: white !important;
        }
      `}</style>
    </footer>
  );
}
