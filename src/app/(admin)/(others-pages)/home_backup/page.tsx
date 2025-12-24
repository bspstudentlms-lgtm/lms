// app/mentor-dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";

//import CourseCarousel from "@/components/CourseCarousel";
import CourseCarouselNoScroll from "@/components/CourseCarouselNoScroll";
import GoogleCarousel from "@/components/GoogleCarousel";

import SuccessCarousel from "@/components/SuccessCarousel";
import LogoCarousel from "@/components/LogoCarousel";
import LogosCarousel from "@/components/LogosCarousel";
import WeAreProud from "@/components/WeAreProud";
import Practice from "@/components/Practice";
import Corporate from "@/components/Corporate";
import HeroSection from "@/components/HeroSection";
import ResourceBanner from "@/components/ResourceBanner";
import Footer from "@/components/Footer";



import Image from "next/image";

const slides = [
  { id: 1, src: "/images/carousel/carousel-01.webp", alt: "Slide 1" },
  { id: 2, src: "/images/carousel/carousel-02.webp", alt: "Slide 2" },
  { id: 3, src: "/images/carousel/carousel-03.webp", alt: "Slide 3" },
];

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

const logos = [
  "https://www.guvi.in/assets/FMwBCMe6-itt-gandhinagar.webp",
  "https://www.guvi.in/assets/BCPcGBgM-naan-mudhalvan.webp",
  "https://www.guvi.in/assets/BWlI1m4l-nasscom.webp",
  "https://www.guvi.in/assets/BRwkyvhT-nsdc.webp",
  "https://www.guvi.in/assets/DAY9U0vx-skill-development.webp",
  "https://www.guvi.in/assets/CnnFx7sx-swayam-plus.webp",
  "https://www.guvi.in/assets/JrdaxbAI-aicte.webp",
  "https://www.guvi.in/assets/C6rKRY5L-anna-university-chennai.webp",
  "https://www.guvi.in/assets/DVq3f3xP-autodesk.webp",
  "https://www.guvi.in/assets/9TNw1reF-google-for-education.webp"
];

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

const MentorDashboard = () => {



const [current, setCurrent] = useState(0);

const [currents, setCurrents] = useState(0);

  // Duplicate logos for infinite effect
  const infiniteLogos = [...logos, ...logos];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrents((prev) => prev + 1);
    }, 2000); // autoplay every 2s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currents >= logos.length) {
      setTimeout(() => {
        setCurrents(0);
      }, 1000); // wait for transition before reset
    }
  }, [currents]);

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000); // 4 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };







  


 
  return (
    <div>

   <div className="relative w-full mx-auto">
      {/* Slides wrapper */}
      <div className="relative overflow-hidden shadow-lg h-[250px] sm:h-[350px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === current}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/50 text-white p-2 hover:bg-gray-900"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/50 text-white p-2 hover:bg-gray-900"
      >
        ❯
      </button>

      {/* Dots */}
      {/* <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition ${
              current === i ? "bg-blue-600 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div> */}
    </div>
   
<div className="relative w-full mx-auto overflow-hidden">
  <h1 className="p-5 flex items-center justify-center" style={{fontSize: "24px"}}>Our Accreditations & Partnerships</h1>
       <div className="overflow-hidden">
        <div
          className="flex w-[200%] animate-scroll-left"
          style={{
            animation: "scrollLeft 30s linear infinite",
          }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex-[0_0_8%] flex items-center justify-center"
            >
              <div className="p-4 flex items-center justify-center h-40 w-full">
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

<main className="p-6">
      <h1 className="text-3xl font-bold mb-0 flex items-center justify-center">Our Courses Test</h1>
      <CourseCarouselNoScroll />
    </main>

    <main className="p-6">
      <h1 className="text-3xl font-bold mb-0 flex items-center mb-5 justify-center">Journey Of Our Learners</h1>
      <SuccessCarousel />
    </main>

<main className="p-6">
      <h1 className="text-3xl font-bold mb-10 flex items-center mb-0 justify-center">Google reviews</h1>
      <GoogleCarousel />
    </main>

    {/* <main className="p-6">
     
      <LogosCarousel />
    </main> */}

    
    {/* <main className="p-6">
     
      <WeAreProud />
    </main> */}

      {/* <main className="p-6">
      <Practice />
    </main> */}

    {/* <main className="p-6">
      <Corporate />
    </main> */}

       <main className="p-6">
      <HeroSection />
    </main>

    {/* <main className="p-6">
      <ResourceBanner />
    </main> */}

      <main>
      <Footer />
    </main>
    

    

    

    </div>
  );
};

export default MentorDashboard;
