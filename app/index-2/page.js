import Head from "next/head";
import Layout from "@/components/layout/Layout";
import Category from "@/components/sections/Category";
import DealProduct1 from "@/components/sections/DealProduct1";
import Product1 from "@/components/sections/Product1";
import Shop from "@/components/sections/Shop";
import Slider1 from "@/components/sections/Slider1";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sree JVR Textiles | Fashion for Men and Women</title>
        <meta
          name="description"
          content="Explore the latest trends in premium sarees, modern dress materials, and stylish fashion for men and women at Sree JVR Textiles. Shop high-quality fabrics, chic designs, and unbeatable prices – with convenient doorstep delivery."
        />
        <link rel="canonical" href="https://www.sreejvrtextiles.in/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sreejvrtextiles.in/" />
        <meta
          property="og:title"
          content="Sree JVR Textiles | Fashion for Men and Women"
        />
        <meta
          property="og:description"
          content="Shop the latest collection of premium fashion, dress materials, and textiles for both men and women at Sree JVR Textiles."
        />
        <meta
          property="og:image"
          content="https://www.sreejvrtextiles.in/assets/images/jvr-logo-3.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.sreejvrtextiles.in/" />
        <meta
          name="twitter:title"
          content="Sree JVR Textiles | Fashion for Men and Women"
        />
        <meta
          name="twitter:description"
          content="Discover trendy style, fabrics, and modern styles for men and women at unbeatable prices."
        />
        <meta
          name="twitter:image"
          content="https://www.sreejvrtextiles.in/images/banner.jpg"
        />
      </Head>
      <Layout headerStyle={1} footerStyle={1}>
        <Slider1 />
        <Category />
        <Product1 />
        <DealProduct1 />
        <Shop />
      </Layout>
    </>
  );
}
