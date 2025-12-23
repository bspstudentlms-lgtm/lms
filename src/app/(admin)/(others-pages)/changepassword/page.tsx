'use client';

import React, { useEffect,useState } from 'react';
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import InputField from "@/components/form/input/InputField";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";




export default function Changepassword() {
  const [oldpassword, setPassword] = useState<string | null>(null);
  const [userid, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [inputOldPassword, setInputOldPassword] = useState('');
  const [inputNewPassword, setInputNewPassword] = useState('');
  const [inputConfirmPassword, setInputConfirmPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Only runs on the client-side
    const storedPassword = localStorage.getItem('password');
    const storedUserId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('email');

    setPassword(storedPassword);
    setUserId(storedUserId);
    setEmail(storedEmail);
  }, []);  // The empty array ensures this runs only once after component mounts

  // Handler for "Old Password" input field change
  const handleOldPasswordChange = (e) => {
    const value = e.target.value;
    setInputOldPassword(value);

    // Check if the entered old password matches the stored one
    if (value !== oldpassword) {
      setOldPasswordError('Old password does not match.');
    } else {
      setOldPasswordError('');
    }
  };

  // Handler for "New Password" input field change
  const handleNewPasswordChange = (e) => {
    setInputNewPassword(e.target.value);
    setNewPasswordError('');
  };

  // Handler for "Confirm Password" input field change
  const handleConfirmPasswordChange = (e) => {
    setInputConfirmPassword(e.target.value);
    setConfirmPasswordError('');
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let isValid = true;
    setFormError('');
    setSuccessMessage('');

    // Check if the fields are empty
    if (!inputOldPassword) {
      setOldPasswordError('Old password is required.');
      isValid = false;
    }
    if (!inputNewPassword) {
      setNewPasswordError('New password is required.');
      isValid = false;
    }
    if (!inputConfirmPassword) {
      setConfirmPasswordError('Confirm password is required.');
      isValid = false;
    }

    // Check if old password matches
    if (inputOldPassword !== oldpassword) {
      setOldPasswordError('Old password does not match.');
      isValid = false;
    }

    // Check if new password matches confirm password
    if (inputNewPassword && inputConfirmPassword && inputNewPassword !== inputConfirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }
      if (!userid || !email) {
      setFormError('User information is missing. Please sign in again.');
      isValid = false;
    }
    // If form is valid, proceed with API call
    if (isValid) {

      try {
        const response = await fetch('https://www.backstagepass.co.in/reactapi/changepassword.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
              old_password: inputOldPassword,
              new_password: inputNewPassword,
              confirm_password: inputConfirmPassword,
              userid: userid || '',
              email: email || '',

                    }), 
                  });

        const result = await response.json();
console.log(result.status);
        // Handle the response from the PHP backend
        if (result.status === '200') {
          setSuccessMessage('Password changed successfully!');
          localStorage.removeItem('password');  
          localStorage.removeItem('userId');  
          localStorage.removeItem('username');  
          localStorage.removeItem('email');
          localStorage.removeItem('enrolledcourses');

          // Redirect to sign-in page after successful password change
          window.location.replace('/signin'); 
        } else {
          setFormError(result.message.join('\n'));
        }
      } catch (error) {
        setFormError('An error occurred while changing the password.');
      }
    } else {
      setFormError('Please fill all fields correctly.');
    }
  };
  return (
    <div>
      <div className="max-w-xl mx-auto rounded-xl border border-gray-200 bg-white p-4 lg:p-5">
        <h3 className="mb-3 text-base font-semibold text-gray-800">
          Change Password
        </h3>
        <div className="space-y-6">
           <p className="mb-5 ml-1 text-sm text-gray-600">Enter your password!!</p>

        {/* Old Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Old Password*"
          placeholder="Old Password"
          id="old-password"
          type="password"
          value={inputOldPassword}
          onChange={handleOldPasswordChange}
          required
        />
        {oldPasswordError && (
  <p className="mt-1 text-xs text-red-500">
    {oldPasswordError}
  </p>
)}

        {/* New Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="New Password*"
          placeholder="New Password"
          id="new-password"
          type="password"
          value={inputNewPassword}
          onChange={handleNewPasswordChange}
          required
        />
        {newPasswordError && <p className="text-red-500 text-sm">{newPasswordError}</p>}

        {/* Confirm Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Confirm Password*"
          placeholder="Confirm Password"
          id="confirm-password"
          type="password"
          value={inputConfirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          Change Password
        </button>

        {/* General form error */}
        {formError &&
 !oldPasswordError &&
 !newPasswordError &&
 !confirmPasswordError && (
  <p className="mt-3 text-sm text-red-600 text-center">
    {formError}
  </p>
)}


        {/* Success message */}
        {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
      </div>
        </div>
    </div>
  );
}
