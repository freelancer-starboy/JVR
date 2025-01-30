import Link from 'next/link'
import React from 'react'

const Account = () => {
  return (
    <div className="custom-user-container">
      <div className="custom-user-header">
        <h1 className="custom-user-title">My Account</h1>
      </div>
      
      <div className="custom-user-grid">
        <Link href="/myOrders" className="custom-user-link">
          <div className="custom-user-card">
            <div className="custom-user-card-content">
              <img 
                src='/assets/img/account/orders.png' 
                className="custom-user-icon" 
                alt="Orders" 
              />
              <div className="custom-user-text-content">
                <h3 className="custom-user-card-title">Your Orders</h3>
                <p className="custom-user-card-description">
                  Track, return, or buy things again
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/security" className="custom-user-link">
          <div className="custom-user-card">
            <div className="custom-user-card-content">
              <img 
                src='/assets/img/account/security.png' 
                className="custom-user-icon" 
                alt="Security" 
              />
              <div className="custom-user-text-content">
                <h3 className="custom-user-card-title">Login & Security</h3>
                <p className="custom-user-card-description">
                  Change your password, and authentication settings
                </p>
              </div>
            </div>
          </div>
        </Link>

        <div className="custom-user-card">
          <div className="custom-user-card-content">
            <img 
              src='/assets/img/account/contact.png' 
              className="custom-user-icon" 
              alt="Contact" 
            />
            <Link href="/contact">
            
            <div className="custom-user-text-content">
              <h3 className="custom-user-card-title">Contact Us</h3>
              <p className="custom-user-card-description">
                Get in touch with us
              </p>
            </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account