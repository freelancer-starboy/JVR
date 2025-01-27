'use client'
import { useAuth } from '@/components/AuthContent/AuthContent'
import Preloader from '@/components/elements/Preloader'
import Layout from '@/components/layout/Layout'
import Account from '@/components/user/Account'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { set } from 'mongoose'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const User = () => {
  const [user, setUser] = useState(undefined);
  const auth = getAuth()
  const router = useRouter()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe();
  }, [])
  if(user === undefined){
    return <Preloader />
  }
  return (
    <>
        <Layout headerStyle={5} footerStyle={2}>
      {user ? (
        <Account /> // Render Account page if user exists.
      ) : (
         router.push('/')
      )}
   
        </Layout>
    </>
  )
}

export default User