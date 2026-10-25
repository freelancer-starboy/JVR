'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/lib/firebase/firebase"

const AuthContext = createContext({ userId: null, userName: null, isAuthLoading: true, userDetails: null });

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      setUserDetails(user || null);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const userName = userDetails?.displayName || userDetails?.email || null;

  return (
    <AuthContext.Provider value={{ userId, userName, isAuthLoading, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
