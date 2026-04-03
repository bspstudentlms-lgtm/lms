
"use client";

import React, { useEffect, useState } from "react";

import CourseCarouselNoScroll from "@/components/CourseCarouselNoScroll";
import SiteNavigation from "@/components/SiteNavigation";
import AppHeaders from "@/layout/AppHeaders";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

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

const topics = [
  {
    title: "Game Development Fundamentals",
    desc: "Understand game engines, core mechanics, physics systems, and gameplay logic."
  },
  {
    title: "C# Programming for Games",
    desc: "Master scripting, object-oriented concepts, player controls, and system architecture."
  },
  {
    title: "3D Character Creation",
    desc: "Learn sculpting, retopology, UV mapping, and game-ready asset workflows."
  },
  {
    title: "Environment & Level Design",
    desc: "Create immersive worlds with modular assets, lighting, and scene optimization."
  },
  {
    title: "Texturing & Materials",
    desc: "Build realistic materials and smart textures using industry-standard pipelines."
  },
  {
    title: "Gameplay Systems & Mechanics",
    desc: "Design combat systems, AI behaviors, UI systems, and interactive features."
  },
  {
    title: "Mobile Game Development",
    desc: "Optimize games for Android & iOS platforms with performance-focused techniques."
  },
  {
    title: "Game Design Principles",
    desc: "Learn player psychology, balancing, engagement loops, and progression systems."
  },
  {
    title: "Game Optimization & Publishing",
    desc: "Improve performance, fix bottlenecks, and deploy games to real platforms."
  }
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

	const [visibleTopics, setVisibleTopics] = useState(6);

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


	const [logoRef, logoApi] = useEmblaCarousel(
		{ loop: true, align: "start" },
		[Autoplay({ delay: 2500 })]
	);

	const scrollLogoPrev = () => logoApi && logoApi.scrollPrev();
	const scrollLogoNext = () => logoApi && logoApi.scrollNext();


	return (
		<>




			<div id="loader-wrapper">
				<div id="loader"></div>
				<div className="loader-section section-left"></div>
				<div className="loader-section section-right"></div>
			</div>



			{/* <SiteNavigation /> */}
			<AppHeaders />



			<section
				id="home"
				className="home_bg"
				style={{
					backgroundImage: "url(/assets/images/banner/home2.png)",
					backgroundSize: "cover",
					backgroundPosition: "center center",
				}}
			>

				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-sm-6 col-xs-12">
							<div className="home_content">
								<h1>Build <span>Games</span> <span>Build</span> Skills <br />Build <span>Your Future</span></h1>
								<p>Backstage Pass Online helps aspiring creators master game development through structured, industry-ready courses, real projects, and expert mentorship.</p>
							</div>
							<div className="home_btn">
								<a href="/all-courses" className="cta"><span>Explore Courses</span>
									<svg width="13px" height="10px" viewBox="0 0 13 10">
										<path d="M1,5 L11,5"></path>
										<polyline points="8 1 12 5 8 9"></polyline>
									</svg>
								</a>
							</div>
						</div>
						<div className="col-lg-6 col-sm-6 col-xs-12">
							<div className="home_me_img">
								<img src="images/home-image.png" style={{width: "85%"}} className="img-fluid" alt="" />
								<div className="home_ps">
									<img src="assets/images/icon/user2.svg" alt="" />
									<h2>3000+</h2>
									<span>Active Students</span>
								</div>
								<div className="home_ps2">
									<img src="assets/images/icon/file2.svg" alt="" />
									<h2>100+</h2>
									<span>Video Lessions</span>
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
								<h3>Practical Production Learning</h3>
								<p>We train you the way studios build games. From asset creation to final optimization, you’ll follow real production workflows that prepare you for internships, freelance projects, and full-time roles. The focus is not theory — it’s execution.</p>

							</div>
						</div>
						<div className="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
							<div className="single_tp">
								<h3>Expert Mentorship</h3>
								<p>Learn directly from experienced industry professionals who understand real production workflows. Our mentors guide you beyond theory, sharing practical insights, problem-solving techniques, and studio expectations to prepare you for real-world game development.</p>

							</div>
						</div>
						<div className="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s" data-wow-offset="0">
							<div className="single_tp">
								<h3>Structured Career Paths</h3>
								<p>We eliminate confusion by providing a clear roadmap. Whether you want to become a game programmer, character artist, or designer, our structured paths show you exactly what to learn, practice, and master to reach your goal.</p>

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
								<img src="images/about-bsp.png" className="img-fluid" alt="image" />

							</div>
						</div>
						<div className="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
							<div className="ab_content">
								<h2>Learn new skills to go  <span>ahead for your </span>  career</h2>
								<p>Backstage Pass Online is built for creators who want more than tutorials.</p>
							</div>
							<div className="abmv">
								<span className="ti-medall"></span>
								<h4>Our Mission</h4>
								<p>Our commitment is to provide industry-ready education that is accessible, outcome-driven, and built for real career growth.</p>
							</div>
							<div className="abmv">
								<span className="ti-wand"></span>
								<h4>Our Vision</h4>
								<p>Backstage Pass Online aims to bridge the gap between learning and employment by setting the standard for job-ready courses in the gaming industry.</p>
							</div>

						</div>
					</div>
				</div>
			</section>



			<section id="counts" className="counts section-padding">
				<div className="container" data-aos="fade-up">
					<div className="section-title">
						<h2>Recognition</h2>
						<p>Our <span> Journey </span> So Far </p>
					</div>
					<div className="row gy-4">
						<div className="col-lg-3 col-md-6">
							<div className="count-box">
								<i className="ti-medall" style={{ color: "#3b82f6" }}></i>
								<div>
									<span data-purecounter-start="0" className="purecounter">1500+</span>
									<p>Alumni</p>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="count-box">
								<i className="ti-cup" style={{ color: "#ee6c20" }}></i>
								<div>
									<span data-purecounter-start="0" className="purecounter">15+</span>
									<p>Years of Excellence</p>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="count-box">
								<i className="ti-star" style={{ color: "#15be56" }}></i>
								<div>
									<span data-purecounter-start="0" className="purecounter">4.3</span>
									<p>Student Rating</p>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="count-box">
								<i className="ti-briefcase" style={{ color: "#bb0852" }}></i>
								<div>
									<span data-purecounter-start="0" className="purecounter">100%</span>
									<p>Placement Support</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<br /><br />

			<div className="partner-logo section-padding">
				<div className="container">
					<div className="section-title">
						<h2>Our Learners</h2>
						<p> Work Across  <span> Top Companies </span></p>
					</div>
					<div className="row">
						<div className="col-lg-12 text-center">

							<div className="relative">

								{/* Left Arrow */}
								<button
									onClick={scrollLogoPrev}
									className="absolute left-[-25px] top-1/2 -translate-y-1/2 
        bg-[#FDECEC] text-[#E63946] hover:bg-[#F8D7DA]
        shadow-md rounded-full 
        w-10 h-10 flex items-center justify-center 
        transition duration-300 z-10"
								>
									←
								</button>

								{/* Right Arrow */}
								<button
									onClick={scrollLogoNext}
									className="absolute right-[-25px] top-1/2 -translate-y-1/2 
        bg-[#FDECEC] text-[#E63946] hover:bg-[#F8D7DA]
        shadow-md rounded-full 
        w-10 h-10 flex items-center justify-center 
        transition duration-300 z-10"
								>
									→
								</button>

								{/* Embla Viewport */}
								<div className="overflow-hidden" ref={logoRef}>
									<div className="flex items-center">

										{[
											"https://backstagepass.co.in/r6-4428e17a.webp",
											"https://backstagepass.co.in/2-d40d819e.webp",
											"https://backstagepass.co.in/supergaming-9590ae14.png",
											"https://backstagepass.co.in/r1-4dfae412.webp",
											"https://backstagepass.co.in/r7-4be35cee.webp",
											"https://backstagepass.co.in/r2-a450dbe9.webp",
											"https://backstagepass.co.in/Sony-6e9ef00f.webp",
											"https://backstagepass.co.in/Juego-e5b53916.webp",
											"https://backstagepass.co.in/r5-2e345bac.webp",
											"https://backstagepass.co.in/Gamitronics-d3bb8a73.webp",
											"https://backstagepass.co.in/SumoDigital-c9cfd26c.webp"
										].map((logo, index) => (
											<div
												key={index}
												className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33%] lg:flex-[0_0_20%] p-4"
											>
												<div className="bg-white shadow-sm rounded-xl p-4 flex items-center justify-center">
													<img
														src={logo}
														alt="partner"
														className="max-h-12 object-contain"
													/>
												</div>
											</div>
										))}

									</div>
								</div>

							</div>

						</div>
					</div>

				</div>
			</div>
			<br /><br />
			<section className="marketing_content_area section-padding">
				<div className="container">
					<div className="section-title">
						<h2>Why Choose Backstage Pass</h2>
						<p>Find The <span> Best Features  </span> Of Backstage Pass Online</p>
					</div>
					<div className="row">
						<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
							<div className="single_feature_one">
								<div className="sf_top">
									<span className="ti-book ss_five"></span>
									<h2><a target="_blank">Learn by Building</a></h2>
								</div>
								<p>Every course revolves around real production workflows used in studios.</p>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0">
							<div className="single_feature_one">
								<div className="sf_top">
									<span className="ti-user ss_five"></span>
									<h2><a target="_blank">Industry Mentors</a></h2>
								</div>
								<p>Train with professionals who ship games, not just teach theory.</p>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
							<div className="single_feature_one">
								<div className="sf_top">
									<span className="ti-direction   ss_five"></span>
									<h2><a target="_blank">Beginner to Pro Path</a></h2>
								</div>
								<p>Clear roadmaps guiding you from fundamentals to advanced pipelines.</p>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s" data-wow-offset="0">
							<div className="single_feature_one">
								<div className="sf_top">
									<span className="ti-clipboard ss_five"></span>
									<h2><a target="_blank">Project-Based Curriculum</a></h2>
								</div>
								<p>Create portfolio-ready assets, mechanics, and complete games.</p>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.5s" data-wow-offset="0">
							<div className="single_feature_one">
								<div className="sf_top">
									<span className="ti-time  ss_five"></span>
									<h2><a target="_blank">Flexible Learning</a></h2>
								</div>
								<p>Learn anytime with lifetime access and updates.</p>
							</div>
						</div>
						<div className="col-lg-4 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.6s" data-wow-offset="0">
							<div className="single_feature_one">
								<div className="sf_top">
									<span className="ti-briefcase ss_five"></span>
									<h2><a target="_blank">Career Focused</a></h2>
								</div>
								<p>Prepare for internships, freelance, or studio roles.</p>
							</div>
						</div>
					</div>
				</div>
			</section>



			<div className="best-cpurse section-padding">
				<div className="container">
					<div className="section-title">
						<h2>Popular Courses</h2>
						<p>Choose Our <span> Top Courses </span></p>
					</div>



					<CourseCarouselNoScroll />





				</div>
			</div>




			{/* <br /><br /> */}


			<section className="course_promo section-padding" style={{ display: "none" }}>
				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
							<div className="cp_content">
								<h4>Best Online Learning Platform</h4>
								<h2>One Platfrom & Many <span> Courses </span> For You</h2>
								<p>From blogs to emails to ad copies, auto-generate catchy, original, and high-converting copies in popular tones languages.</p>
								<ul>
									<li><span className="ti-check"></span>9/10 Average Satisfaction Rate</li>
									<li><span className="ti-check"></span>96% Completitation Rate</li>
									<li><span className="ti-check"></span>Friendly Environment & Expert Teacher</li>
								</ul>
							</div>
						</div>
						<div className="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0">
							<div className="cp_img">
								<img src="images/one.png" className="img-fluid" alt="image" />

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
			<br /><br />
			<section className="topic_content_area section-padding">
				<div className="container">
					<div className="section-title">
						<h2>Start Learning </h2>
						<p>Popular <span> Topics To Learn </span> From Today</p>
					</div>
					<div className="row">
						{topics.slice(0, visibleTopics).map((topic, index) => (
							<div key={index} className="col-lg-4 col-sm-6 col-xs-12">
							<div className="single_tca">
								<h2>
								<a>{topic.title}</a>
								</h2>
								<span>{topic.desc}</span>
							</div>
							</div>
						))}
					</div>
					<div className="text-center mt-4">
  <button
    className="btn_one"
    onClick={() =>
      setVisibleTopics(
        visibleTopics === 6 ? topics.length : 6
      )
    }
  >
    <span>
      {visibleTopics === 6 ? "View More" : "View Less"}
    </span>
  </button>
</div>
				</div>
			</section>

			{/* <section className="our-event section-padding">
		<div className="container">
			<div className="section-title">
				<h2>Upcoming Events</h2>
				<p>Join With Us <span> Our Events </span></p>
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
						<p>What Says <span> Our Students </span></p>
					</div>

					<SuccessCarousel />






				</div>
			</section>

			{/* <section className="team_home_area section-padding">
	   <div className="container">
			<div className="section-title">
				<h2>Team Member</h2>
				<p>Our Expert <span> Instructors </span></p>
			</div>		
			<div className="row">								
				<div className="col-lg-3 col-sm-6 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
					<div className="single-team-home">
						<div className="img"><img src="assets/images/all-img/team1.jpg" className="img-fluid" alt="" /></div>
						<div className="team-content-home">
							<h3>Marina Mojo</h3>
							<p>Developer</p>
							
							<ul className="social-home">
								<li><a className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a className="twitter-home"><i className="fa fa-twitter"></i></a></li>
								<li><a className="instagram-home"><i className="fa fa-instagram"></i></a></li>
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
								<li><a className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a className="twitter-home"><i className="fa fa-twitter"></i></a></li>
								<li><a className="instagram-home"><i className="fa fa-instagram"></i></a></li>
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
								<li><a className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a className="twitter-home"><i className="fa fa-twitter"></i></a></li>
								<li><a className="instagram-home"><i className="fa fa-instagram"></i></a></li>
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
								<li><a className="facebook-home"><i className="fa fa-facebook"></i></a></li>
								<li><a className="twitter-home"><i className="fa fa-twitter"></i></a></li>
								<li><a className="instagram-home"><i className="fa fa-instagram"></i></a></li>
							</ul>
						</div>
					</div>
				</div>																								
			</div>
		</div>
	</section> */}

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
									{/* <li><a>Digital Marketing</a></li>
									<li><a>SEO Business</a></li>
									<li><a>Social Marketing</a></li>
									<li><a>Graphic Design</a></li>
									<li><a>Website Development</a></li> */}
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
									<li><a>Terms of use</a></li>
									<li><a>Privacy Policy</a></li>
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
