import Link from 'next/link'
import React from 'react'

const Account = () => {
  return (

    <div className="container account-main">
        <div>
            <h1>My Account</h1>
        </div>
        <div className='account-container'>
            <Link href="/myOrders">

            <div className='account-inside-container'>
                <img src='/assets/img/account/orders.png' />
                <div>
                    <h3>Your Orders</h3>
                    <p>Track, return, or buy things again</p>
                </div>
            </div>
            </Link>
            <Link href="/security">
            
            <div className='account-inside-container'>
                <img src='/assets/img/account/security.png' />
                <div>
                    <h3>Login & Security</h3>
                    <p>Change your password, and authentication settings</p>
                </div>
            </div>
            </Link>
            <div className='account-inside-container'>
                <img src='/assets/img/account/contact.png' />
                <div>
                    <h3>Contact Us</h3>
                    <p>Get in touch with us</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Account