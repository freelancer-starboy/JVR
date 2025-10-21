import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/layout/Layout";

export default function PrivacyPolicy() {
  return (
    <>
      <Layout headerStyle={3} footerStyle={1}>
        <Head>
          <title>Privacy Policy | SHREE JVR TEXTILES</title>
          <meta
            name="description"
            content="Read the privacy policy of SHREE JVR TEXTILES and learn how we handle and protect your personal information."
          />
        </Head>

        <section className=" bg-light">
          <div className="terms-and-conditions-container ">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="bg-white  p-md-5 rounded shadow-sm ">
                  
                  {/* Header */}
                  <div className="terms-and-conditions-header">
                    <h1 className="terms-and-conditions-title">
                      Privacy Policy
                    </h1>
                    <p className="lead text-muted">
                      At <strong>SHREE JVR TEXTILES</strong>, we are dedicated to respecting and protecting your privacy. We are committed to handling your personal information with transparency, care, and in compliance with all applicable data protection laws.
                    </p>
                  </div>

                  {/* Content */}
                  <div className="mb-5">
                    <p className="text-muted mb-3">
                      We follow best practices to ensure that your personal data is secure and only used for relevant and appropriate purposes. Our objective is to be responsible, secure, and relevant when managing any data you provide.
                    </p>

                    <p className="text-muted mb-3">
                      We do not share your personal information—such as your name, email address, postal address, or contact number—with any third parties. If we believe a product, service, or offer may be of interest to you, we will contact you directly using the information you have willingly shared with us. We do not store personal data through cookies, nor do we link your data to any third-party services for profiling or advertising.
                    </p>
                  </div>

                  {/* Section: Data Collection */}
                  <div className="mb-5 ">
                    <h3 className="h5 fw-bold text-dark mb-3">
                      We collect limited data solely for the following purposes:
                    </h3>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item border-0 px-0 py-2 text-muted">
                        <i className="fas fa-check text-success me-2"></i>
                        Managing the technical performance of our website
                      </li>
                      <li className="list-group-item border-0 px-0 py-2 text-muted">
                        <i className="fas fa-check text-success me-2"></i>
                        Enhancing your browsing experience
                      </li>
                      <li className="list-group-item border-0 px-0 py-2 text-muted">
                        <i className="fas fa-check text-success me-2"></i>
                        Delivering customer service
                      </li>
                      <li className="list-group-item border-0 px-0 py-2 text-muted">
                        <i className="fas fa-check text-success me-2"></i>
                        Promoting SHREE JVR TEXTILES products or services
                      </li>
                    </ul>
                  </div>

                  {/* Additional Sections */}
                  <div className="mb-5">
                    <p className="text-muted mb-3">
                      If we ever intend to use your data for new purposes not outlined in this policy, we will seek your permission beforehand.
                    </p>

                    <p className="text-muted mb-3">
                      We may disclose your personal information if required by law or to enforce our terms and policies. This may include sharing data with agencies for fraud prevention or credit risk assessment.
                    </p>

                    <p className="text-muted mb-3">
                      Please note that while we make every effort to protect your information, no method of online data transmission is completely secure. Therefore, submitting information through our website is at your own discretion and risk.
                    </p>

                    <p className="text-muted">
                      If at any point you wish to update your details or have your data removed entirely from our systems, please feel free to get in touch with us through our{" "}
                      <Link href="/contact" className="text-decoration-none text-primary fw-semibold">
                        contact page
                      </Link>.
                    </p>
                  </div>

                  {/* Back Button */}
                  <div className="text-center mt-5 pt-4 border-top">
                    <Link
                      href="/"
                      className="btn btn-outline-dark"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}