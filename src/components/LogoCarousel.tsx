"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const companies = [
  "/logos/thoughtworks.png",
  "/logos/amazon.png",
  "/logos/siemens.png",
  "/logos/aspire.png",
  "/logos/ideas2it.png",
  "/logos/cartoonmango.png",
  "/logos/lt.png",
  "/logos/lenovo.png",
  "/logos/justdial.png",
  "/logos/accenture.png",
  "/logos/caratlane.png",
  "/logos/comcast.png",
  "/logos/klenty.png",
  "/logos/zoho.png",
  "/logos/virtusa.png",
  "/logos/infosys.png",
  "/logos/tcs.png",
  "/logos/wipro.png",
  "/logos/capgemini.png",
  "/logos/hcl.png",
  "/logos/ibm.png",
  "/logos/jll.png",
  "/logos/fiserv.png",
  "/logos/techmahindra.png",
  "/logos/grappus.png",
  "/logos/cognizant.png",
  "/logos/paypal.png",
];

export default function CompanyCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true }, // dragFree = smooth
    [
      Autoplay({
        delay: 0, // No waiting time
        stopOnInteraction: false,
      }),
    ]
  );

  return (
    <div className="py-10 bg-gray-50">
      <h2 className="text-center text-2xl font-bold mb-8">
        Where Do Our Students Work?
      </h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex animate-scroll">
          {companies.map((logo, i) => (
            <div
              key={i}
              className="flex-[0_0_20%] sm:flex-[0_0_12.5%] px-4 py-4 flex items-center justify-center"
            >
              <div className="bg-white shadow rounded-xl p-4 flex items-center justify-center h-20 w-full">
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
