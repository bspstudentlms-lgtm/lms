"use client";

import React, { useState, useRef, useEffect } from "react";
import "./DiplomaAndAdvancedDiplomaCourses121.css";
import { useSelector, shallowEqual } from "react-redux";
import { FaPlay, FaLinkedin } from "react-icons/fa";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Ourawards from "../../../content/ourawards";
import PaymentC from "./Payment";

// ✅ Images from public folder
const cer = "/assets/img/test/certificate-with-badge.png";
const advdip = "/assets/img/banners/Thumbnailformaya.png";
const wtwh = "/assets/img/banners/afterwtwillhappen.webp";
const wtaln = "/assets/img/banners/allyouneed.webp";

const partners = [
  "/assets/img/partners/r6.webp",
  "/assets/img/partners/2.webp",
  "/assets/img/partners/supergaming.png",
  "/assets/img/partners/r1.webp",
  "/assets/img/partners/r2.webp",
  "/assets/img/partners/Qualcomm.webp",
  "/assets/img/partners/Sony.webp",
  "/assets/img/partners/r4.webp",
  "/assets/img/partners/r5.webp",
  "/assets/img/partners/r7.webp",
  "/assets/img/partners/SumoDigital.webp",
  "/assets/img/partners/Juego.webp",
  "/assets/img/partners/Ubisoft.webp",
  "/assets/img/partners/GSNgames.webp",
];

export default function MayaClientPage() {
  // const isMobileState = useSelector(
  //   (state: any) => state.mainReducer.isMobile,
  //   shallowEqual
  // );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10;
      setIsButtonVisible(!atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePlay = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const faqs = [
    {
      q: "What is the Certificate Program in Basics of Maya?",
      a: "A beginner-friendly course introducing core Maya fundamentals.",
    },
    {
      q: "Do I need prior experience?",
      a: "No. The course starts from scratch.",
    },
    {
      q: "Will I get a certificate?",
      a: "Yes, after successful completion.",
    },
    {
      q: "Is this self-paced?",
      a: "Yes, fully online recorded content.",
    },
  ];

  const systemReq = [
    "Windows / macOS / Linux",
    "8GB RAM (16GB recommended)",
    "64-bit CPU",
    "Dedicated GPU preferred",
    "7GB free disk space",
  ];

  return (
    <>
      {openFormModal && (
        <PaymentC
          onClose={() => setOpenFormModal(false)}
          courseName="certificate-program-in-basics-of-maya"
        />
      )}

      <div id="scroll-container" className="scroll-wrapper">
        {/* HERO */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="col-8">
              <h1>Basics Of Maya for Beginners</h1>
              <p>
                Learn Autodesk Maya from scratch with practical exercises and
                real-world workflows.
              </p>

              <div className="disdvi">
                <del>₹4999</del>
                <span>₹799</span>
                <span className="savingamt">84% Disc.</span>
              </div>

              <button onClick={() => setOpenFormModal(true)}>
                Limited Time Offer
              </button>
            </div>

            <div className="col-4 videomain2maya">
              <video ref={videoRef} controls>
                <source
                  src="https://www.backstagepass.co.in/landingpage/LmsTrailerFinalLowRender.mp4"
                  type="video/mp4"
                />
              </video>

              {!isPlaying && (
                <div className="overlay-wrapper" onClick={handlePlay}>
                  <img src={advdip} alt="preview" />
                  <div className="play-icon">▶</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CERTIFICATE */}
        <section className="section-wrappercer">
          <img src={cer} alt="Certificate" />
          <div>
            <FaLinkedin size={28} color="#0A66C2" />
            <span> Shareable on LinkedIn</span>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="section-wrappercer">
          <h3>After this Course, You will be Able to</h3>
          <ul>
            <li>Create 3D assets</li>
            <li>Understand UV mapping</li>
            <li>Apply textures</li>
            <li>Export models</li>
          </ul>
        </section>

        {/* PARTNERS */}
        <section className="section-wrappercer">
          <h3>Our Learners Work Across Top Companies</h3>
          <div className="logo-grid-4">
            {partners.map((p, i) => (
              <img key={i} src={p} alt="partner" width={80} />
            ))}
          </div>
        </section>

        {/* SYSTEM REQUIREMENTS */}
        <section className="section-wrappercer">
          <img src={wtaln} alt="System" />
          <ul>
            {systemReq.map((s, i) => (
              <li key={i}>
                <CheckBoxIcon style={{ color: "#ec1923" }} /> {s}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="section-wrappercer">
          <h3>Frequently Asked Questions</h3>
          {faqs.map((f, i) => (
            <div key={i}>
              <button onClick={() => setActiveFAQ(i)}>
                {f.q}
              </button>
              {activeFAQ === i && <p>{f.a}</p>}
            </div>
          ))}
        </section>
      </div>

      {isButtonVisible && (
        <div
          className="CousellingButton1"
          onClick={() => setOpenFormModal(true)}
        >
          Enroll Now
        </div>
      )}
    </>
  );
}
