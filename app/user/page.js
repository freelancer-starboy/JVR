import Layout from '@/components/layout/Layout'
import Account from '@/components/user/Account'
import React from 'react'

const User = () => {
  return (
    <>
        <Layout headerStyle={5} footerStyle={2}>
            <Account />
        </Layout>
    </>
  )
}

export default User