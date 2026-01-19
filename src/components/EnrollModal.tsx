"use client";

import React, { useState,  useEffect } from "react";
import axios from "axios";


interface Course {
  value: string;
  label: string;
  orignialpayment: number;
  gstpayment: number;
}

interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
  courseId: number | string;
}

export default function EnrollModal({ open, onClose, courseId }: EnrollModalProps) {
  if (!open) return null;
   console.log('courseid'+courseId);
   const [courses, setCourses] = useState<Course[]>([]);
  const [couponRemarks, setCouponRemarks] = useState("");
const [username, setUsername] = useState<string | null>(null);
  const [userid, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");
  // The empty array ensures this runs only once after component mounts

  const [formData, setFormData] = useState({
    fullname: "",
    PhoneNumber: "",
    email: "",
    course: "",
    coupon: "",
    url: window.location.href,
  });

  const [paymentDetails, setPaymentDetails] = useState({
    originalPayment: 0,
    discountValue: 0,
    finalAmount: 0,
  });

  /* -------------------- SET URL (CLIENT SAFE) -------------------- */
 useEffect(() => {
  const storedusername = localStorage.getItem("username") || "";
  const storedUserId = localStorage.getItem("userId") || "";
  const storedEmail = localStorage.getItem("email") || "";
  const storedPhone = localStorage.getItem("phone") || "";
console.log('phoneno'+storedPhone);
  setFormData((prev) => ({
    ...prev,
    fullname: storedusername,
    email: storedEmail,
    PhoneNumber:storedPhone,
  }));

  // optional if you need them separately
  setUsername(storedusername);
  setUserId(storedUserId);
  setEmail(storedEmail);
  setPhone(storedPhone);
}, []);

  /* -------------------- FETCH COURSE BY courseId -------------------- */
  useEffect(() => {
    let slug = "";

    if (courseId === 23 || courseId === "23") {
      slug = "certificate-program-in-basics-of-maya";
    }

    axios
      .get(`https://www.backstagepass.co.in/reactapi/courses_api.php?slug=${slug}`)
      .then((res) => {
        const data = res.data || [];
        setCourses(data);

        if (data.length === 1) {
          setFormData((prev) => ({ ...prev, course: data[0].value }));
          setPaymentDetails({
            originalPayment: data[0].orignialpayment,
            discountValue: 0,
            finalAmount: data[0].gstpayment,
          });
        }
      })
      .catch(console.error);
  }, [courseId]);

  /* -------------------- INPUT HANDLER -------------------- */
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "coupon") {
      if (value.length < 4) {
        setCouponRemarks("");
        return;
      }

      if (!formData.course) {
        alert("Please select a course first");
        return;
      }

      try {
        const res = await fetch(
          "https://www.backstagepass.co.in/reactapi/getpaymentapi.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              course: formData.course,
              coupon: value,
            }),
          }
        );

        const data = await res.json();

        if (data?.length) {
          setPaymentDetails({
            originalPayment: data[0].orignialpayment,
            discountValue: data[0].discountvalue,
            finalAmount: data[0].finalamount,
          });

          setCouponRemarks(data[0].remarkscoupon || "");
        }
      } catch {
        setCouponRemarks("Invalid coupon");
      }
    }
  };

  /* -------------------- COURSE CHANGE -------------------- */
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = courses.find((c) => c.value === e.target.value);

    setFormData((prev) => ({
      ...prev,
      course: e.target.value,
    }));

    if (selected) {
      setPaymentDetails({
        originalPayment: selected.orignialpayment,
        discountValue: 0,
        finalAmount: selected.gstpayment,
      });
    }
  };

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
        <form
          className="space-y-4"
          action="https://www.backstagepass.co.in/payment_process.php"
          method="POST"
        >
          <Input
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
          />

          <Input
            label="Phone Number"
            name="PhoneNumber"
            type="tel"
            value={formData.PhoneNumber}
            onChange={handleInputChange}
          />
            <input type="hidden" name="url" value={formData.url} />
            <input type="text" name="course" value={formData.course} />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          {/* <select
            name="course"
            value={formData.course}
            onChange={handleCourseChange}
            className="w-full p-3 border rounded-xl"
            required
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select> */}

          <Input
            label="Coupon Code (Optional)"
            name="coupon"
            value={formData.coupon}
            onChange={handleInputChange}
          />

          {couponRemarks && (
            <p className="text-red-500 text-sm">{couponRemarks}</p>
          )}

          {paymentDetails.originalPayment > 0 && (
            <div className="text-sm">
              <p>Payment: ₹{paymentDetails.originalPayment}</p>
              {paymentDetails.discountValue > 0 && (
                <p>Discount: -₹{paymentDetails.discountValue}</p>
              )}
              <p className="font-semibold">
                Total: ₹{paymentDetails.finalAmount}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-full"
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
const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
     {...props}
      className="
        w-full px-4 py-3 rounded-xl
        border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-red-500
        transition
      "
    />
  </div>
);

