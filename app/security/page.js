"use client";
import Layout from "@/components/layout/Layout";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

const Page = () => {
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
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1">Account Settings</h2>
                  <p className="text-muted">
                    Welcome back, <span className="fw-medium">{username}</span>
                  </p>
                </div>

                <div className="border-bottom mb-4"></div>

                <form>
                  <div className="row">
                    <div className="col-12 mb-4">
                      <h4 className="fw-semibold mb-4">Update Profile</h4>
                      <div className="mb-3">
                        <label className="form-label text-muted">Username</label>
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control form-control-lg bg-light" 
                            placeholder="Enter new username"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <h4 className="fw-semibold mb-4">Change Password</h4>
                      <div className="mb-3">
                        <label className="form-label text-muted">New Password</label>
                        <div className="input-group">
                          <input 
                            type="password" 
                            className="form-control form-control-lg bg-light" 
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-muted">Confirm New Password</label>
                        <div className="input-group">
                          <input 
                            type="password" 
                            className="form-control form-control-lg bg-light" 
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;