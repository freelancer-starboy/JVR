'use client'
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function SignIn() {
  const [user, setUser] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  // Handle Sign-Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error.message);
    }
  };

  return (
    <>
      <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Sign In">
        <section className="track-area pt-80 pb-40">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-sm-12">
                <div className="tptrack__product mb-40">
                  <div className="tptrack__thumb">
                    <img src="/assets/img/banner/login-bg.jpg" alt="" />
                  </div>
                  <div className="tptrack__content grey-bg-3">
                    <div className="tptrack__item d-flex mb-20">
                      <div className="tptrack__item-icon">
                        <img src="/assets/img/icon/lock.png" alt="" />
                      </div>
                      <div className="tptrack__item-content">
                        <h4 className="tptrack__item-title">Login Here</h4>
                        <p>Your personal data will be used to support your experience throughout this website, to manage access to your account.</p>
                      </div>
                    </div>
                    {user ? (
                      <div className="tptrack__content">
                        <p>Welcome, {user.displayName}!</p>
                        <button className="tptrack__submition" onClick={handleSignOut}>
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="tptrack__content">
                        <div className="tptrack__btn">
                          <button className="tptrack__submition" onClick={handleGoogleSignIn}>
                            Login with Google
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="tptrack__product mb-40">
                  <div className="tptrack__thumb">
                    <img src="/assets/img/banner/sign-bg.jpg" alt="" />
                  </div>
                  <div className="tptrack__content grey-bg-3">
                    <div className="tptrack__item d-flex mb-20">
                      <div className="tptrack__item-icon">
                        <img src="/assets/img/icon/sign-up.png" alt="" />
                      </div>
                      <div className="tptrack__item-content">
                        <h4 className="tptrack__item-title">Sign Up</h4>
                        <p>Your personal data will be used to support your experience throughout this website, to manage access to your account.</p>
                      </div>
                    </div>
                    <div className="tptrack__id mb-10">
                      <form action="#">
                        <span>
                          <i className="fal fa-envelope" />
                        </span>
                        <input type="email" placeholder="Email address" />
                      </form>
                    </div>
                    <div className="tptrack__email mb-10">
                      <form action="#">
                        <span>
                          <i className="fal fa-key" />
                        </span>
                        <input type="text" placeholder="Password" />
                      </form>
                    </div>
                    <div className="tpsign__account">
                      <Link href="#">Already Have Account?</Link>
                    </div>
                    <div className="tptrack__btn">
                      <button className="tptrack__submition tpsign__reg">
                        Register Now<i className="fal fa-long-arrow-right" />
                      </button>
                    </div>
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
