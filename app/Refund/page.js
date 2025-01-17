import Head from 'next/head';
import Link from 'next/link';

const RefundPolicy = () => {
  return (
    <>
      <Head>
        <title>Refund and Cancellation Policy</title>
        <meta name="description" content="Refund and Cancellation Policy for our website" />
      </Head>

      <div className="container">
        <h1>Refund and Cancellation Policy</h1>
        
        <section>
          <h2>Refund Policy</h2>
          <p>
            We aim to provide the best service, but if for any reason you are not satisfied with your purchase, we offer a refund within <strong>5-7 working days</strong> of receiving your request. 
            The refund will be credited to the same account or payment method used for the transaction. 
          </p>
          <p>
            To initiate a refund, please contact our support team with your order details.
          </p>
        </section>

        <section>
          <h2>Cancellation Policy</h2>
          <p>
            If you wish to cancel your order, you may do so within <strong>24 hours</strong> of placing it. 
            Cancellations requested after this period may not be processed. Once cancelled, a full refund will be issued as per the refund policy mentioned above.
          </p>
        </section>

        <section>
          <h2>How to Request a Refund or Cancellation</h2>
          <p>
            To request a refund or cancellation, please contact our customer support team at:
          </p>
          <p>Email: <a href="mailto:yogesh.5prog@gmail.com">yogesh.5prog@gmail.com</a></p>
          <p>Phone: +91 9344934224</p>
        </section>

        <section>
          <h2>Note</h2>
          <p>
            Refunds will only be issued if the product or service provided is eligible under the terms of this policy.
            Please refer to our Terms and Conditions for more details.
          </p>
        </section>

        <footer>
          <p>
            If you have any questions regarding our Refund and Cancellation Policy, please don't hesitate to reach out to us. 
            Visit our <Link href="/contact">Contact Us</Link> page for more details.
          </p>
        </footer>
      </div>
    </>
  );
};

export default RefundPolicy;
