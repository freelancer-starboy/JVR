"use client"
import { useState } from "react";
import Link from "next/link";
// import Header3 from "@/components/layout/header/Header3";
// import Footer2 from "@/components/layout/footer/Footer2";
import Layout from "@/components/layout/Layout";

const faqData = [
  {
    question: "Do you have clothing for men, women, and kids?",
    answer:
      "Absolutely! We offer curated collections for men, women, and kids — from casual wear to festive styles.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "Returns and exchanges are accepted within 7 days of delivery. Items must be unused and in original condition with tags.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard shipping takes 3–7 business days depending on your location. Express options are available at checkout.",
  },
  {
    question: "How do I choose the right size?",
    answer: (
      <>
        Each product page includes a{" "}
        <Link href="/size-guide" className="text-primary text-decoration-none">
          Size Guide
        </Link>{" "}
        to help you pick the perfect fit.
      </>
    ),
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Yes, gift wrapping and custom gift messages are available during checkout — perfect for birthdays, holidays, or celebrations.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
   <Layout headerStyle={3} footerStyle={2}>
    <section className="bg-light py-5">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-2">
            Frequently Asked Questions
          </h2>
          <p
            className="text-muted"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Find answers to the most common questions about our clothing,
            shipping, returns, and more.
          </p>
        </div>

        {/* FAQ List */}
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border rounded mb-3 bg-white shadow-sm"
            >
              <button
                className="w-100 text-start px-4 py-3 bg-white border-0 fw-medium"
                onClick={() => toggleIndex(index)}
              >
                {item.question}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-3 text-muted small">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
    </Layout>
    </>
  );
}
