"use client";
import Layout from "@/components/layout/Layout";
import Loader from "@/components/Loader/page";
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const auth = getAuth();
  const [mailSignedIn, setMailSignedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [newUsername, setNewUsername] = useState(null);
  const [userNameContainer, setUserNameContainer] = useState(false);
  const [userPasswordContainer, setUserPasswordContainer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [newPassword, setNewPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsername(user.displayName);
        user.providerData.forEach((provider) => {
          console.log("SIGNED USING ", provider.providerId);
          if (provider.providerId === "password") {
            setMailSignedIn(true);
          }
        });
      }
    });
    return () => unSubscribe();
  }, []);
  useEffect(() => {
    if (userNameContainer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  })

  const toggleUpdateUserName = () => {
    setUserNameContainer(!userNameContainer);
  };

  const toggleUpdatePassword = () => {
    setUserPasswordContainer(!userPasswordContainer);
  };
  const handleUpdateUserName = async() => {
    setLoading(true)
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw new Error("User is not logged in.");
      }
      await updateProfile(user, { displayName: newUsername})
      toast.success("Username updated successfully")
      window.location.reload()
    } catch (error) {
      console.error(error.message)
      toast.error("Failed to update username")
    }finally{
      setLoading(false)
    }
  }

  const handleUpdatePassword = async() => {
    try {
      setLoading(true)
      console.log("old password : ", newPassword.oldPassword, "new password : ", newPassword.newPassword, "confirm password : ", newPassword.confirmPassword);
      const auth = getAuth()
      const user = auth.currentUser
      if(!user){
        throw new Error("No used logged in")
      }
      const credential = EmailAuthProvider.credential(user.email, newPassword.oldPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword.confirmPassword)
      toast.success("Password updated successfully")
      setErrorMessage("")
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        toast.error("Incorrect Password. Please try again.");
        console.error("Incorrect Password. Please try again.");
        setErrorMessage("Incorrect Password. Please try again.")
      } else if (error.code === 'auth/network-request-failed') {
        toast.error("Network error. Please try again later.");
        console.error("Network error. Please try again later.");
        setErrorMessage("Network error. Please try again later.")
      } else if(error.code ===  "auth/weak-password"){
        toast.error("Weak Password. Please try again.");
        console.error("Weak Password. Please try again.");
        setErrorMessage("Weak Password. Password Must be 6 characters long")
      }else {
        toast.error("Error during re-authentication:", error.message);
        setErrorMessage("Error during re-authentication:", error.message)
        console.error("Error during re-authentication:", error.message);
      }
    }finally{
      setLoading(false)
    }
  }
  return (
    <Layout headerStyle={3} footerStyle={2}>
    {loading && <Loader/>}
    <div className="custom-security-wrapper">
      <div className="custom-security-container">
        <div className="custom-security-header">
          <h1 className="custom-security-title">Account Settings</h1>
        </div>
        
        <div className="custom-security-grid">
          <button className="custom-security-card" onClick={toggleUpdateUserName}>
            <div className="custom-security-card-header">
              <img src="/assets/img/account/user.png" alt="User" className="custom-security-card-icon" />
              <div>
                <h3 className="custom-security-card-title">Change Username</h3>
                <p className="custom-security-card-text">Welcome Back, {username}</p>
              </div>
            </div>
          </button>
  
          {mailSignedIn && (
            <button className="custom-security-card" onClick={toggleUpdatePassword}>
              <div className="custom-security-card-header">
                <img src="/assets/img/account/security.png" alt="Security" className="custom-security-card-icon" />
                <div>
                  <h3 className="custom-security-card-title">Change Password</h3>
                  <p className="custom-security-card-text">Update your password</p>
                </div>
              </div>
            </button>
          )}
  
          <Link href="/contact" className="custom-security-card">
            <div className="custom-security-card-header">
              <img src="/assets/img/account/contact.png" alt="Contact" className="custom-security-card-icon" />
              <div>
                <h3 className="custom-security-card-title">Contact Us</h3>
                <p className="custom-security-card-text">Get in touch with us</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  
    {/* Modals */}
    {userNameContainer && (
      <div className="custom-security-modal-overlay">
        <div className="custom-security-modal">
          <button className="custom-security-modal-close" onClick={toggleUpdateUserName}>×</button>
          <h2 className="custom-security-modal-title">Update Username</h2>
          <div className="custom-security-input-group">
            <input
              type="text"
              className="custom-security-input"
              placeholder="New Username"
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
          <button className="custom-security-button" onClick={handleUpdateUserName}>
            Save Changes
          </button>
        </div>
      </div>
    )}
  
    {userPasswordContainer && (
      <div className="custom-security-modal-overlay">
        <div className="custom-security-modal">
          <button className="custom-security-modal-close" onClick={toggleUpdatePassword}>×</button>
          <h2 className="custom-security-modal-title">Update Password</h2>
          <div className="custom-security-input-group">
            <input
              type="password"
              className="custom-security-input"
              placeholder="Current Password"
              name="oldPassword"
              value={newPassword.oldPassword}
              onChange={(e) => setNewPassword({ ...newPassword, [e.target.name]: e.target.value })}
            />
            <input
              type="password"
              className="custom-security-input"
              placeholder="New Password"
              name="newPassword"
              value={newPassword.newPassword}
              onChange={(e) => setNewPassword({ ...newPassword, [e.target.name]: e.target.value })}
            />
            <input
              type="password"
              className="custom-security-input"
              placeholder="Confirm New Password"
              name="confirmPassword"
              value={newPassword.confirmPassword}
              onChange={(e) => {
                setNewPassword({ ...newPassword, [e.target.name]: e.target.value });
                e.target.style.borderColor = e.target.value === newPassword.newPassword ? '#22c55e' : '#ef4444';
              }}
            />
            {errorMessage && <p className="custom-security-error">{errorMessage}</p>}
          </div>
          <button className="custom-security-button" onClick={handleUpdatePassword}>
            Update Password
          </button>
        </div>
      </div>
    )}
  </Layout>
  );
};

export default Page;
