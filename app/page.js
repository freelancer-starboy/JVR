import Layout from "@/components/layout/Layout"
// import Banner1 from "@/components/sections/Banner1"
import Banner1 from "@/components/sections/ExploreEverything"
import Blog1 from "@/components/sections/Blog1"
import Brand1 from "@/components/sections/Brand1"
import Exclusive from "@/components/sections/Exclusive"
import Product2 from "@/components/sections/Product2"
import Slider2 from "@/components/sections/Slider2"
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Link from "next/link"
export default function Home2() {

    return (
        <>
            <Layout headerStyle={3} footerStyle={2}>
                <Slider2 />
                <Banner1 />
                <Product2 />
                <Exclusive />
                {/* <Blog1 /> */}
                <Brand1 />
            </Layout>
        </>
    )
}