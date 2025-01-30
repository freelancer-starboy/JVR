"use client";
import { useAuth } from "@/components/AuthContent/AuthContent";
import Layout from "@/components/layout/Layout";
import { useCreateTokenMutation, useDeleteTokenMutation } from "@/features/api/authApi";
import { useFetchCartQuery } from "@/features/api/cartApi";
import { deleteCart } from "@/features/shopSlice";
import { current } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";

const Login = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [addCookies] = useCreateTokenMutation();
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [verifiedEmail, setEmailVerified] = useState(null)
  const [cookieAdded, setCookieAdded] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const emailInputRef = useRef()
  const [logInData, setLogInData] = useState({
    email : "",
    password : ""
  })
  const router = useRouter()
  const [signInData, setSignInData] = useState({
    userName : "",
    email : "",
    password : "",
    confirmPassword : ""
  })
  const [deleteCookies ] = useDeleteTokenMutation()

  /* Signup using email and password */
  const auth = getAuth();
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("User signed in:", currentUser.uid);
      } else {
        console.log("No user signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

    const { refetch} = useFetchCartQuery(userId)
  const googleProvider = new GoogleAuthProvider();
  const handleSignUp = async (e, email, password) => {
    e.preventDefault();
  
    // Validate fields
    if (
      !signInData.userName.trim() || 
      !signInData.email.trim() || 
      !signInData.password || 
      !signInData.confirmPassword
    ) {
      setError("Please enter all the fields");
      return;
    }
  
    if (signInData.password !== signInData.confirmPassword) {
      setError("Password and Confirm Password don't match");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(signInData.userName)
      await updateProfile(user, { displayName: signInData.userName });
      await sendEmailVerification(user);
      toast.success("A verification email has been sent to your email address. Please verify your email before logging in.");
      setMessage("A verification email has been sent to your email address. Please verify your email before logging in.");
    } catch (error) {
      console.error("Sign-up failed:", error.message);
      toast.error("Sign-up failed. Please try again.");
  
      // Specific error handling
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("Failed to create user. Please try again.");
      }
    }
  };
  
  const handleLogin = async (e, email, password) => {
    e.preventDefault();
    
  
    // Validate fields
    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }
  
    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Retrieve token and set cookies
      if(!user.emailVerified){
        toast.warning("Your email is not verified. Please verify your email to log in.");
        setError("Your email is not verified. Please verify your email to log in.");
        return
      }
      
      const token = await user.getIdToken();
      const response = await addCookies(token).unwrap();
      if (response) {
        toast.success("Login successful");
        refetch();
        router.push("/cart");
        router.refresh()
      } else {
        toast.error("Failed to set cookies.");
      }
  
      console.log("User logged in successfully:", user);
      setError(""); // Clear errors
      setMessage("");
      
    } catch (error) {
      console.error("Login failed:", error.message);
  
      // Specific error handling
      if (error.code === "auth/invalid-email") {
        setError("Invalid email address. Please check and try again.");
      } else if (error.code === "auth/invalid-credential") {
        setError("Incorrect credentials. Please check and try again.");
      } else if (error.code === "auth/user-not-found") {
        setError("No user found with this email. Please sign up.");
      } else {
        setError("Login failed. Please try again.");
      }
      toast.error("Login failed.");
    }
  };
  
  /* End of signup using email and password */

  /* Handle google login */
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const token = await user.getIdToken();
      const response = await addCookies(token).unwrap();
      if (response) {
        toast.success("Login Successful");
        refetch()
        router.push("/");

        setError("")
        setMessage("")
        router.refresh()
      } else {
        toast.error("Login Failed");
        setError("Login Failed")
      }
    } catch (error) {
      console.log("User signin failed by google", error.message);
      toast.error(error.message);
      setError(error.message)
    }
  };
  /* End of google login */
  const toggleForm = () => {
    setError(null)
    setIsSignUp(!isSignUp);
  };


  const sendEmailVerification = async(e) => {
    e.preventDefault()
    try {
      const email = emailInputRef.current.value;
      console.log("Email", email)
      if(!email){
        setMessage("Enter email address")
        return
      }
      await sendPasswordResetEmail(auth, email)
      setMessage("Email verification link has been sent to your email address. Please check your inbox and follow the instructions to verify your email address.")
      toast.success("Email verification link has been sent to your email address.")
    } catch (error) {
      if (error.code === "auth/user-not-found") {
      setMessage("User not found. Please sign up.")
      toast.error("User not found. Please sign up.")
    } else if (error.code === "auth/invalid-email") {
      setMessage("Invalid email address. Please check and try again.")
      toast.error("Invalid email address. Please check and try again.")
    } else {
      setMessage("Failed to send verification email. Please try again.")
      toast.error("Failed to send verification email. Please try again.")
    }
    }
  }

  return (
    <>
   
{/* <Layout headerStyle={5 } footerStyle={2}> */}
  <div className="custom-login-main">
      <div className="custom-login-left">
        <img src={`/assets/img/logo/logo.png`} alt="Logo" />
      </div>
      <div className="custom-login-right">
        <div className="custom-login-right-container">
          <div className="custom-login-logo">
            <img src={`/assets/img/logo/logo.png`} alt="Logo" />
          </div>
          <div className="custom-login-center">
            <h2>{isSignUp ? "Create an Account" : "Welcome back!"}</h2>
            <p>
              {isSignUp
                ? "Please fill in the details to create a new account"
                : "Please enter your details"}
            </p>

            {/* Sign in form */}
            { !isSignUp && !forgotPassword &&
              
              <form>
              <input type="email" placeholder="Email" name="email" required onChange={(e) => setLogInData({...logInData, email : e.target.value})} />
              <div className="custom-login-pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  onChange={(e) => setLogInData({...logInData, password : e.target.value})}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash
                    className="custom-login-eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <FaEye
                    className="custom-login-eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
              <div className="custom-login-center-options">
                  <button onClick={() => setForgotPassword(!forgotPassword)} className="custom-login-forgot-pass-link">
                    Forgot password?
                  </button>
              </div>

              <div className="custom-login-center-buttons-y">

                  <button type="submit" onClick={(e) => handleLogin(e, logInData.email, logInData.password)}>Log In </button>
                  </div>
            </form>
            }

            {forgotPassword && !isSignUp &&(
              <form>
                <input type="email" placeholder="Email" name="email" ref={emailInputRef}  />
                <div className="custom-login-center-buttons-y">

                <button onClick={(e) => sendEmailVerification(e)}>Submit</button>
                </div>
              </form>
            )}
            

            <div style={{ marginTop : '1rem'}}>

              {error && <p><spam style={{color : 'red'}}>{error}</spam></p>}
              {message && <p><spam style={{color : 'green'}}>{message}</spam></p>}
            </div>
          
            {/* End of sign in form */}

            {isSignUp &&(
              <>
                <form>
                <input type="text" placeholder="User Name" name="userName" onChange={(e) => setSignInData({...signInData, userName : e.target.value})} />
                  <input type="email" placeholder="Email" name="email" onChange={(e) => setSignInData({...signInData, email : e.target.value})} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    onChange={(e) => setSignInData({...signInData, password : e.target.value})
                  }
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    onChange={(e) => {setSignInData({...signInData, confirmPassword : e.target.value})
                  if(e.target.value !== signInData.password){
                    e.target.style.border = "1px solid red"
                  }else{
                    e.target.style.border = "1px solid green";
                  }
                  }}
                  />
                  <div className="custom-login-pass-input-div">
                    {showPassword ? (
                      <FaEyeSlash
                        className="custom-login-eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <FaEye
                        className="custom-login-eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                  <div className="custom-login-center-buttons-y">

                  <button onClick={(e) => handleSignUp(e, signInData.email, signInData.password)} type="submit">Sign Up</button>
                  </div>
                </form>
                
              </>
            )}
          

            
          </div>

          <p className="custom-login-bottom-p">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <a href="#" onClick={toggleForm}>
                  <span style={{ color: "red"}}>Log In</span>
                </a>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <a href="#" onClick={toggleForm}>
                  <span style={{ color: "red"}}>Sign Up</span>
                </a>
              </>
            )}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>

           ( or ) 
          </div>
          <div className="custom-login-center-buttons">
              <button type="button" onClick={handleGoogleSignIn}>
                
                  <div style={{display:"flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "1rem"}}>
                    <img src="/assets/css/images/g-logo.png" />
                  </div>
              </button>
            </div>
        </div>
      </div>
    </div>

  
    {/* </Layout> */}
    </>
  );
};

export default Login;
