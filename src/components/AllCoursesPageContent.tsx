
"use client";

import React, { useEffect, useState } from "react";

import CourseCarouselNoScrollAll from "@/components/CourseCarouselNoScrollAll";
import SiteNavigation from "@/components/SiteNavigation";
import AppHeaders from "@/layout/AppHeaders";

import SuccessCarousel from "@/components/SuccessCarousel";
import Corporate from "@/components/Corporate";
import HeroSection from "@/components/HeroSection";
import ResourceBanner from "@/components/ResourceBanner";
import Footer from "@/components/Footer";
import Script from "next/script";


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

export const metadata = {
  title: "Find the Best Online Game Development Courses | Backstage Pass Online",
  description:
    "Discover top online gaming courses to learn game design, programming, and game art. Study anytime with flexible self-paced lessons.",
};

const HomePageContent = () => {
  const [current, setCurrent] = useState(0);

  const [currents, setCurrents] = useState(0);

  useEffect(() => {
    const links = [
      "/assets/bootstrap/css/bootstrap.min.css",
      "/assets/fonts/font-awesome.min.css",
      "/assets/fonts/themify-icons.css",
      "/assets/owlcarousel/css/owl.carousel.css",
      "/assets/owlcarousel/css/owl.theme.css",
      "/assets/css/slicknav.css",
      "/assets/css/magnific-popup.css",
      "/assets/css/animate.css",
      "/assets/css/style.css",
    ];

    const addedLinks: HTMLLinkElement[] = [];

    links.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
        addedLinks.push(link);
      }
    });

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      addedLinks.forEach((link) => {
        document.head.removeChild(link);
      });
    };
  }, []);


  useEffect(() => {
    const handleLoad = () => {
      document.body.classList.add("loaded");

      setTimeout(() => {
        const loader = document.getElementById("loader-wrapper");
        if (loader) loader.style.display = "none";
      }, 900);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);


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
    <>




      <div id="loader-wrapper">
        <div id="loader"></div>
        <div className="loader-section section-left"></div>
        <div className="loader-section section-right"></div>
      </div>



      {/* <SiteNavigation /> */}

      <AppHeaders />

      <br /><br /><br /><br />


      <div className="best-cpurse section-padding">
        <div className="container">
          <div className="section-title">
            <h2>Popular Courses</h2>
            <p>Choose Our <span>Top Courses</span></p>
          </div>



          <CourseCarouselNoScrollAll />





        </div>
      </div>








      <div className="footer section-padding" style={{ paddingTop: "80px" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6 col-xs-12">
              <div className="single_footer">
                <a href="#"><img src="images/Bsp_White.png" alt="" /></a>
                <p>Building future game developers through structured, practical learning.
                  Create real projects. Build real skills. Grow your career.
                </p>
                <ul className="social-home">
								<li><a href="https://www.facebook.com/profile.php?id=61588089197582" target="_blank" className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a href="https://www.youtube.com/@backstagepass_online" target="_blank" className="twitter-home"><i className="fa fa-youtube"></i></a></li>
								<li><a href="https://www.instagram.com/onlinebackstagepass/" target="_blank" className="instagram-home"><i className="fa fa-instagram"></i></a></li>
							</ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-xs-12">
              <div className="single_footer">
                <h4>Courses</h4>
                <ul>
                  <li><a target="_blank" href="/basics-of-maya-for-beginners">Basics of Maya for Beginners</a></li>
                  {/* <li><a href="#">Digital Marketing</a></li>
									<li><a href="#">SEO Business</a></li>
									<li><a href="#">Social Marketing</a></li>
									<li><a href="#">Graphic Design</a></li>
									<li><a href="#">Website Development</a></li> */}
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-xs-12">
              <div className="single_footer">
                <h4>Free Webinars</h4>
                <ul>
                  <li><a target="_blank" href="/the-art-of-material-creation-in-substance-designer">The Art of Material Creation in Substance Designer</a></li>
                  <li><a target="_blank" href="/Build-a-Game-In-Just-1-Hour">Build a Game In Just 1 Hour!</a></li>
                  <li><a target="_blank" href="https://backstagepass.co.in/landingpage/certificate-program-in-essentials-of-game-design/">Build A Game-ready 3D Characters Like A Pro</a></li>
                  <li><a target="_blank" href="/organic-material-creation-using-substance-designer">Organic Material Creation Using Substance Designer</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-xs-12">
              <div className="single_footer">
                <h4>Contact Info</h4>
                <div className="sf_contact">
  <span className="ti-mobile"></span>
  <h3>Phone number</h3>
  <p>
    <a href="tel:+918065912040">
      +91-8065912040
    </a>
  </p>
</div>
                <div className="sf_contact">
                  <span><i className="fa fa-whatsapp"></i></span>
                  <h3>Whatsapp</h3>
                  <p><a
      href="https://wa.me/919985677746"
      target="_blank"
      rel="noopener noreferrer"
    >
      +91-9985677746
    </a></p>
                </div>
                <div className="sf_contact">
                  <span className="ti-email"></span>
                  <h3>Email Address</h3>
                  <p><a href="mailto:learning@backstagepass.co.in?subject=Course Inquiry&body=Hi, I am interested in your courses">
  learning@backstagepass.co.in
</a></p>
                </div>
                {/* <div className="sf_contact">
                  <span className="ti-map"></span>
                  <h3>Office Address</h3>
                  <p>Plot No. 72, Jubilee Enclave, HITEC City, Hyderabad, Telangana 500081</p>
                </div> */}
              </div>
            </div>
          </div>
          <div className="row fc">
            <div className="col-lg-6 col-sm-6 col-xs-12">
              <div className="footer_copyright">
                <p>&copy; 2026. All Rights Reserved.</p>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-xs-12">
              <div className="footer_menu">
                <ul>
                  <li><a href="#">Terms of use</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>

        {/* <div className="relative w-full mx-auto">
     
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

     
    </div> */}








        {/* <main className="px-4 py-3 sm:p-6">
      <Corporate />
    </main> */}
        {/* 
       <main className="px-4 py-3 sm:p-6">
      <HeroSection />
    </main> */}

        {/* <main className="px-4 py-3 sm:p-6">
      <ResourceBanner />
    </main> */}

        {/* <main>
      <Footer />
    </main> */}






      </div>

      <>
        {/* jQuery FIRST */}
        <Script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />

        {/* Bootstrap */}
        <Script
          src="/assets/bootstrap/js/bootstrap.min.js"
          strategy="afterInteractive"
        />

        {/* Plugins */}
        <Script
          src="/assets/js/jquery.slicknav.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/owlcarousel/js/owl.carousel.min.js"
          strategy="afterInteractive"
        />

        <Script
          id="testimonial-carousel-init"
          strategy="afterInteractive"
        >
          {`
  if (window.$ && $.fn.owlCarousel) {
    $("#testimonial-slider").owlCarousel({
      items: 3,
      loop: true,
      margin: 30,
      dots: false,
      nav: true,
      autoplay: true,
      autoplayTimeout: 4000,
      navText: [
        "<span class='owl-prev-icon'>&larr;</span>",
        "<span class='owl-next-icon'>&rarr;</span>"
      ],
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        1024: { items: 3 }
      }
    });
  } else {
    console.error("OwlCarousel not loaded");
  }
`}
        </Script>


        <Script
          src="/assets/js/purecounter_vanilla.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/js/wow.min.js"
          strategy="afterInteractive"
        />
      </>
      {/* OPTIONAL: Remove scripts.js later */}
      {/* <Script src="/assets/js/scripts.js" strategy="afterInteractive" /> */}

    </>
  );
};

export default HomePageContent;
