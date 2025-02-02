import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

const SignUpPage = () => {
  // want state for show password
  const [showPassword, setShowPassword]  = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {

  }
  return (
    <div>SignUpPage hello</div>
  )
}

export default SignUpPage