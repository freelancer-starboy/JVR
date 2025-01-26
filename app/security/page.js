'use client'
import React, { useState } from 'react'
import { Lock, LogOut, Edit2, Save, User, Mail } from 'lucide-react'
import { getAuth, signOut } from 'firebase/auth'
import { useDeleteTokenMutation } from '@/features/api/authApi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const SecurityPage = () => {
    const auth = getAuth()
    const [deleteCookies ] = useDeleteTokenMutation()
    
    const router = useRouter()
    const [profile, setProfile] = useState({
        username: 'johndoe',
        email: 'johndoe@example.com'
    })
    const [isEditing, setIsEditing] = useState(false)
    const [editProfile, setEditProfile] = useState({ ...profile })

    const handleProfileUpdate = () => {
        setProfile(editProfile)
        setIsEditing(false)
    }

      const handleLogout = async() => {
        try {
          await signOut(auth)
          const response = await deleteCookies().unwrap()
          if (response.success) {
            toast.success('Logout Successful')
            router.push('/')
    
          }else{
            toast.error('Logout Failed')
          }
        } catch (error) {
          console.error('Error during sign-out:', error);
          
        }
      }

    const handleChangePassword = () => {
        // Implement change password modal/navigation
        console.log('Change password')
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white d-flex align-items-center">
                            <User className="me-2" />
                            <h4 className="mb-0">Account Settings</h4>
                        </div>
                        <div className="card-body">
                            {/* Username Section */}
                            <div className="mb-3">
                                <label className="form-label d-flex align-items-center">
                                    <User className="me-2 text-muted" />
                                    Username
                                </label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editProfile.username}
                                        onChange={(e) => setEditProfile({...editProfile, username: e.target.value})}
                                    />
                                ) : (
                                    <div className="form-control bg-light">{profile.username}</div>
                                )}
                            </div>

                            {/* Email Section */}
                            <div className="mb-3">
                                <label className="form-label d-flex align-items-center">
                                    <Mail className="me-2 text-muted" />
                                    Email
                                </label>
                                {isEditing ? (
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={editProfile.email}
                                        onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                                    />
                                ) : (
                                    <div className="form-control bg-light">{profile.email}</div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-between mt-4">
                                {isEditing ? (
                                    <button 
                                        className="btn btn-success" 
                                        onClick={handleProfileUpdate}
                                    >
                                        <Save className="me-2" /> Save Changes
                                    </button>
                                ) : (
                                    <button 
                                        className="btn btn-outline-primary" 
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit2 className="me-2" /> Edit Profile
                                    </button>
                                )}
                            </div>

                            {/* Security Options */}
                            <div className="mt-4 pt-3 border-top">
                                <h5 className="mb-3 d-flex align-items-center">
                                    <Lock className="me-2 text-warning" /> 
                                    Security Options
                                </h5>
                                <div className="d-grid gap-2">
                                    <button 
                                        className="btn btn-outline-warning" 
                                        onClick={handleChangePassword}
                                    >
                                        <Lock className="me-2" /> Change Password
                                    </button>
                                    <button 
                                        className="btn btn-outline-danger" 
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="me-2" /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecurityPage