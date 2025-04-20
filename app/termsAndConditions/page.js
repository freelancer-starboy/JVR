"use client";

// import Layout from "@/components/layout/Layout";
import React, { useState } from "react";
import Link from "next/link";

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. Returns & Exchanges",
      content: [
        "Return & Exchange Window: You have 7 days from the date of delivery to return or exchange your items.",
        "Condition of Items: All returned or exchanged items must be in unused, original condition, with tags intact and packaging undamaged. We reserve the right to decline exchanges if the product does not meet these conditions.",
      ],
    },
    {
      title: "2. Exchange Process",
      content: [
        "Exchanges Only: We do not offer refunds, but we are happy to process an exchange for you. You can exchange your purchase for a different size, color, or an alternative product of equal value, based on availability.",
        "If you decide to exchange an item, simply contact our customer service team, and we will guide you through the exchange process.",
      ],
    },
    {
      title: "3. Defective or Incorrect Items",
      content: [
        "If you receive a defective, damaged, or incorrect item, please notify us within 24 hours of receiving your order. We will arrange for an exchange or issue you a replacement at no extra charge.",
      ],
    },
    {
      title: "4. Special Promotions & Sales",
      content: [
        "Items purchased during special sales, including those with promotions like Buy One Get One Free (BOGO), are not eligible for returns or exchanges.",
      ],
    },
    {
      title: "How to Initiate a Return or Exchange:",
      content: [
        "Contact Us: Reach out to our Customer Service team within 7 days of receiving your order.",
        "Provide Order Details: Share your order number and the reason for the exchange.",
        "Follow the Process: Our team will provide you with the necessary instructions to return the item and complete the exchange.",
      ],
    },
  ];

  return (
    <>
    {/* <Layout headerStyle={3} footerStyle={2}> */}
      <div className="terms-and-conditions-container">
        <div className="terms-and-conditions-card">
          <div className="terms-and-conditions-header">
            <h1 className="terms-and-conditions-title">
              SRI JVR Return & Exchange Policy
            </h1>
            <p className="terms-and-conditions-intro">
              At SRI JVR, we aim to make your shopping experience as seamless
              and enjoyable as possible. If you're not fully satisfied with your
              purchase, we offer a simple and straightforward exchange policy to
              ensure you're happy with your selection.
            </p>
          </div>

          <div className="terms-and-conditions-sections">
            {sections.map((section, index) => (
              <div key={index} className="terms-and-conditions-section">
                <button
                  className={`terms-and-conditions-section-header ${
                    activeSection === index
                      ? "terms-and-conditions-section-active"
                      : ""
                  }`}
                  onClick={() => toggleSection(index)}
                >
                  <h2 className="terms-and-conditions-section-title">
                    {section.title}
                  </h2>
                  <span
                    className={`terms-and-conditions-arrow ${
                      activeSection === index
                        ? "terms-and-conditions-arrow-up"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {activeSection === index && (
                  <div className="terms-and-conditions-section-content">
                    <ul className="terms-and-conditions-list">
                      {section.content.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="terms-and-conditions-list-item"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="terms-and-conditions-footer">
            At SRI JVR, we want you to be completely happy with your purchase.
            If anything doesn't meet your expectations, we're here to help make
            it right!
          </div>
          <div className=" text-center  mt-5 mb-5">
  <Link
    href="/"
    className="btn btn-black-white  "
  >
    Back to Home
  </Link>
</div>

        </div>
      
      </div>
    {/* </Layout> */}
    </>
  );
};

export default TermsAndConditions;
