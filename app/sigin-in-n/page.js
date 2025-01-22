'use client';
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
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
            <form>
              <input type="email" placeholder="Email" />
              <div className="custom-login-pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

              {isSignUp && (
                <>
                  <input type="text" placeholder="Full Name" />
                  <div className="custom-login-pass-input-div">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
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
                </>
              )}

              <div className="custom-login-center-options">
                {/* <div className="custom-login-remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember for 30 days</label>
                </div> */}
                <div className="custom-login-center-options">
                  {isSignUp ? (
                    <div></div> // Empty space or omit this entirely if no content is needed.
                  ) : (
                    <a href="#" className="custom-login-forgot-pass-link">
                      Forgot password?
                    </a>
                  )}
                </div>
              </div>

              <div className="custom-login-center-buttons">
                <button type="button">{isSignUp ? "Sign Up" : "Log In"}</button>
                <button type="button">
                  <img src={`/assets/img/logo/logo.png`} alt="" />
                  {isSignUp ? "Sign Up with Google" : "Log In with Google"}
                </button>
              </div>
            </form>
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
  );
};

export default Login;
