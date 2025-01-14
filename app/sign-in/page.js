'use client'
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useState, useEffect, createContext } from "react";
import { auth } from "@/lib/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export default function SignIn() {
  const userId = createContext(null)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("User signed in:", currentUser.uid);
      } 
    });
    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const controller = new AbortController();
  //     const getAuthToken = async () => {
  //       const auth = getAuth();
  //       const currentUser = auth.currentUser;
  //       if (currentUser) {
  //         try {
  //           const token = await currentUser.getIdToken();
  //           if (!controller.signal.aborted) {
  //             console.log("Token:", token);
  //           }
  //         } catch (error) {
  //           if (!controller.signal.aborted) {
  //             console.error("Error getting token:", error);
  //           }
  //         }
  //       } else {
  //         if (!controller.signal.aborted) {
  //           console.warn("No user is logged in");
  //         }
  //       }
  //     };
  //     getAuthToken()
  //     return () => {
  //       controller.abort()
  //     } 
  //   }
  //  , [user])
  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get Firebase ID token
      const token = await user.getIdToken();
      
      // Call the API to save the token in a cookie
      const res = await fetch('/api/cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        router.push('/'); // Redirect to a protected page
      } else {
        console.error('Failed to save token');
      }
    } catch (error) {
      console.error('Error during login', error);
    } finally {
      setLoading(false);
    }
  };
  // Handle Sign-Out
  const handleSignOut = async () => {
    try {
  await signOut(auth);

      const response = await fetch('/api/cookies/signout', {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Cookie deleted and user signed out successfully');
      } else {
        console.error('Failed to delete cookie');
      }
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  return (
    <>
      <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Sign In">
        {loading && <p>Loading...</p>}
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
