"use client";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-12 bg-white">
      {/* Left - Image */}
      <div className="relative flex-1 flex justify-center items-center">
        {/* Background Shape */}
        <div className="absolute w-72 h-72 bg-green-100 rounded-2xl rotate-12"></div>
        
        <Image
          src="https://www.guvi.in/assets/DUN3iNaq-women-with-notebook-latest.webp" // place your image in public/student.png
          alt="Student"
          width={400}
          height={400}
          className="relative rounded-lg"
        />

       
      </div>

      {/* Right - Content */}
      <div className="flex-1 mt-10 md:mt-0 md:pl-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          Leading EdTech Platform for <br />
          Learning in Native Languages.
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          BackstagePass, backed by IIT-M, IIM-A, and HCL, is India’s top tech–driven
          EdTech platform for learning in regional and global languages. With 3M+
          learners worldwide, it offers personalized online learning, upskilling,
          and job opportunities.
        </p>
        <p className="mt-6 text-red-600 font-semibold text-lg">
          BackstagePass – <span className="underline">Grab Ur Vernacular Imprint</span>
        </p>
      </div>
    </section>
  );
}
