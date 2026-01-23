"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  CheckCircle,
  Clock,
  Book,
  Globe,
  Star,
  Phone,
  MessageCircle,
} from "lucide-react";
import EnrollModal from "@/components/EnrollModal";
import { signIn } from "next-auth/react";



const topics = [
  {
    title: "Introduction to 3D and Maya",
    points: [
      "What is 3D? Uses in Games, Film, and Design",
      "Types of 3D Assets – Props, Environments, Characters",
      "Introduction to Maya 2024 – Installation and Setup",
      "Exploring the Maya Interface – Menus, Shelves, Panels",
      "Navigating the Viewport – Orbit, Pan, Zoom",
      "Transform Tools – Move, Rotate, Scale",
      "Channel Box & Attribute Editor – Understanding Object Data",
    ],
  },
  {
    title: "Working with Geometry Scene",
    points: [
      "Understanding Polygons and Mesh Components",
      "Creating Primitive Objects",
      "Vertex, Edge, and Face Editing",
      "Soft Selection & Snapping",
      "Mesh Cleanup Techniques",
    ],
  },
  {
    title: "Organization & Planning",
    points: [
      "Scene Organization Best Practices",
      "Naming Conventions",
      "Grouping & Hierarchies",
      "Outliner & Display Layers",
    ],
  },
  {
    title: "Overview of the Prop",
    points: [
      "Understanding Reference Images",
      "Blockout Workflow",
      "Analyzing Real-World Props",
      "Topology Planning",
    ],
  },
];


    const faqs = [
  {
    q: "What is the Certificate Program in Basics of Maya?",
    a: "This is a beginner-friendly certificate program designed to teach the fundamentals of Autodesk Maya, including modeling, UVs, and texturing.",
  },
  {
    q: "Who is this course ideal for?",
    a: "This course is ideal for beginners, students, aspiring 3D artists, and professionals switching to 3D workflows.",
  },
  {
    q: "Do I need previous experience in 3D modeling or Maya?",
    a: "No prior experience is required. This course starts from the basics and is suitable for complete beginners.",
  },
  {
    q: "Will I receive a certificate upon completion?",
    a: "Yes, you will receive a certificate after successfully completing the course.",
  },
  {
    q: "What software do I need for this course?",
    a: "You will need Autodesk Maya 2024. Installation guidance is provided in the course.",
  },
  {
    q: "How is the course conducted?",
    a: "The course is delivered online through recorded video lessons that you can access at your own pace.",
  },
  {
    q: "What are the career opportunities after completing this course?",
    a: "You can pursue roles such as 3D Modeling Artist, Prop Artist, Game Asset Artist, or Environment Artist.",
  },
];

export default function BasicsOfMayaPage() {
   const [activeIndex, setActiveIndex] = useState<number | null>(0);
   const [open, setOpen] = useState<number | null>(null);
    const [open1, setOpen1] = useState(false);
    const [visible, setVisible] = useState(true);

     const [username, setUsername] = useState<string | null>(null);
      const [userid, setUserId] = useState<string | null>(null);
      const [email, setEmail] = useState<string | null>(null);
      useEffect(() => {
        // Only runs on the client-side
        const storedusername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email');
    
        setUsername(storedusername);
        setUserId(storedUserId);
        setEmail(storedEmail);
      }, []);  // The empty array ensures this runs only once after component mounts

  useEffect(() => {
    const section = document.getElementById("page-enroll-cta");

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;
  return (
    <main className="text-gray-800 pb-20">
<header className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LEFT LOGO */}
        <div className="flex items-center">
          <img
            src="https://backstagepass.co.in/newlogo-324ee245.webp"
            alt="Backstage Pass Institute of Gaming"
            className="h-12 w-auto"
          />
        </div>

        {/* RIGHT BADGE */}
        <div className="flex items-center gap-3">
          <img
            src="https://backstagepass.co.in/14-fa50a1ea-bca647fc.webp"
            alt="16+ Years of Academic Excellence"
            className="h-12 w-auto"
          />
          <div className="text-left leading-tight">
            <p className="font-bold text-sm">YEARS OF</p>
            <p className="font-bold text-sm">ACADEMIC EXCELLENCE</p>
          </div>
        </div>

      </div>
    </header>
      {/* FLOATING ICONS */}
      <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-3">
        <a
          href="https://wa.me/919999999999"
          className="bg-green-500 p-3 rounded-full text-white shadow-lg"
        >
          <MessageCircle size={22} />
        </a>
        <a
          href="tel:+919999999999"
          className="bg-red-600 p-3 rounded-full text-white shadow-lg"
        >
          <Phone size={22} />
        </a>
      </div>

      {/* HERO */}
      <section className="relative bg-[#7b1e23] overflow-hidden">
      {/* subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div className="text-white">
          <h1 className="text-[44px] font-semibold text-[#ffb347] mb-6">
            Basics Of Maya for Beginners
          </h1>

          <p className="text-md leading-relaxed mb-8">
            The Certificate Program in Basics of Maya is a beginner-friendly course
            designed to introduce students to the core fundamentals of Autodesk Maya,
            including interface navigation, essential modeling tools, UV unwrapping,
            and basic texturing. Through guided lessons and practical, hands-on
            exercises, students will learn how to create 3D assets from scratch and
            understand the complete Maya workflow.
          </p>

          <h3 className="text-xl font-semibold mb-4">
            Buy this Course @
          </h3>

          {/* PRICE */}
          <div className="flex items-center gap-4 mb-4">
            <span className="line-through text-gray-300 text-xl">₹4999</span>
            <span className="text-3xl font-bold text-[#ffb347]">₹799</span>
            <span className="bg-white text-red-600 font-semibold px-4 py-1 rounded-full text-sm">
              84% Disc.
            </span>
          </div>

          <span className="inline-block bg-red-600 text-white px-5 py-2 rounded-full text-sm mb-8">
            Limited Time Offer!
          </span>

          {/* META BOX */}
         <div className="relative bg-white rounded-xl shadow-lg grid grid-cols-4 text-center text-black">
  {/* Item 1 */}
  <div className="py-6">
    <p className="font-semibold">7 Modules</p>
    <p className="text-sm text-gray-600">with Certifications</p>
  </div>

  {/* Item 2 */}
  <div className="py-6">
    <p className="font-semibold">6 Hours</p>
    <p className="text-sm text-gray-600">Recorded Content</p>
  </div>

  {/* Item 3 */}
  <div className="py-6">
    <p className="font-semibold">Online</p>
    <p className="text-sm text-gray-600">Mode</p>
  </div>

  {/* Item 4 */}
  <div className="py-6">
    <p className="font-semibold">English</p>
    <p className="text-sm text-gray-600">Language</p>
  </div>

  {/* Vertical dividers */}
  <span className="absolute top-6 bottom-6 left-1/4 w-px bg-gray-200" />
  <span className="absolute top-6 bottom-6 left-2/4 w-px bg-gray-200" />
  <span className="absolute top-6 bottom-6 left-3/4 w-px bg-gray-200" />
</div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <div className="rounded-2xl border-[6px] border-white overflow-hidden shadow-2xl">
            <img
              src="https://backstagepass.co.in/Thumbnailformaya-3e15b0a2.png"
              alt="Maya Course"
              className="w-full"
            />
          </div>
        </div>

      </div>
    </section>

     

      {/* ABOUT COURSE */}
      <section className="max-w-7xl mx-auto px-6 py-20">
  {/* Heading */}
  <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">
    Basics Of Maya Course Overview
  </h2>

  {/* Paragraph 1 */}
  <p className="text-[17px] leading-[30px] text-[#1f1f1f] mb-8">
    Have you ever wanted to bring your ideas to life in 3D? Whether it’s game
    assets, props, or creative projects, Autodesk Maya is one of the most
    powerful tools for 3D modeling and texturing.
  </p>

  {/* Paragraph 2 */}
  <p className="text-[17px] leading-[30px] text-[#1f1f1f] mb-8">
    In this course, we’ll explore Maya 2024 step by step – perfect for complete
    beginners. You’ll learn how to navigate the Maya interface, work with
    essential modeling tools, create detailed props, unwrap UVs, and apply
    materials. We’ll also cover the basics of image-based texturing inside Maya
    so you can give your models realistic looks.
  </p>

  {/* Paragraph 3 */}
  <p className="text-[17px] leading-[30px] text-[#1f1f1f]">
    By the end of this course, you’ll be comfortable creating 3D assets from
    scratch, understanding the Maya workflow, and preparing your models with
    clean UVs and textures. No prior 3D experience is needed – just curiosity
    and creativity.
  </p>
</section>


      {/* KEY FEATURES */}
     <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">
        Key Features
      </h2>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Feature text="Beginner-friendly Maya fundamentals" />
        <Feature text="Practical, step-by-step asset creation" />
        <Feature text="7 compact learning modules" />
        <Feature text="6 hours of recorded video lessons" />
        <Feature text="100% online and self-paced" />
        <Feature text="Certificate on completion" />
      </div>
    </section>

      {/* AWARDS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">
        Our Awards
      </h2>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Award
          img="https://backstagepass.co.in/ET_Achievers_2025-a03e9ae8.webp"
          title="ET Industry Achievers 2025"
        />
        <Award
          img="https://backstagepass.co.in/Best_Education_Brand_2018-8ffd3a56.webp"
          title="Best Education Brand Award – Economic Times 2018"
        />
        <Award
          img="https://backstagepass.co.in/Times_Education_Excellence_2019-c24c65ad.webp"
          title="Times Education Excellence Awards 2019"
        />
        <Award
          img="https://backstagepass.co.in/Time_Excellence_Awards_2020-9b0861f1.webp"
          title="Times Excellence Award 2020"
        />
      </div>
    </section>

      {/* COURSE TOPICS */}
       <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-semibold mb-10">
        Course Topics You will Learn
      </h2>

      <div className="space-y-6">
        {topics.map((topic, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={topic.title}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* HEADER */}
              <button
                onClick={() =>
                  setActiveIndex(isOpen ? null : index)
                }
                className="w-full flex justify-between items-center px-8 py-6 text-left"
              >
                <span className="text-lg font-semibold">
                  {topic.title}
                </span>

                <ChevronDown
                  className={`text-red-600 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* CONTENT */}
              <div
                className={`px-8 transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[600px] pb-6" : "max-h-0"
                } overflow-hidden`}
              >
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {topic.points.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>

      {/* CERTIFICATE */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10">
        <img src="https://backstagepass.co.in/certificate-with-badge-265a0669.png" width={300} alt="Certificate" />
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Let Your Certificates Speak
          </h2>
          <ul className="space-y-3">
            <List text="Industry recognized certificate" />
            <List text="Shareable on LinkedIn" />
            <List text="Add to resume & portfolio" />
          </ul>
        </div>
      </section>

      {/* AFTER COURSE */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              After this Course, You will be Able to
            </h2>
            <ul className="space-y-3">
              <List text="Confidently navigate Maya interface" />
              <List text="Create optimized 3D props" />
              <List text="Work with modeling & UV mapping" />
              <List text="Apply industry best practices" />
            </ul>
          </div>
          <img src="https://backstagepass.co.in/afterwtwillhappen-15796db8.webp" />
        </div>
      </section>

      {/* COMPANIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Outer bordered container */}
      <div className="border-2 border-red-500 rounded-3xl px-10 py-12">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-10 gap-x-8 items-center justify-items-center">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="max-h-12 object-contain"
            />
          ))}
        </div>
      </div>
    </section>

      {/* SYSTEM REQUIREMENTS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT ILLUSTRATION */}
        <div className="flex justify-center">
          <img
            src="https://backstagepass.co.in/allyouneed-d0d99f31.webp"
            alt="System Requirements Illustration"
            className="max-w-md w-full"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">
            System Requirements for Autodesk Maya 2024
          </h2>

          <ul className="space-y-6">
            <Requirement text="Operating System: Windows®, Apple®, Linux®" />
            <Requirement text="RAM: 8 GB of RAM (16 GB or more recommended)" />
            <Requirement text="CPU: 64-bit Intel® or AMD® with SSE4.2 instruction set. For macOS, Apple Silicon arm64 or Intel x86" />
            <Requirement text="GPU: Certified graphics card (e.g., NVIDIA RTX series, Quadro) for smooth viewport." />
            <Requirement text="Storage: SSD for faster loading and performance." />
            <Requirement text="Disk Space: 7 GB of free disk space for installation." />
          </ul>
        </div>

      </div>
    </section>

     <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <h2 className="text-3xl font-medium text-[#2d2d2d] mb-12">
        This is the One for You, If You are
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card text="Someone who wants to start learning 3D modeling from the basics." />
        <Card text="A complete beginner with no prior experience in Autodesk Maya." />

        <Card text="A student exploring career options in animation, gaming, or VFX." />
        <Card text="An aspiring 3D artist looking to build foundational skills." />

        <Card text="A game design enthusiast who wants to create 3D assets." />
        <Card text="A professional from another field wanting to switch to 3D or CG workflows." />
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-20">

      {/* HEADING */}
      <h2 className="text-3xl font-medium text-[#2d2d2d] mb-4">
        Career Opportunities
      </h2>

      <p className="text-[16px] text-[#4a4a4a] mb-10">
        Once you complete this course, you can begin your journey as
      </p>

      {/* CAREER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <CareerCard text="3D Modeling & Texturing Artist" />
        <CareerCard text="3D Prop Artist" />
        <CareerCard text="3D Game Asset Artist" />
        <CareerCard text="Environment Artist" />
      </div>

      {/* DID YOU KNOW */}
      <div className="relative overflow-hidden rounded-2xl bg-[#a43a3a] text-white grid lg:grid-cols-2 items-center">

        {/* LEFT CONTENT */}
        <div className="p-12">
          <h3 className="text-3xl font-semibold mb-4">
            Did You Know?
          </h3>

          <p className="mb-4 text-white/90">
            The average salary is
          </p>

          <p className="text-5xl font-bold text-[#ffd24d] mb-2">
            4L
          </p>

          <p className="text-lg">
            /year in India
          </p>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="https://backstagepass.co.in/didyouneed-131b8fce.webp"
            alt="Career Illustration"
            className="max-h-[260px] w-auto"
          />
        </div>
      </div>

    </section>

      {/* FAQ */}
       <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">
        Frequently Asked Questions
      </h2>

      {/* FAQ LIST */}
      <div className="space-y-5">
        {faqs.map((item, index) => {
          const isOpen = open === index;

          return (
            <div
              key={item.q}
              className="bg-white rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            >
              {/* QUESTION */}
              <button
                onClick={() => setOpen(isOpen ? null : index)}
                className="w-full flex justify-between items-center px-8 py-6 text-left"
              >
                <span className="text-[16px] font-medium text-red-600">
                  {item.q}
                </span>

                <span className="text-red-600 text-xl font-semibold">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {/* ANSWER */}
              {isOpen && (
                <div className="px-8 pb-6 text-[15px] leading-[26px] text-[#444]">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
      {/* BOTTOM CTA */}
      <section className="bg-[#6d1c1c] text-white text-center py-16" id="page-enroll-cta">
        <h2 className="text-3xl font-bold mb-6">
          Enroll in the Basics of Maya Course
        </h2>
        <button onClick={() => setOpen1(true)} className="bg-red-600 px-12 py-4 rounded-full text-lg">
          Enroll @ ₹799
        </button>
      </section>
            <EnrollModal open={open1} onClose={() => setOpen1(false)} courseId='23' />

<div className="fixed bottom-0 left-0 w-full z-[9999]">
      <div className="bg-[#1f1f1f] h-20 flex items-center justify-center relative">
        <span className="absolute top-0 left-0 w-full h-[2px] bg-red-600" />
        <button onClick={() => {
    // if (!email) {
    //   signIn("google"); // or SSO redirect
    // } else {
      setOpen1(true);
    //}
  }} className="px-20 py-4 rounded-full bg-red-600 text-white">
          ENROLL NOW
        </button>
      </div>
    </div>
    </main>
  );
}

/* COMPONENTS */

// const Meta = ({ icon, label }: any) => (
//   <span className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full">
//     {icon} {label}
//   </span>
// );

const Feature = ({ text }: { text: string }) => (
  <div className="
    flex items-center gap-4
    bg-[#fafafa]
    px-6 py-5
    rounded-xl
    shadow-[0_2px_10px_rgba(0,0,0,0.04)]
  ">
    <Star
      className="text-red-600 shrink-0"
      size={28}
      strokeWidth={1.5}
    />
    <p className="text-[16px] text-[#1f1f1f]">
      {text}
    </p>
  </div>
);

const Award = ({ img, title }: { img: string; title: string }) => (
  <div className="relative rounded-2xl overflow-hidden shadow-lg group">
    {/* Image */}
    <img
      src={img}
      alt={title}
      className="w-full h-[260px] object-cover transition-transform duration-300 group-hover:scale-105"
    />

    {/* Overlay */}
    <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3">
      <p className="text-white text-sm font-medium leading-snug">
        {title}
      </p>
    </div>
  </div>
);

const List = ({ text }: any) => (
  <li className="flex items-center gap-3">
    <CheckCircle className="text-red-600" /> {text}
  </li>
);

const Faq = ({ q, a }: any) => (
  <details className="bg-gray-100 p-4 rounded-xl mb-3">
    <summary className="font-semibold cursor-pointer">{q}</summary>
    <p className="mt-2 text-gray-600">{a}</p>
  </details>
);

const logos = [
  { src: "https://backstagepass.co.in/r6-4428e17a.webp", alt: "EA Sports" },
  { src: "https://backstagepass.co.in/2-d40d819e.webp", alt: "Rockstar Games" },
  { src: "https://backstagepass.co.in/supergaming-9590ae14.png", alt: "SuperGaming" },
  { src: "https://backstagepass.co.in/r1-4dfae412.webp", alt: "Zynga" },
  { src: "https://backstagepass.co.in/r2-a450dbe9.webp", alt: "GameShastra" },
  { src: "https://backstagepass.co.in/Qualcomm-02b58aca.webp", alt: "Qualcomm" },

  { src: "https://backstagepass.co.in/Sony-6e9ef00f.webp", alt: "Sony" },
  { src: "https://backstagepass.co.in/r4-31e22ac4.webp", alt: "Lakshya Digital" },
  { src: "https://backstagepass.co.in/r5-2e345bac.webp", alt: "Little Red Zombies" },
  { src: "https://backstagepass.co.in/r7-4be35cee.webp", alt: "Hitwicket" },
  { src: "https://backstagepass.co.in/SumoDigital-c9cfd26c.webp", alt: "Sumo Digital" },
  { src: "https://backstagepass.co.in/GSNgames-d9a1517e.webp", alt: "GSN Games" },
  { src: "https://backstagepass.co.in/Ubisoft-e730ad76.webp", alt: "Ubisoft" },
  { src: "https://backstagepass.co.in/Juego-e5b53916.webp", alt: "Juego Studios" },
];

const Requirement = ({ text }: { text: string }) => (
  <li className="flex items-start gap-4">
    {/* Red checkbox */}
    <span className="mt-1 flex items-center justify-center w-5 h-5 rounded-sm bg-red-600">
      <svg
        className="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>

    <p className="text-[16px] leading-[28px] text-[#1f1f1f]">
      {text}
    </p>
  </li>
);

const Card = ({ text }: { text: string }) => (
  <div
    className="
      flex items-start gap-5
      bg-white
      px-8 py-6
      rounded-2xl
      shadow-[0_6px_20px_rgba(0,0,0,0.08)]
    "
  >
    {/* Red Check Icon */}
    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white text-xl font-bold shrink-0">
      ✓
    </span>

    {/* Text */}
    <p className="text-[16px] leading-[28px] text-[#1f1f1f]">
      {text}
    </p>
  </div>
);

const CareerCard = ({ text }: { text: string }) => (
  <div
    className="
      bg-[#fafafa]
      rounded-xl
      px-6 py-8
      flex flex-col items-center gap-4
      shadow-[0_4px_16px_rgba(0,0,0,0.06)]
    "
  >
    {/* Red icon */}
    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
      <svg
        className="w-6 h-6 text-red-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6l4 2"
        />
        <circle cx="12" cy="12" r="9" />
      </svg>
    </span>

    <p className="text-center text-[15px] text-[#1f1f1f]">
      {text}
    </p>
  </div>
);

const Meta = ({ title, sub }: any) => (
  <div className="py-6">
    <p className="font-semibold">{title}</p>
    <p className="text-sm text-gray-600">{sub}</p>
  </div>
);

const Divider = () => (
  <div className="w-[1px] bg-gray-200 my-4" />
);