'use client'
import { useAuth } from "@/components/AuthContent/AuthContent"
import Layout from "@/components/layout/Layout"
import { useSubmitFormMutation } from "@/features/api/contactApi"
import Link from "next/link"
import { use, useState } from "react"
import { toast } from "react-toastify"
export default function Contact() {
    const [ formData, setFormData ] = useState({ name : "", email : "", phoneNumber : "", subject : "", message : "" })
    const [status, setStatus] = useState("")
    const [submitForm , {isLoading, error}] = useSubmitFormMutation()
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value})
    }
    const { userId } = useAuth()
    const handleSubmit = async(e) => {
    e.preventDefault()

    if(!userId){
        toast.error("Please login to contact us")
        return
    }
    if(!formData.name || !formData.email || !formData.phoneNumber || !formData.subject || !formData.message){
        alert("Enter all details")
            return
        }
        setStatus("Loading...")

        try {
            const response = await submitForm(formData).unwrap()
            if (response.statusCode === 200) {
                toast.success(response.message);
                // setStatus(response.message);
                setFormData({ name: "", email: "", phoneNumber: "", subject: "", message: "" });
            } else {
                toast.error(response.message);
                // setStatus(response.message);
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!");
            // setStatus(error.message)
        } finally {
            setStatus("");
        }
    }
    return (
        <>
            <Layout headerStyle={3} footerStyle={1}>
                <div>
                    <section className="contact-area pt-80 pb-80">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-4 col-12">
                                    <div className="tpcontact__right mb-40">
                                        <div className="tpcontact__shop mb-30">
                                            <h4 className="tpshop__title mb-25">Get In Touch</h4>
                                            <div className="tpshop__info">
                                                <ul>
                                                    <li><i className="fal fa-map-marker-alt" /> <Link href="#">Devala main road, near canara bank, Nilgiris - 643212</Link></li>
                                                    <li>
                                                        <i className="fal fa-phone" />
                                                        <Link href="#">+91 99439 33092</Link>
                                                    </li>
                                                    <li>
                                                        <i className="fal fa-clock" />
                                                        <span>Store Hours:</span>
                                                        <span>09 am - 09 pm EST, 7 days a week</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="tpcontact__support">
                                            <Link href="tel:9943933092">Get Support On Call <i className="fal fa-headphones" /></Link>
                                            <Link target="_blank" href="https://www.google.com/maps/place/SRI+JVR+TEXTILES/@11.4744836,73.9416017,8z/data=!4m10!1m2!2m1!1sjvr+textiles!3m6!1s0x3ba61f6912412f27:0x3e8682c2757f270f!8m2!3d11.4744836!4d76.3805665!15sCgxqdnIgdGV4dGlsZXNaDiIManZyIHRleHRpbGVzkgEOY2xvdGhpbmdfc3RvcmWaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVTnFhRFZFVERGUlJSQULgAQD6AQQIABAQ!16s%2Fg%2F11sszrq395?entry=ttu&g_ep=EgoyMDI1MDEyNy4wIKXMDSoASAFQAw%3D%3D">Get Direction <i className="fal fa-map-marker-alt" /></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-8 col-12">
                                    <div className="tpcontact__form">
                                        <div className="tpcontact__info mb-35">
                                            <h4 className="tpcontact__title">Make Custom Request</h4>
                                            <p>Must-have pieces selected every month want style Ideas and Treats?</p>
                                        </div>
                                        <form id="contact-form">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="tpcontact__input mb-20">
                                                        <input name="name" type="text" placeholder="Full name" value={formData.name} onChange={(e) => handleChange(e)} required />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="tpcontact__input mb-20">
                                                        <input name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="tpcontact__input mb-20">
                                                        <input name="phoneNumber" type="text" placeholder="Phone number" value={formData.phoneNumber} onChange={handleChange} required />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="tpcontact__input mb-20">
                                                        <input name="subject" type="text" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="tpcontact__input mb-30">
                                                        <textarea name="message" placeholder="Enter message" value={formData.message} onChange={handleChange} required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tpcontact__submit">
                                            <button type="button" onClick={handleSubmit} className="tp-btn tp-color-btn tp-wish-cart">
                                        {isLoading ? "Sending..." : "Get A Quote"}
                                    </button>
                                            </div>
                                        </form>
                                        {status && <p className="ajax-response mt-30">{status}</p>}
                                {error && <p className="ajax-response mt-30 text-danger">{error.message}</p>}
                                        <p className="ajax-response mt-30" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* contact-area-end */}
                    {/* map-area-start */}
                    <div className="map-area">
                        <div className="tpshop__location-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.075397684201!2d76.37799157493089!3d11.474483588719933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba61f6912412f27%3A0x3e8682c2757f270f!2sSRI%20JVR%20TEXTILES!5e0!3m2!1sen!2sin!4v1740892083051!5m2!1sen!2sin"></iframe>
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    )
}