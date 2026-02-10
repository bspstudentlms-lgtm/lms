
"use client";

import React, { useEffect, useState } from "react";

import CourseCarouselNoScroll from "@/components/CourseCarouselNoScroll";


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
  const initOwl = () => {
    if (
      typeof window !== "undefined" &&
      (window as any).$ &&
      (window as any).$.fn.owlCarousel
    ) {
      const $ = (window as any).$;

      // Destroy if already initialized (important for Next.js HMR)
      if ($("#testimonial-slider").hasClass("owl-loaded")) {
        $("#testimonial-slider").trigger("destroy.owl.carousel");
        $("#testimonial-slider").removeClass("owl-loaded");
        $("#testimonial-slider").find(".owl-stage-outer").children().unwrap();
      }

      $("#testimonial-slider").owlCarousel({
        items: 3,
        loop: true,
        margin: 30,
        nav: true,          // ✅ arrows enabled
        dots: false,
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
      setTimeout(initOwl, 200); // wait for scripts
    }
  };

  initOwl();
}, []);

useEffect(() => {
  const initLogoCarousel = () => {
    if (
      typeof window !== "undefined" &&
      (window as any).$ &&
      (window as any).$.fn.owlCarousel
    ) {
      const $ = (window as any).$;

      $("#logo-carousel").owlCarousel({
        loop: true,
        margin: 60,
        autoplay: true,
        autoplayTimeout: 0,      // 👈 continuous
        autoplaySpeed: 5000,
        smartSpeed: 5000,
        slideTransition: "linear",
        dots: false,
        nav: false,
        autoplayHoverPause: false,
        responsive: {
          0: { items: 2 },
          600: { items: 3 },
          1000: { items: 5 }
        }
      });
    } else {
      setTimeout(initLogoCarousel, 200);
    }
  };

  initLogoCarousel();
}, []);


useEffect(() => {
  const initScripts = () => {
    if (typeof window !== "undefined" && window.WOW) {
      new window.WOW().init();
    }

    if (window.$ && $("#main-menu").length) {
      $("#main-menu").slicknav({
        prependTo: "#mobile_menu",
        label: "",
      });
    }
  };

  // Delay ensures DOM is ready
  const timer = setTimeout(initScripts, 500);

  return () => clearTimeout(timer);
}, []);
useEffect(() => {
  const loader = document.getElementById("loader-wrapper");
  if (loader) {
    setTimeout(() => {
      loader.style.display = "none";
    }, 800); // hide after mount
  }
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
	
	
	  
	<div id="navigation" className="fixed-top navbar-light bg-faded site-navigation">
		<div className="container">
			<div className="row dfm">
				<div className="col-lg-3 col-md-3 col-sm-4 dfa">
					<div className="site-logo">
						<a href="index.html"><img src="https://backstagepass.co.in/newlogo-324ee245.webp" alt="" /></a>          			        				
					</div>
				</div>
				
				<div className="col-lg-4 col-md-3 col-sm-8">
          <div className="dfe"> 
					<div className="home_lc">
						<a href="#" className="hlc">
						  <i className="ti-heart"></i>
						  <span className="gactive">0</span>
					   </a>
					</div>
					<div className="call_to_action">
						<a className="btn_one" href="login.html">Login</a>
					</div>
          </div>				
				</div>
			</div>
		</div>
	</div> 	  
	
								
	
	<section
  id="home"
  className="home_bg"
  style={{
    backgroundImage: "url(/assets/images/banner/home.png)",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  }}
>

		<div className="container">
			<div className="row">
				<div className="col-lg-6 col-sm-6 col-xs-12">	
					<div className="home_content">
						<h1>Better <span>Learning Future</span> Starts With Bsp</h1>
						<p>It is a long established fact that reader will be distracted readable content of a page when.</p>						
					</div>
					<div className="home_btn">
						<a href="#" className="cta"><span>Explore Courses</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10">
							<path d="M1,5 L11,5"></path>
							<polyline points="8 1 12 5 8 9"></polyline>
						  </svg>
						</a>
					</div>		
				</div>
				<div className="col-lg-6 col-sm-6 col-xs-12">	
					<div className="home_me_img">
						<img src="assets/images/all-img/home-image.png" className="img-fluid" alt="" />
						<div className="home_ps">
							<img src="assets/images/icon/user2.svg" alt="" />
							<h2>7500+</h2>
							<span>Active student</span>
						</div>
						<div className="home_ps2">
							<img src="assets/images/icon/file2.svg" alt="" />
							<h2>4500+</h2>
							<span>Online Course</span>
						</div>
					</div>		
				</div>
			</div>			
		</div>
	</section>
	

	
	<section className="tp_feature">
	   <div className="container-fluid">			
			<div className="row">					
				<div className="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0">
					<div className="single_tp">
						<h3>Quality Education</h3>
						<p>Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusmod tempor incididunt ut labore.</p>
						<a href="#" className="cta"><span>Explore</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10">
							<path d="M1,5 L11,5"></path>
							<polyline points="8 1 12 5 8 9"></polyline>
						  </svg>
						</a>
					</div>
				</div>			
				<div className="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
					<div className="single_tp">
						<h3>Experienced Teachers</h3>
						<p>Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusmod tempor incididunt ut labore.</p>
						<a href="#" className="cta"><span>Explore</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10">
							<path d="M1,5 L11,5"></path>
							<polyline points="8 1 12 5 8 9"></polyline>
						  </svg>
						</a>
					</div>
				</div>			
				<div className="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s" data-wow-offset="0">
					<div className="single_tp">
						<h3>Delicious Food</h3>
						<p>Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusmod tempor incididunt ut labore.</p>
						<a href="#" className="cta"><span>Explore</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10">
							<path d="M1,5 L11,5"></path>
							<polyline points="8 1 12 5 8 9"></polyline>
						  </svg>
						</a>
					</div>
				</div>							
			</div>
		</div>
	</section>
		

	
	<section className="ab_one section-padding">
		<div className="container">									
			<div className="row">								
				<div className="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0">
					<div className="ab_img">
						<img src="assets/images/all-img/about1.png" className="img-fluid" alt="image" />
						
					</div>
				</div>					
				<div className="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
					<div className="ab_content">
						<h2>Learn new skills to go <u><span>ahead for your </span></u> career.</h2>
						<p>Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusmod tempor incididunt ut labore et simply.</p>
					</div>
					<div className="abmv">
						<span className="ti-medall"></span>
						<h4>Our Mission</h4>
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ut labore.</p>
					</div>
					<div className="abmv">
						<span className="ti-wand"></span>
						<h4>Our Vision</h4>
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ut labore.</p>
					</div>	
						<a className="btn_one" href="about.html">Discover More</a>
				</div>								  
			</div>
		</div>
	</section>
		

	
    <section id="counts" className="counts section-padding">
      <div className="container" data-aos="fade-up">
		<div className="section-title">
		  <h2>Some Fun Fact</h2>
		  <p>Our Great <span><u>Achievement</u></span></p>
		</div>	  
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <div className="count-box">
              <i className="ti-face-smile"></i>
              <div>
                <span data-purecounter-start="0" className="purecounter">8232</span>
                <p>Enrolled Students</p>
              </div>
            </div>
          </div>		
          <div className="col-lg-3 col-md-6">
            <div className="count-box">
              <i className="ti-files" style={{ color: "#ee6c20" }}></i>
              <div>
                <span data-purecounter-start="0" className="purecounter">521</span>
                <p>Academic Programs</p>
              </div>
            </div>
          </div>		
          <div className="col-lg-3 col-md-6">
            <div className="count-box">
              <i className="ti-headphone-alt" style={{ color: "#15be56" }}></i>
              <div>
                <span data-purecounter-start="0" className="purecounter">163</span>
                <p>Winning Award</p>
              </div>
            </div>
          </div>		
          <div className="col-lg-3 col-md-6">
            <div className="count-box">
              <i className="ti-user" style={{ color: "#bb0852" }}></i>
              <div>
                <span data-purecounter-start="0" className="purecounter">93</span>
                <p>Certified Students</p>
              </div>
            </div>
          </div>		
        </div>		
      </div>		
    </section>	
		
	
	
	<div className="partner-logo section-padding">
		<div className="container">
			<div className="row">
				<div className="col-lg-12 text-center">
					<div className="partner_title">
						<h3>Trusted Company Arround The World! </h3>
					</div>
					<div className="partner owl-carousel" id="logo-carousel">
						<a href="#"><img src="https://backstagepass.co.in/r2-a450dbe9.webp" alt="image" /></a>
						<a href="#"><img src="https://backstagepass.co.in/Qualcomm-02b58aca.webp" alt="image" /></a>
						<a href="#"><img src="https://backstagepass.co.in/r4-31e22ac4.webp" alt="image" /></a>
						<a href="#"><img src="https://backstagepass.co.in/GSNgames-d9a1517e.webp" alt="image" /></a>
						<a href="#"><img src="https://backstagepass.co.in/r5-2e345bac.webp" alt="image" /></a>
						<a href="#"><img src="assets/images/all-img/clients/1.png" alt="image" /></a>
						<a href="#"><img src="assets/images/all-img/clients/3.png" alt="image" /></a>
						<a href="#"><img src="assets/images/all-img/clients/4.png" alt="image" /></a>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<section className="marketing_content_area section-padding">
	   <div className="container">
			<div className="section-title">
				<h2>Why Choose Bsp</h2>
				<p>Find the <span><u>best features</u></span> of Bsp.</p>
			</div>		
			<div className="row">									
				<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
					<div className="single_feature_one">
						<div className="sf_top">
							<span className="ti-book ss_one"></span>
							<h2><a href="single-service.html" target="_blank">Learn More Anywhere</a></h2>
						</div>
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ut labore.</p>
					</div>					
				</div>								
				<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0">
					<div className="single_feature_one">
						<div className="sf_top">
							<span className="ti-heart ss_two"></span>
							<h2><a href="single-service.html" target="_blank">Expert <br />Instructor</a></h2>
						</div>	
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ut labore.</p>
					</div>					
				</div>								
				<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
					<div className="single_feature_one">
						<div className="sf_top">
							<span className="ti-user ss_three"></span>
							<h2><a href="single-service.html" target="_blank">Team <br />Management</a></h2>
						</div>	
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ut labore.</p>
					</div>					
				</div>								
				<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s" data-wow-offset="0">
					<div className="single_feature_one">
						<div className="sf_top">
							<span className="ti-eye ss_four"></span>
							<h2><a href="single-service.html" target="_blank">Course <br /> Planing</a></h2>
						</div>	
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ut labore.</p>
					</div>					
				</div>								
				<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.5s" data-wow-offset="0">
					<div className="single_feature_one">
						<div className="sf_top">
							<span className="ti-light-bulb ss_five"></span>
							<h2><a href="single-service.html" target="_blank">Teacher Monitoring</a></h2>
						</div>		
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ut labore.</p>
					</div>					
				</div>								
				<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.6s" data-wow-offset="0">
					<div className="single_feature_one">
						<div className="sf_top">
							<span className="ti-email ss_six"></span>
							<h2><a href="single-service.html" target="_blank">24/7 Strong Support</a></h2>
						</div>		
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ut labore.</p>
					</div>					
				</div>																
			</div>
		</div>
	</section>
	
	
	
	<div className="best-cpurse section-padding">
          <div className="container">
            <div className="section-title">
              <h2>Popular Courses</h2>
              <p>Choose Our <span><u>Top Courses</u></span></p>
            </div>
            
              
              
              <CourseCarouselNoScroll />
              
              
              
              
           
          </div>
        </div>

 
      

	
	
	
	<section className="course_promo section-padding">
		<div className="container">									
			<div className="row">								
				<div className="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
					<div className="cp_content">
						<h4>Best Online Learning Platform</h4>
						<h2>One Platfrom & Many <span><u>Courses</u></span> For You</h2>
						<p>From blogs to emails to ad copies, auto-generate catchy, original, and high-converting copies in popular tones languages.</p>
						<ul>
							<li><span className="ti-check"></span>9/10 Average Satisfaction Rate</li>
							<li><span className="ti-check"></span>96% Completitation Rate</li>
							<li><span className="ti-check"></span>Friendly Environment & Expert Teacher</li>
						</ul>
					</div>
					<div className="cp_btn">
						<a href="#" className="cta"><span>Explore Our Courses</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10">
							<path d="M1,5 L11,5"></path>
							<polyline points="8 1 12 5 8 9"></polyline>
						  </svg>
						</a>
					</div>
				</div>						
				<div className="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0">
					<div className="cp_img">
						<img src="assets/images/all-img/promo.png" className="img-fluid" alt="image" />
					
					</div>
				</div>			  
			</div>
		</div>
	</section>
		
	
	
	{/* <section className="newsletter_area section-padding">
		<div className="container">
			<div className="row text-center">			
				<div className="col-lg-6 offset-lg-3 col-sm-12 col-xs-12">
					<div className="subs_form">
						<h3>Subscripbe to our newsletter, We don't make any spam.</h3>
						<p>Lorem ipsum dolor sit amet consectetur adipisicing elitsed eiusmod tempor enim minim</p>
						<form action="#" className="home_subs">
							<input type="text" className="subscribe__input" placeholder="Enter your Email Address" />
							<button type="button" className="subscribe__btn"><i className="fa fa-paper-plane-o"></i></button>
						</form>
					</div>
				</div>
			</div>	
		</div>	
	</section> */}
	
	<section className="topic_content_area section-padding">
	   <div className="container">
			<div className="section-title">
				<h2>Start Learning </h2>
				<p>Popular <span><u>Topics To Learn</u></span> From Today.</p>
			</div>		
			<div className="row">									
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="single_tca">
						<img src="assets/images/icon/ct1.svg" alt="" />
						<h2><a href="#">UI/UX Design</a></h2>
						<span>71 Courses</span>
					</div>					
				</div>							
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="single_tca">
						<img src="assets/images/icon/ct2.svg" alt="" />
						<h2><a href="#">Digital Program</a></h2>
						<span>59 Courses</span>
					</div>					
				</div>							
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="single_tca">
						<img src="assets/images/icon/ct3.svg" alt="" />
						<h2><a href="#">Finance</a></h2>
						<span>68 Courses</span>
					</div>					
				</div>							
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="single_tca">
						<img src="assets/images/icon/ct4.svg" alt="" />
						<h2><a href="#">Modern Physics</a></h2>
						<span>83 Courses</span>
					</div>					
				</div>							
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="single_tca">
						<img src="assets/images/icon/ct5.svg" alt="" />
						<h2><a href="#">Music Production</a></h2>
						<span>37 Courses</span>
					</div>					
				</div>							
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="single_tca">
						<img src="assets/images/icon/ct6.svg" alt="" />
						<h2><a href="#">Data Science</a></h2>
						<span>51 Courses</span>
					</div>					
				</div>																								
			</div>
		</div>
	</section>
	
	{/* <section className="our-event section-padding">
		<div className="container">
			<div className="section-title">
				<h2>Upcoming Events</h2>
				<p>Join With Us <span><u>Our Events</u></span></p>
			</div>				
			<div className="row">				
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="event-slide">
						<div className="event-img">
							<img src="assets/images/event/e1.png" alt="" />
							<div className="event-date">
								<span className="date">20</span>
								<span className="month">Oct</span>
							</div>
						</div>
						<div className="event-content">
							<h3><a href="event.html">Electrical Engineering of Batparder new event</a></h3>
							<span><i className="fa fa-clock-o"></i>10.00AM - 12.00PM</span>
							<span><i className="fa fa-table"></i><strong>At Penn School</strong></span>
							<p>Lorem ipsum dolor sit amet magna consectetur adipisicing elit.</p>
						</div>
					</div>
				</div>	
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="event-slide">
						<div className="event-img">
							<img src="assets/images/event/e2.png" alt="" />
							<div className="event-date">
								<span className="date">22</span>
								<span className="month">Oct</span>
							</div>
						</div>
						<div className="event-content">
							<h3><a href="event.html">Architecture Design of International Art Fair 2023</a></h3>
							<span><i className="fa fa-clock-o"></i>10.00AM - 12.00PM</span>
							<span><i className="fa fa-table"></i><strong>At Penn School</strong></span>
							<p>Lorem ipsum dolor sit amet magna consectetur adipisicing elit.</p>
						</div>
					</div>
				</div>	
				<div className="col-lg-4 col-sm-6 col-xs-12">
					<div className="event-slide es">
						<div className="ed_mb">
							<span className="date">26</span>
							<span className="month">Oct</span>
						</div>							
						<div className="event-content ec_pd">
							<h3><a href="event.html">Chiter astana event</a></h3>
							<span><i className="fa fa-clock-o"></i>10.00AM - 12.00PM</span>
							<span><i className="fa fa-table"></i><strong>At Penn School</strong></span>
							<p>Lorem ipsum dolor sit amet magna consectetur adipisicing elit.</p>
						</div>
					</div>
					<div className="event-slide es">
						<div className="ed_mb">
							<span className="date">29</span>
							<span className="month">Oct</span>
						</div>	
						<div className="event-content ec_pd">						
							<h3><a href="event.html">Dasel Bhai Program</a></h3>
							<span><i className="fa fa-clock-o"></i>10.00AM - 12.00PM</span>
							<span><i className="fa fa-table"></i><strong>At Penn School</strong></span>
							<p>Lorem ipsum dolor sit amet magna consectetur adipisicing elit.</p>							
						</div>
					</div>	
				</div>	
			</div>
		</div>			
	</section> */}
		
	
	
	<section className="testi_home_area section-padding">
	   <div className="container">
			<div className="section-title">
				<h2>Testimonial</h2>
				<p>What Says <span><u>Our Students</u></span></p>
			</div>		
			
            <SuccessCarousel />
						
						
					
					
					
					
		</div>
	</section>
	
	{/* <section className="team_home_area section-padding">
	   <div className="container">
			<div className="section-title">
				<h2>Team Member</h2>
				<p>Our Expert <span><u>Instructors</u></span></p>
			</div>		
			<div className="row">								
				<div className="col-lg-3 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
					<div className="single-team-home">
						<div className="img"><img src="assets/images/all-img/team1.jpg" className="img-fluid" alt="" /></div>
						<div className="team-content-home">
							<h3>Marina Mojo</h3>
							<p>Developer</p>
							
							<ul className="social-home">
								<li><a href="#" className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a href="#" className="twitter-home"><i className="fa fa-twitter"></i></a></li>
								<li><a href="#" className="instagram-home"><i className="fa fa-instagram"></i></a></li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-lg-3 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0">
					<div className="single-team-home">
						<div className="img"><img src="assets/images/all-img/team2.jpg" className="img-fluid" alt="" /></div>
						<div className="team-content-home">
							<h3>Ayoub Fennouni</h3>
							<p>Logo Expert</p>
							<ul className="social-home">
								<li><a href="#" className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a href="#" className="twitter-home"><i className="fa fa-twitter"></i></a></li>
								<li><a href="#" className="instagram-home"><i className="fa fa-instagram"></i></a></li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-lg-3 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
					<div className="single-team-home">
						<div className="img"><img src="assets/images/all-img/team3.jpg" className="img-fluid" alt="" /></div>
						<div className="team-content-home">
							<h3>Mark Linomi</h3>
							<p>Marketer</p>
							<ul className="social-home">
								<li><a href="#" className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a href="#" className="twitter-home"><i className="fa fa-twitter"></i></a></li>
								<li><a href="#" className="instagram-home"><i className="fa fa-instagram"></i></a></li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-lg-3 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s" data-wow-offset="0">
					<div className="single-team-home">
						<div className="img"><img src="assets/images/all-img/team4.jpg" className="img-fluid" alt="" /></div>
						<div className="team-content-home">
							<h3>Amira Yerden</h3>
							<p>UI/UX Designer</p>
							<ul className="social-home">
								<li><a href="#" className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a href="#" className="twitter-home"><i className="fa fa-twitter"></i></a></li>
								<li><a href="#" className="instagram-home"><i className="fa fa-instagram"></i></a></li>
							</ul>
						</div>
					</div>
				</div>																								
			</div>
		</div>
	</section> */}
	
	<div className="footer section-padding">
		<div className="container">				
			<div className="row">						
				<div className="col-lg-3 col-sm-6 col-xs-12">
					<div className="single_footer">
						<a href="index.html"><img src="https://backstagepass.co.in/newlogo-324ee245.webp" alt="" /></a>         
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae risus nec dui venenatis dignissim.</p>
					</div>		
				</div>						
				<div className="col-lg-3 col-sm-6 col-xs-12">
					<div className="single_footer">
						<h4>Courses</h4>
						<ul>
							<li><a href="#">Creative Writing</a></li>
							<li><a href="#">Digital Marketing</a></li>
							<li><a href="#">SEO Business</a></li>
							<li><a href="#">Social Marketing</a></li>
							<li><a href="#">Graphic Design</a></li>
							<li><a href="#">Website Development</a></li>
						</ul>
					</div>
				</div>	
				<div className="col-lg-3 col-sm-6 col-xs-12">
					<div className="single_footer">
						<h4>Company</h4>
						<ul>
							<li><a href="#">About us</a></li>
							<li><a href="#">Knowledge Base</a></li>
							<li><a href="#">Affiliate Program</a></li>
							<li><a href="#">Community</a></li>
							<li><a href="#">Market API</a></li>						
							<li><a href="#">Support team</a></li>						
						</ul>
					</div>
				</div>	
				<div className="col-lg-3 col-sm-6 col-xs-12">
					<div className="single_footer">
						<h4>Contact Info</h4>
						<div className="sf_contact">
							<span className="ti-mobile"></span>
							<h3>Phone number</h3>
							<p>+91-8008002794</p>
						</div>
						<div className="sf_contact">
							<span className="ti-email"></span>
							<h3>Email Address</h3>
							<p>info@backstagepass.co.in</p>
						</div>
						<div className="sf_contact">
							<span className="ti-map"></span>
							<h3>Office Address</h3>
							<p>Plot No. 72, Jubilee Enclave, HITEC City, Hyderabad, Telangana 500081</p>
						</div>
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
							<li><a href="#">Cookie Policy</a></li>
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
