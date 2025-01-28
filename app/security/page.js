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
    <Layout headerStyle={5} footerStyle={2}>
      {loading && <Loader/>}
      <div className="container account-main">
        <div>
          <h1>Account Settings</h1>
        </div>
        <div className="account-container">
          <button onClick={toggleUpdateUserName}>
            <div className="account-inside-container">
              <img src="/assets/img/account/user.png" />
              <div className="d-flex align-items-start justify-content-start flex-column">
                <h3>Change Username</h3>
                <p>Welcome Back, {username}</p>
              </div>
            </div>
          </button>
          {mailSignedIn && (
            <button onClick={toggleUpdatePassword}>
              <div className="account-inside-container">
                <img src="/assets/img/account/security.png" />
                <div className="d-flex align-items-start justify-content-start flex-column">
                  <h3>Change Password</h3>
                  <p>Reauthenticate to change password</p>
                </div>
              </div>
            </button>
          )}
          <Link href="/contact">
            <div className="account-inside-container">
              <img src="/assets/img/account/contact.png" />
              <div>
                <h3>Contact Us</h3>
                <p>Get in touch with us</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {userNameContainer && (
        <div class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div
            class="bg-white p-4 rounded-3 shadow-lg position-relative"
            style={{ width: "400px" }}
          >
            <button
              class="btn-close position-absolute top-0 end-0 m-2"
              aria-label="Close"
              onClick={toggleUpdateUserName}
            ></button>

            <h5 class="mb-3 text-center">Update Username</h5>
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="New Username"
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div class="d-grid">
              <button class="btn btn-primary" onClick={handleUpdateUserName}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/*  */}

      {userPasswordContainer && (
        <div class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div
            class="bg-white p-4 rounded-3 shadow-lg position-relative"
            style={{ width: "400px" }}
          >
            <button
              class="btn-close position-absolute top-0 end-0 m-2"
              aria-label="Close"
              onClick={toggleUpdatePassword}
            ></button>

            <h5 class="mb-3 text-center">Update Password</h5>
            <div class="mb-3">
              <input
                type="text"
                class="form-control mb-3"
                placeholder="Current Password"
                name="oldPassword"
                value={newPassword.oldPassword}
                onChange={(e) => setNewPassword({ ...newPassword, [e.target.name] : e.target.value})}
              />
              <input
                type="text"
                class="form-control mb-3"
                placeholder="New Password"
                name="newPassword"
                value={newPassword.newPassword}
                onChange={(e) => setNewPassword({ ...newPassword, [e.target.name] : e.target.value})}
              />
              <input
                type="text"
                class="form-control mb-3"
                placeholder="Confirm New Password"
                name="confirmPassword"
                value={newPassword.confirmPassword}
                onChange={(e) => {setNewPassword({ ...newPassword, [e.target.name] : e.target.value})
              if(e.target.value === newPassword.newPassword){
                e.target.style.border = "1px solid green"
              }else{
                e.target.style.border = "1px solid red"
              }}}
              />
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div class="d-grid">
              <button class="btn btn-primary" onClick={handleUpdatePassword}>Save</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Page;
