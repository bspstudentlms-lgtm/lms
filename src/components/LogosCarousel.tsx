"use client";
import React from "react";

const companies = [
  "https://www.guvi.in/assets/BeM-RDUa-amazon.webp",
  "https://www.guvi.in/assets/fQGtF5GR-siemens.webp",
  "https://www.guvi.in/assets/Cjsm_-LY-aspire.webp",
  "https://www.guvi.in/assets/BT5qwU2l-ideas.webp",
  "https://www.guvi.in/assets/C7IirAO9-cartoon-mango.webp",
  "https://www.guvi.in/assets/daYTQfl9-larsen.webp",
  "https://www.guvi.in/assets/BCqZ5u0O-lenovo.webp",
  "https://www.guvi.in/assets/cZULMhV6-just-dial.webp",
  "https://www.guvi.in/assets/C7gjAANj-thoughtworks.webp",
  "https://www.guvi.in/assets/BeM-RDUa-amazon.webp",
];

// 👇 keyframes for scrolling
const styles = `
@keyframes scrollLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes scrollRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
`;

export default function CompanyCarousel() {
  return (
    <div className="py-0 bg-gray-50 relative">
      <style>{styles}</style>
      <h1 className="text-3xl font-bold mb-10 flex items-center mb-0 justify-center">Where Do Our Students Work?</h1>

      {/* Left to Right */}
      <div className="overflow-hidden">
        <div
          className="flex w-[200%] animate-scroll-left"
          style={{
            animation: "scrollLeft 30s linear infinite",
          }}
        >
          {[...companies, ...companies].map((logo, i) => (
            <div
              key={i}
              className="flex-[0_0_8%] flex items-center justify-center"
            >
              <div className="p-4 flex items-center justify-center h-25 w-full">
                <img
                  src={logo}
                  alt="company logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right to Left */}
      <div className="overflow-hidden">
        <div
          className="flex w-[200%] animate-scroll-right"
          style={{
            animation: "scrollRight 30s linear infinite",
          }}
        >
          {[...companies, ...companies].map((logo, i) => (
            <div
              key={i}
              className="flex-[0_0_8%] px-4 py-4 flex items-center justify-center"
            >
              <div className="p-4 flex items-center justify-center h-25 w-full">
                <img
                  src={logo}
                  alt="company logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
