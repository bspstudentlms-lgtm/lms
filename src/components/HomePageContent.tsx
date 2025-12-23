
"use client";

import React, { useEffect, useState } from "react";

import CourseCarouselNoScroll from "@/components/CourseCarouselNoScroll";


import SuccessCarousel from "@/components/SuccessCarousel";
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

const HomePageContent = () => {
 const [current, setCurrent] = useState(0);
 
 const [currents, setCurrents] = useState(0);
 
 
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
      <div className="relative overflow-hidden shadow-lg h-[150px] sm:h-[350px]">
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
              className="object-cover object-center sm:object-center"
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/50 text-white p-2 hover:bg-gray-900"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/50 text-white p-2 hover:bg-gray-900"
      >
        ❯
      </button>

     
    </div>
   


<main className="px-4 py-3 sm:p-6">
      <h1 className="text-xl sm:text-3xl font-bold text-center mb-0 flex items-center justify-center">Our Courses</h1>
      <CourseCarouselNoScroll />
    </main>

    <main className="px-4 py-3 sm:p-6">
      <h1 className="text-xl sm:text-3xl font-bold text-center mb-0 flex items-center mb-5 justify-center">Journey Of Our Learners</h1>
      <SuccessCarousel />
    </main>



    <main className="px-4 py-3 sm:p-6">
      <Corporate />
    </main>

       {/* <main className="px-4 py-3 sm:p-6">
      <HeroSection />
    </main>

    <main className="px-4 py-3 sm:p-6">
      <ResourceBanner />
    </main> */}

      <main>
      <Footer />
    </main>
    

    

    

    </div>
  );
};

export default HomePageContent;
