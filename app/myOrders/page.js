'use client'
import { useAuth } from '@/components/AuthContent/AuthContent'
import Preloader from '@/components/elements/Preloader'
import Layout from '@/components/layout/Layout'
import { useFetchCheckOutQuery } from '@/features/api/checkout'
import React, { useEffect } from 'react'

const page = () => {
    const { userId } = useAuth()
    const {data, isLoading, refetch} = useFetchCheckOutQuery(userId, {
        skip: !userId
    })
    useEffect(() => {
        if (userId) {
          console.log("User ID:", userId);
          refetch();
        }
      }, [userId, refetch]);
      if (isLoading || !userId) {
        return <Preloader />;
      }

      if(isLoading){
        return <Preloader />
      }
  return (
    <>
        <Layout headerStyle={5} footerStyle={2}>
            <div className='container account-main'>
                <div>
                    <h1>Your Orders</h1>
                </div>
                {data && data.length > 0 ? data.map((item, index) => (
                    <div className='myOrders-content-main'>
                    <div className='myOrders-content-first'>
                        <div>
                            <h3>Order Placed</h3>
                            <p>{item.createdAt.slice(0, 10)}</p>
                        </div>
                        <div>
                            <h3>Total</h3>
                            <p>{item.orderTotal}</p>
                        </div>
                        <div>
                            <h3>Ship To</h3>
                            <p>{item.shippingAddress?.city}</p>
                        </div>
                        <div>
                            <p>Order ID - #-JVR-{item._id}</p>
                        </div>
                    </div>
                    <div>
                        <div className='myOrders-content-second'>
                            <div>
                                <h3>Product</h3>
                                <p>Product Name</p>
                            </div>
                            <div>
                                <h3>Quantity</h3>
                                <p>2</p>
                            </div>
                            <div>
                                <h3>Address</h3>
                                <p>Full Address</p>
                            </div>
                        </div>
                    </div>
                </div>
                )) : <>No Orders Found</> }


                
            </div>
        </Layout>
    </>
  )
}

export default page