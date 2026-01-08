// src/components/courseInner/Payment.tsx
"use client";

export default function PaymentC({ onClose }: { onClose: () => void }) {
  return (
    <div className="payment-modal">
      <button onClick={onClose}>Close</button>
      Payment Modal
    </div>
  );
}
