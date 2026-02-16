"use client";

import React, { useState,  useEffect } from "react";
import axios from "axios";


interface Course {
  coursetype: number;
  coursename: string;
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
   const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
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
    coursename:'',
    coursetype: 0,
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
   
    if (!courseId || courseId === "") return; // 🔥 hard stop
    axios
     .get(`https://www.backstagepass.co.in/reactapi/getcourses_api.php?courseid=${courseId}`)
      .then((res) => {
        const data = res.data || [];
        setCourses(data);

        if (data.length === 1) {
           
          setFormData((prev) => ({ ...prev, course: data[0].value }));
          setPaymentDetails({
           
            originalPayment: data[0].orignialpayment,
            discountValue: 0,
            finalAmount: data[0].gstpayment,
            coursename: data[0].label,
            coursetype: data[0].coursetype,
          });
        }
      })
      .catch(console.error);
  }, [courseId]);


  /* -------------------- INPUT HANDLER -------------------- */
  const checkAlreadyEnrolled = async (email: string, course: string) => {
  const res = await fetch(
    "https://www.backstagepass.co.in/reactapi/check_enrollment.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
      body: JSON.stringify({ email, course }),
    }
  );

  return res.json();
};
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const handleEmailBlur = async () => {
 
  if (!formData.email || !isValidEmail(formData.email)) return;
  if (!formData.course) return;

  const enrollment = await checkAlreadyEnrolled(
    formData.email,
    formData.course
  );

 if (enrollment.alreadyEnrolled) {
  setAlreadyEnrolled(true);
  setCouponRemarks("You are already enrolled in this course");
} else {
  setAlreadyEnrolled(false);
  setCouponRemarks("");
}
};
  const handleInputChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
 const email = formData.email; 
  const course = formData.course;

  if (!course) {
    alert("Please select a course first");
    return;
  }

  // if (!email) {
  //   alert("Please enter email first");
  //   return;
  // }
//        const enrollment = await checkAlreadyEnrolled(email, course);
// console.log('enrolled',enrollment?.alreadyEnrolled);
//   if (enrollment?.alreadyEnrolled) {
//     setCouponRemarks("You are already enrolled in this course");
//     return;
//   }
  // COUPON CHECK
  if (name === "coupon") {
    if (value.length < 4) {
      setCouponRemarks("");
      return;
    }

  

    //  CHECK DUPLICATE ENROLLMENT

    // CONTINUE COUPON FLOW
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
          coursename:data[0].coursename,
          coursetype: data[0].coursetype,
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
        coursename:selected.coursename,
        coursetype: selected.coursetype,

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
        {Number(paymentDetails.coursetype) !== 2 && (
  <>
    <h2 className="text-2xl font-semibold text-center mb-2">
      Enroll in {paymentDetails.coursename}
    </h2>

    <p className="text-center text-gray-500 mb-6">
      Fill details & start your journey 🚀
    </p>
  </>
)}
{paymentDetails.coursetype == 2 ? (
  <div className="mt-6 text-center space-y-4">
    <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200">
      <h3 className="text-lg font-semibold text-yellow-800">
        Free Webinar Access
      </h3>

      <p className="text-sm text-gray-600 mt-2">
        This is a free webinar. To watch this webinar, you need to purchase
        at least one course.
      </p>

      
    </div>

   
  </div>
) : (
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
             required={!alreadyEnrolled}
          />

          <Input
            label="Phone Number"
            name="PhoneNumber"
            type="tel"
            value={formData.PhoneNumber}
            onChange={handleInputChange}
             required={!alreadyEnrolled}
          />
            <input type="hidden" name="url" value={formData.url} />
            <input type="hidden" name="course" value={formData.course} />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleEmailBlur}
             required={!alreadyEnrolled}
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
  <div className="mt-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">

    {/* Course Price */}
    <div className="flex justify-between text-sm text-gray-600">
      <span>Course Price</span>
      <span className="font-medium">
        ₹{paymentDetails.originalPayment}
      </span>
    </div>

    {/* Discount */}
    {paymentDetails.discountValue > 0 && (
      <div className="flex justify-between text-sm text-green-600 mt-2">
        <span>Discount</span>
        <span className="font-semibold">
          − ₹{paymentDetails.discountValue}
        </span>
      </div>
    )}

    {/* Divider */}
    <div className="border-t border-dashed my-3"></div>

    {/* Total */}
    <div className="flex justify-between items-center">
      <span className="text-base font-semibold text-gray-900">
        Total Payable
      </span>
      <span className="text-xl font-bold text-red-600">
        ₹{paymentDetails.finalAmount}
      </span>
    </div>

    {/* Trust note */}
    <p className="mt-3 text-xs text-gray-500 flex items-center gap-1">
      🔒 Secure payment
    </p>
  </div>
)}

          {/* <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-full"
          >
            Submit & Enroll
          </button> */}
          <button
  type="submit"
  disabled={alreadyEnrolled}
  className={`w-full py-3 rounded-xl font-semibold transition
    ${
      alreadyEnrolled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black text-white hover:bg-gray-800"
    }
  `}
>
  {alreadyEnrolled ? "Already Enrolled" : "Proceed to Payment"}
</button>
        </form>
        )}
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

