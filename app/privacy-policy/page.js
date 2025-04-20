import Head from "next/head";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | SHREE JVR TEXTILES</title>
        <meta
          name="description"
          content="Read the privacy policy of SHREE JVR TEXTILES and learn how we handle and protect your personal information."
        />
      </Head>

      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="bg-white shadow-md rounded-xl max-w-3xl w-full p-8 sm:p-10 lg:p-12">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Privacy Policy</h2>

          <p className="mb-4 text-gray-700 mt-3">
            At <strong>SHREE JVR TEXTILES</strong>, we are dedicated to respecting and protecting your privacy.
            We are committed to handling your personal information with transparency, care, and in compliance with all applicable data protection laws.
          </p>

          <p className="mb-4 text-gray-700">
            We follow best practices to ensure that your personal data is secure and only used for relevant and appropriate purposes.
            Our objective is to be responsible, secure, and relevant when managing any data you provide.
          </p>

          <p className="mb-4 text-gray-700">
            We do not share your personal information—such as your name, email address, postal address, or contact number—with any third parties.
            If we believe a product, service, or offer may be of interest to you, we will contact you directly using the information you have willingly shared with us.
            We do not store personal data through cookies, nor do we link your data to any third-party services for profiling or advertising.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">We collect limited data solely for the following purposes:</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1 ms-4">
            <li>Managing the technical performance of our website</li>
            <li>Enhancing your browsing experience</li>
            <li>Delivering customer service</li>
            <li>Promoting SHREE JVR TEXTILES products or services</li>
          </ul>

          <p className="mb-4 text-gray-700 mt-2">
            If we ever intend to use your data for new purposes not outlined in this policy, we will seek your permission beforehand.
          </p>

          <p className="mb-4 text-gray-700">
            We may disclose your personal information if required by law or to enforce our terms and policies.
            This may include sharing data with agencies for fraud prevention or credit risk assessment.
          </p>

          <p className="mb-4 text-gray-700">
            Please note that while we make every effort to protect your information, no method of online data transmission is completely secure.
            Therefore, submitting information through our website is at your own discretion and risk.
          </p>

          <p className="text-gray-700">
            If at any point you wish to update your details or have your data removed entirely from our systems, please feel free to get in touch with us through our{" "}
            <Link href="/contact" className="text-blue-600 underline hover:text-blue-800">
              contact page
            </Link>.
          </p>
          <div className=" text-center  mt-5 mb-5">
  <Link
    href="/"
    className="btn btn-black-white  "
  >
    Back to Home
  </Link>
</div>
        </div>
      </section>
    </>
  );
}
