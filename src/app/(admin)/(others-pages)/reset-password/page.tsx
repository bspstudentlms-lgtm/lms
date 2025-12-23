'use client';

import React, { useEffect,useState } from 'react';
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import InputField from "@/components/form/input/InputField";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";




export default function Fornotpassword() {
 const [email, setEmail] = useState("");
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
 

  const handleSignIn = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError(""); // Reset previous errors
  
    if (!email) {
      setError("Email is required!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("https://www.backstagepass.co.in/reactapi/forgotpassword_mail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      // Check the raw response
      const responseText = await response.text();
      console.log("Response Text:", responseText);
  
      // Try to parse it as JSON
      const data = JSON.parse(responseText); // manually parse the response text
  
      if (response.ok) {
        if (data.status === 200) {
          console.log("Password reset link sent successfully", data);
          setError("Login Details sent to your mail id.");
          // Redirect to sign-in page after 2 seconds
        setTimeout(() => {
            window.location.href = "/signin"; // Redirect to the sign-in page
          }, 2000); // 2000 milliseconds = 2 seconds
        } else {
          setError(data.message || "Failed to send reset link.");
        }
      } else {
        throw new Error("Failed to request password reset. Please try again.");
      }
    } catch (err) {
      console.error('Error:', err);
      setError("An error occurred while trying to reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
       <div className="space-y-6">
        <form onSubmit={handleSignIn}>
       <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
            {/* Sign in section */}
            <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px] loginColor">
              <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                Forgot Password
              </h3>
              <p className="mb-9 ml-1 text-base text-gray-600">
                Enter your email !
              </p>

              {/* Email */}
              <InputField
                variant="auth"
                extra="mb-3"
                label="Email*"
                placeholder="mail@simmmple.com"
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

             

              {/* Error Display */}
              {error && (
                <div className="text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Checkbox */}
              <div className="mb-4 flex items-center justify-between px-2">
               
                <a
                  className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                  href="/signin"
                >
                  Login?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                style={{ color: "#fff" }}
                className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                type="submit"
                disabled={loading} // Disable button when loading
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </div>
        
     
    </form>
      </div>
        </div>
    </div>
  );
}
