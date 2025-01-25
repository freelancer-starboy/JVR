"use client";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { useCreateTokenMutation, useDeleteTokenMutation } from "@/features/api/authApi";
import { useFetchCartQuery } from "@/features/api/cartApi";
import { deleteCart } from "@/features/shopSlice";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";

const Login = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [addCookies] = useCreateTokenMutation();
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState(null);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("User signed in:", currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);
   useEffect(() => {
    const currentUser = auth.currentUser
    if(currentUser){
      const uid = currentUser.uid
      const displayName = currentUser.displayName
      setCurrentUser(displayName)
      console.log("User signed in:", currentUser.displayName);
    }
  }, [])
    const { refetch} = useFetchCartQuery(userId)
  const googleProvider = new GoogleAuthProvider();
  const handleSignUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName : signInData.userName})
      console.log("user signed up by email and password", user);
      toast.success("User signed up successfully");
      setError("")
      refetch()
      router.back()
    } catch (error) {
      console.log("User signin failed by email and password", error.message);
      toast.error(error.message);
      setError(error.message)
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken()
      const response = await addCookies(token).unwrap()
      if (response) {
        toast.success('Login Successful')
        refetch()
        router.back()
      }else{
        toast.error('Cookie failed')
      }
      console.log("User logged in by email and password", user);
      toast.success("User logged in successfully");
      setError("")
    } catch (error) {
      console.log("User signin failed by email and password", error.message);
      toast.error(error.message);
      setError(error.message)
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
  const handleLogout = async() => {
    try {
      await signOut(auth)
      const response = await deleteCookies().unwrap()
      if (response.success) {
        toast.success('Logout Successful')
        setCurrentUser(null)
        refetch()
      }else{
        toast.error('Logout Failed')
      }
    } catch (error) {
      console.error('Error during sign-out:', error);
      
    }
  }
  /* End of google login */
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <>
    {userId ? (
      <div>
        <h1>Hello {currentUser}</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>
    )
  :
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
            { !isSignUp &&
              
              <form>
              <input type="email" placeholder="Email" name="email" onChange={(e) => setLogInData({...logInData, email : e.target.value})} required />
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
                  <a href="#" className="custom-login-forgot-pass-link">
                    Forgot password?
                  </a>
              </div>
              <div className="custom-login-center-buttons">

                  <button type="button" onClick={() => handleLogin(logInData.email, logInData.password)}>Log In</button>
                  </div>
            </form>
            }

            {/* End of sign in form */}

            {isSignUp && (
              <>
                <form>
                <input type="text" placeholder="User Name" name="userName" onChange={(e) => setSignInData({...signInData, userName : e.target.value})} />
                  <input type="email" placeholder="Email" name="email" onChange={(e) => setSignInData({...signInData, email : e.target.value})} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    onChange={(e) => setSignInData({...signInData, password : e.target.value})}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    onChange={(e) => setSignInData({...signInData, confirmPassword : e.target.value})}
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
                  <div className="custom-login-center-buttons">

                  <button onClick={() => handleSignUp(signInData.email, signInData.password)} type="button">Sign Up</button>
                  </div>
                </form>
              </>
            )}
            {error && <p>{error}</p>}

            

            <div className="custom-login-center-buttons">
              
              <button type="button" onClick={handleGoogleSignIn}>
                <img src={`/assets/img/logo/logo.png`} alt="" />
                {user ? `Welcome, ${user.displayName}` : "Log In with Google"}
              </button>
            </div>
          </div>

          <p className="custom-login-bottom-p">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <a href="#" onClick={toggleForm}>
                  Log In
                </a>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <a href="#" onClick={toggleForm}>
                  Sign Up
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  }
    
    </>
  );
};

export default Login;
