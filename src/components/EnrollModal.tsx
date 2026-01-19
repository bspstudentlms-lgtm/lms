"use client";

import { useState } from "react";

export default function EnrollModal({ open, onClose }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-md p-8 animate-scaleIn">
        
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Enroll in Basics of Maya
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Fill details & start your journey 🚀
        </p>

        {/* FORM */}
        <form className="space-y-4">
          <Input label="Full Name" placeholder="Enter your name" />
          <Input label="Phone Number" placeholder="Enter mobile number" />
          <Input label="Email Address" placeholder="Enter email id" />
          <Input label="Coupon Code (Optional)" placeholder="Enter coupon code" />

          {/* SUBMIT */}
          <button
            type="submit"
            className="
              w-full mt-4 py-3 rounded-full
              bg-gradient-to-r from-red-500 to-red-600
              text-white font-semibold tracking-wide
              shadow-[0_10px_30px_rgba(239,68,68,0.5)]
              hover:scale-105 transition
            "
          >
            Submit & Enroll
          </button>
        </form>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

/* INPUT COMPONENT */
const Input = ({ label, placeholder }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      className="
        w-full px-4 py-3 rounded-xl
        border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-red-500
        transition
      "
    />
  </div>
);
