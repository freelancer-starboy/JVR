'use client'
import Link from "next/link"
import MobileMenu from "./MobileMenu"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useAuth } from "../AuthContent/AuthContent";
import { useEffect, useState } from "react";
import { useDeleteTokenMutation } from "@/features/api/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Sidebar({ isMobileMenu, handleMobileMenu }) {
     const { userId } = useAuth();
      const [userName, setUserName] = useState(null);
      const [searchQuery, setSearchQuery] = useState('');
      const router = useRouter();
      const auth = getAuth();
      
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUserName(user.displayName);
            console.log(user.displayName);
          }
        });
        return () => unsubscribe();
      }, [userId]);
      
      const [deleteCookies] = useDeleteTokenMutation();
      
      const handleDeleteUser = async() => {
        try {
          await signOut(auth);
          const response = await deleteCookies().unwrap();
          if (response.success) {
            toast.success('Logout Successful');
            window.location.reload();
          } else {
            toast.error('Logout Failed');
          }
        } catch (error) {
          console.error('Error during sign-out:', error);
        }
      };

      // Handle search form submission
      const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (searchQuery.trim() !== '') {
          router.push(`/shop-2?search=${encodeURIComponent(searchQuery)}`);
        }
      };

    return (
        <>
            <div className={`tpsideinfo ${isMobileMenu ? "tp-sidebar-opened" : ""}`}>
                <button className="tpsideinfo__close" onClick={handleMobileMenu}>Close<i className="fal fa-times ml-10" /></button>
                <div className="tpsideinfo__search text-center pt-35">
                    <span className="tpsideinfo__search-title mb-20">What Are You Looking For?</span>
                    <form onSubmit={handleSearchSubmit}>
                      <input 
                        type="text"  
                        placeholder="Search Products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && searchQuery.trim() !== '') {
                            e.preventDefault(); // Prevent form submission on Enter
                            router.push(`/shop-2?search=${encodeURIComponent(searchQuery)}`);
                          }
                        }}
                      />
                      <button type="submit"><i className="fal fa-search" /></button>
                    </form>
                </div>
                <div className="tpsideinfo__nabtab">
                    
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                            <MobileMenu />
                        </div>
                        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                            <div className="tpsidebar-categories">
                                <ul>
                                    <li><Link href="/shop">Furniture</Link></li>
                                    <li><Link href="/shop">Wooden</Link></li>
                                    <li><Link href="/shop">Lifestyle</Link></li>
                                    <li><Link href="/shop-2">Shopping</Link></li>
                                    <li><Link href="/track">Track Product</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tpsideinfo__account-link">
                    {userName ? (
                       <>
                        <p className="tpsideinfo__account-link-text" style={{ color: "white"}}><i className="fal fa-user" /><span className="mx-2">{userName}</span></p>
                        <button style={{ color : "white"}} onClick={handleDeleteUser}>Logout</button>
                       </> 
                    ) : <Link href="/sign-in"><i className="fal fa-user" />Login / Register</Link>}
                </div>
                <div className="tpsideinfo__wishlist-link">
                    <Link href="/wishlist" target="_parent"><i className="fal fa-heart" /> Wishlist</Link>
                </div>
            </div>
            <div className={`body-overlay ${isMobileMenu ? "opened" : ""}`} onClick={handleMobileMenu} />
        </>
    )
}