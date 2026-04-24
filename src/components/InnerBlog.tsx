
"use client";

import React, { useEffect, useState } from "react";

import BlogAll from "@/components/BlogAll";
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

const InnerBlog = () => {
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

      <br /><br /><br />

	<section className="section-top" style={{padding: "80px 0px"}}>
		<div className="container">
			<div className="col-lg-10 offset-lg-1 text-center">
				<div className="section-top-title wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
					<h1>Single Blog</h1>
					<ul>
						<li><a href="index.html">Home</a></li>
						<li> / Single Blog</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	

  
	<section className="blog-page section-padding">
		<div className="container">	
			<div className="row">
				<div className="col-lg-8 col-sm-12 col-xs-12">
					<div className="arti_single">
						<div className="arti_img_two">
							<img src="assets/images/blog/3.png" className="img-fluid" alt="Blog image" />
						</div>
						<div className="arti_content ">
							<p>I almost couldn’t believe it was real! For my first test I had generate some website copy for me. I provided about 50 words to describe my business along with my business name. generated two variants of copy each with several paragraphs of professional sounding copy. I immediately shared the results with a friend who couldn’t believe it was written by an AI. is worth every penny and then some. Describe my business along with my business name. generated two variants of copy each with several paragraphs of professional sounding copy. I immediately shared the results with a friend who couldn’t believe it was written by an AI. is worth every penny and then some!</p>
						</div>
						<div className="arti_sp">
							<h2>Enhancing Your E-commerce Store With AI Writing Assistants</h2>
							<img src="assets/images/blog/1.png" className="img-fluid" alt="Blog image" />
							<p>I immediately shared the results with a friend who couldn’t believe it was written by an AI. is worth every penny and then some. Describe my business along with my business name. generated two variants of copy each with several paragraphs of professional sounding copy. I immediately shared the results with a friend who couldn’t believe it was written by an AI. is worth every penny and then some!</p>
						</div>
					
					</div>	
				
			
										
				</div>		
				<div className="col-lg-4 col-sm-12 col-xs-12">
					
					
					<div className="sidebar-post">
						<div className="sidebar_title"><h4>Popular post</h4></div>
						<div className="single_popular">
							<a href="single_blog.html"><img src="assets/images/blog/blog-1.png" alt="" /></a>
							<h5><a href="single_blog.html">Supercharging Your SEO Game with AI Writing Assistants</a></h5>
						</div>
						<div className="single_popular">
							<a href="single_blog.html"><img src="assets/images/blog/blog-2.png" alt="" /></a>
							<h5><a href="single_blog.html">AI Writing Assistants and the Future of Content Marketing</a></h5>
						</div>
						<div className="single_popular">
							<a href="single_blog.html"><img src="assets/images/blog/blog-3.png" alt="" /></a>
							<h5><a href="single_blog.html">Enhancing Your E-commerce Store With AI Writing Assistants.</a></h5>
						</div>
						<div className="single_popular">
							<a href="single_blog.html"><img src="assets/images/blog/blog-4.png" alt="" /></a>
							<h5><a href="single_blog.html">Building your content strategy cannot get easier than this.</a></h5>
						</div>
						<div className="single_popular">
							<a href="single_blog.html"><img src="assets/images/blog/blog-5.png" alt="" /></a>
							<h5><a href="single_blog.html">This is the only read you would need before sitting down to prepare</a></h5>
						</div>	
					</div>
          <div className="sidebar-post">
						<div className="newsletter-form">
							<h4>Enquire Now</h4>
							<form action="#" className="subscribe">
								<input type="text" className="subscribe__input" placeholder="Full Name" />
                <input type="text" className="subscribe__input" placeholder="Phone Number" />
                <input type="text" className="subscribe__input" placeholder="Email Address" />
                <input type="text" className="subscribe__input" placeholder="City" />
								<button type="button" className="sub_btn">Submit</button>
							</form>
						</div>						
					</div>
									
					<div className="sidebar-post">
						<div className="sidebar_title"><h4>CATEGORIES</h4></div>
						<div className="single_category">
							<ul>
								<li><a href="#">Education <sup>11</sup></a></li>
								<li><a href="#">Ai Content <sup>44</sup></a></li>
								<li><a href="#">New Course <sup>33</sup></a></li>
								<li><a href="#">Marketing <sup>14</sup></a></li>
								<li><a href="#">Software <sup>21</sup></a></li>
								<li><a href="#">Design <sup>01</sup></a></li>
							</ul>
						</div>
					</div>
					<div className="sidebar-post">
						<div className="tag">
							<div className="sidebar_title"><h4>Popular Tag</h4></div>
							<a href="#">Education</a>
							<a href="#">Course</a>
							<a href="#">Event</a>
							<a href="#">copywriting</a>
							<a href="#">Graphic</a>
							<a href="#">Clean Design</a>
							<a href="#">Digital Marketing</a>
							<a href="#">All project</a>
							
						</div>					
					</div>					
							
				</div>					
			</div>
		</div>
	</section>
			








      <div className="footer section-padding" style={{ paddingTop: "80px" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6 col-xs-12">
              <div className="single_footer">
                <a><img src="images/Bsp_White.png" alt="" /></a>
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
        "<span className='owl-prev-icon'>&larr;</span>",
        "<span className='owl-next-icon'>&rarr;</span>"
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

export default InnerBlog;
