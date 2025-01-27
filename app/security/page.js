"use client";
import Layout from "@/components/layout/Layout";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

const page = () => {
  const auth = getAuth();
  const [username, setUsername] = useState(null);
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsername(user.displayName);
      }
    });
    return () => unSubscribe();
  }, []);
  return (
    <Layout headerStyle={5} footerStyle={2}>
      <div className="container">
        <div>
          <h1>Account Details</h1>
          <h3  className="fst-italic">Welcome {username}</h3>
          </div>
        <div className="d-flex">
          <div>
            <h2>Edit user details</h2>
            <div>
              <label className="form-label">change User name</label>
              <input placeholder="User name" className="form-control" />
              <label className="form-label" >New password</label>
              <input placeholder="New password" className="form-control" />
              <label className="form-label" >Confirm New password</label>
              <input placeholder="Confirm password" className="form-control" />
              <button className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default page;
