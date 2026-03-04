"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Script from "next/script";
import MuxPlayer from '@mux/mux-player-react';
import SiteNavigation from "@/components/SiteNavigation";
import { useSidebar } from "@/context/SidebarContext";
import AppHeaders from "@/layout/AppHeaders";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


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

const awards = [
  {
    img: "https://backstagepass.co.in/ET_Achievers_2025-a03e9ae8.webp",
    title: "ET Industry Achievers 2025",
  },
  {
    img: "https://backstagepass.co.in/Best_Education_Brand_2018-8ffd3a56.webp",
    title: "Best Education Brand Award – Economic Times 2018",
  },
  {
    img: "https://backstagepass.co.in/Times_Education_Excellence_2019-c24c65ad.webp",
    title: "Times Education Excellence Awards 2019",
  },

  // Add more awards here
  {
    img: "https://backstagepass.co.in/ET_Achievers_2025-a03e9ae8.webp",
    title: "ET Industry Achievers 2025",
  },
  {
    img: "https://backstagepass.co.in/Best_Education_Brand_2018-8ffd3a56.webp",
    title: "Best Education Brand Award – Economic Times 2018",
  },
  {
    img: "https://backstagepass.co.in/Times_Education_Excellence_2019-c24c65ad.webp",
    title: "Times Education Excellence Awards 2019",
  },

  {
    img: "https://backstagepass.co.in/ET_Achievers_2025-a03e9ae8.webp",
    title: "ET Industry Achievers 2025",
  },
  {
    img: "https://backstagepass.co.in/Best_Education_Brand_2018-8ffd3a56.webp",
    title: "Best Education Brand Award – Economic Times 2018",
  },
  {
    img: "https://backstagepass.co.in/Times_Education_Excellence_2019-c24c65ad.webp",
    title: "Times Education Excellence Awards 2019",
  },
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


export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [faqs, setFaqs] = useState([]);

  const [loading, setLoading] = useState(true);

  
const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const [showVideoModal, setShowVideoModal] = useState(false);

  // Example: use slug to load course data

  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [visible, setVisible] = useState(true);


  const [username, setUsername] = useState(null);
  const [userid, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [topics, setTopics] = useState([]);

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

    const addedLinks = [];


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

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setVisibleCount((prev) => Math.min(prev + 3, awards.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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



  useEffect(() => {
    if (!params?.path) return;

    fetch(
      `https://backstagepass.co.in/reactapi/api/course_innerpage.php?path=${params.path}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);

        if (data.topics) {
          setTopics(data.topics);
        }
        if (data.faqs) {
          setFaqs(data.faqs);
        }
      })
      .catch((err) => console.error(err));
  }, [params?.path]);


  useEffect(() => {
    const storedusername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("email");

    // if (storedEmail) {
    //   setOpen1(true);
    // }
    setUsername(storedusername);
    setUserId(storedUserId);
    setEmail(storedEmail);
  }, []);

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


  if (!course) return <div id="loader-wrapper">
    <div id="loader"></div>
    <div className="loader-section section-left"></div>
    <div className="loader-section section-right"></div>
  </div>;

const ALWAYS_VISIBLE_SECTIONS = [
  "basic_details",
];

const sortedSections =
  course?.sections
    ?.filter(
      (section) =>
        ALWAYS_VISIBLE_SECTIONS.includes(section.section_type) ||
        section.is_active === "1"
    )
    ?.sort((a, b) => Number(a.order_index) - Number(b.order_index)) || [];


  const isSectionActive = (type) =>
    course.sections?.some(
      (section) =>
        section.section_type === type &&
        section.is_active === "1"
    );

  const getButtonLabel = () => {
    switch (Number(course.course_type)) {
      case 1:
        return "Enroll Now";
      case 2:
        return "Watch Now";
      case 3:
        return "Register Now";
      default:
        return "Enroll Now";
    }
  };

  return (
    <>
      {loading && (
        <div id="loader-wrapper">
          <div id="loader"></div>
          <div className="loader-section section-left"></div>
          <div className="loader-section section-right"></div>
        </div>
      )}


      <AppHeaders />
      {/* <SiteNavigation /> */}
      <section className="section-padding ">

        <div className="container">
          <div className="row">

            {/* ================= LEFT SIDE ================= */}
            <div className="col-lg-8 order-2 order-lg-1">
              <br />
             {!isMobileOpen ? ( <><br /><br /> </>) : null}


              {/* ================= DYNAMIC SECTIONS RENDER ================= */}
{sortedSections.map((section) => {
  switch (section.section_type) {

    case "basic_details":
      return <BasicDetails key="basic_details" course={course} />;

    case "key_features":
      return <><KeyFeatures key="key_features" course={course} />  <AwardsSection /> <Topics course={course} /> <CertificateSection course={course} /></>;

    case "outcomes":
      return <><Outcomes key="outcomes" course={course} /> <TopCompaniesSection /></>;

    case "system":
      return <SystemRequirements key="system" course={course} />;

    case "audience":
      return <Audience key="audience" course={course} />;

    case "career":
      return <Career key="career" course={course} />;

    case "faqs":
      return <FaqSection key="faqs" course={course} />;

    // case "custom_22":
    //   return <CustomSection key="custom_22" title="Custom Section 22" />;

    // case "custom_23":
    //   return <CustomSection key="custom_23" title="Custom Section 23" />;

    default:
      if (section.section_type.startsWith("custom_")) {

    const customSections = course?.custom_sections || [];

    // Get index dynamically based on order
    const customSectionTypes = sortedSections
      .filter(s => s.section_type.startsWith("custom_"));

    const customIndex = customSectionTypes.findIndex(
      s => s.section_type === section.section_type
    );

    const customData = customSections[customIndex];

    if (!customData) return null;

    return (
      <CustomSection
        key={section.section_type}
        data={customData}
      />
    );
  }
      return null;
  }
})}


             

              {/* <div class="ab_content">
						<h2>{course.overview_title} </h2>
					<div
  dangerouslySetInnerHTML={{
    __html: course.course_overview
      ?.replace(/<p>\s*<\/p>/g, "")
      ?.replace(/<p>&nbsp;<\/p>/g, "")
  }}
></div>


					</div> */}


              {/* {Number(course?.course_type) !== 2 && (
                <>
                  <div
                    className="video-area"
                    style={{
                      position: "relative",
                      backgroundImage: `url(https://backstagepass.co.in/studentlms/uploads/featuredcourses/${course?.courses_image})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundColor: "#000",
                      width: "100%",
                      maxWidth: "900px",
                      margin: "0 auto",
                      aspectRatio: "16/9",
                      borderRadius: "12px",
                      paddingTop: "56.25%", // 16:9 ratio trick
                    }}
                  >
                    {!showVideo ? (
                      <button
                        type="button"
                        onClick={() => setShowVideo(true)}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          border: "none",
                          background: "rgba(0,0,0,0.5)",
                          borderRadius: "50%",
                          width: "80px",
                          height: "80px",
                          color: "#fff",
                          fontSize: "30px",
                        }}
                      >
                        <i className="fa fa-play"></i>
                      </button>
                    ) : (
                      course?.playback_id && (
                        <MuxPlayer
                          playbackId={course.playback_id}
                          autoPlay
                          playsInline
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )
                    )}
                  </div>




                  <br /><br /></>)}

              <section class="topic_content_p2 section-padding">
                <div class="container">
                  <div class="section-title">
                    <h2>AboutUs </h2>
                    <p>{course.overview_title}</p>
                  </div>
                  <div class="row">

                    <div className="course-overview"
                      dangerouslySetInnerHTML={{
                        __html: course.course_overview
                          ?.replace(/<p>\s*<\/p>/g, "")
                          ?.replace(/<p>&nbsp;<\/p>/g, "")
                      }}
                    ></div>



                  </div>
                </div>
              </section> */}


              {/* <div className="bg-gray-50 rounded-3xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8 min-h-[220px]">

                
                <div className="flex-shrink-0">
                  <img
                    src={`https://backstagepass.co.in/studentlms/uploads/mentors/${course.mentor_photo}`}
                    alt={course.mentor_name}
                    className="w-36 h-36 object-cover rounded-2xl border-4 border-red-600 shadow-sm"
                  />
                </div>

               
                <div className="flex flex-col justify-center text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-[#1a2d62]">
                    {course.mentor_name}
                  </h3>

                  <p className="text-red-600 font-semibold mt-1 mb-3">
                    {course.mentor_designation}
                  </p>

                  {course.mentor_bio && course.mentor_bio.trim() !== "Bio" && (
                    <p className="text-gray-600 leading-relaxed max-w-2xl">
                      {course.mentor_bio}
                    </p>
                  )}
                </div>

              </div>




              
              <br /><br /> */}

              {/* <section
  className="vid_area section-padding"
  style={{
    backgroundImage: "url('/assets/images/banner/video.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundAttachment: "fixed",
  }}
> */}



              {/* {isSectionActive("key_features") && course.key_features?.length > 0 && (
                <section class="topic_content_p2 section-padding">
                  <div class="container">
                    <div class="section-title">
                      <h2>Important </h2>
                      <p>Key  <span><u>Features</u></span></p>
                    </div>
                    <div class="row">

                      {course.key_features.map((feature, index) => (
                        <Feature key={index} text={feature} />
                      ))}



                    </div>
                  </div>
                </section>
              )}
              <br /> */}

              {/* <section className="topic_content_p2 section-padding">
                <div className="container">
                  <div className="section-title">
                   
                    <p>
                      Our <span><u>Awards</u></span>
                    </p>
                  </div>

                  <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    navigation
                    autoplay={{ delay: 4000 }}
                    loop
                    breakpoints={{
                      0: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 }
                    }}
                  >
                    {awards.map((award, index) => (
                      <SwiperSlide key={index}>
                        <Award img={award.img} title={award.title} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </section> */}

              {/* {![2, 3].includes(Number(course?.course_type)) && (
                <>
                  <br /><br />
                  <section class="course_promo section-padding">
                    <div class="container">
                      <div class="row">
                        <div class="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0" style={{
                          visibility: "visible",
                          animationDuration: "1s",
                          animationDelay: "0.1s",
                          animationName: "fadeInUp"
                        }}
                        >
                          <div class="cp_content">
                           
                            <h2>Let Your  <span><u>Certificates </u></span> Speak</h2>
                            <ul>
                              <li><span class="ti-check"></span>Industry recognized certificate </li>
                              <li><span class="ti-check"></span>Shareable on LinkedIn </li>
                              <li><span class="ti-check"></span>Add to resume & portfolio</li>
                            </ul>
                          </div>

                        </div>
                        <div class="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0" style={{
                          visibility: "visible",
                          animationDuration: "1s",
                          animationDelay: "0.1s",
                          animationName: "fadeInUp"
                        }}
                        >
                          <div class="cp_img">
                            <img src="https://backstagepass.co.in/certificate-with-badge-265a0669.png" class="img-fluid" alt="image" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section></>)} */}
             

              {/* {isSectionActive("outcomes") && course.outcomes?.length > 0 && (
                <section class=" section-padding">
                  <div class="container">
                    <div class="row">
                      <div class="col-lg-12 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0" style={{
                        visibility: "visible",
                        animationDuration: "1s",
                        animationDelay: "0.1s",
                        animationName: "fadeInUp"
                      }}
                      >
                        <div class="cp_content">
                          <h4>Best Online Learning Platform</h4>
                          <h2>After this {Number(course.course_type) === 1
                            ? "Course"
                            : "Webinar"},   <span><u>You will be  </u></span> Able to</h2>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <ul className="space-y-3">
                                {course.outcomes?.map((outcomes, index) => (
                                  <List key={index} text={outcomes} />
                                ))}
                              </ul>
                            </div>
                            {course?.outcomes_image?.trim() !== "" && (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div class="cp_img">
                                  <img src={`https://backstagepass.co.in/studentlms/uploads/course_outcomes/${course.outcomes_image}`} alt="image" />
                                </div>
                              </div>
                            )}
                          </div>


                          
                        </div>

                      </div>
                     
                    </div>
                  </div>
                </section>
              )} */}


              {/* <section className="max-w-7xl mx-auto px-6 py-0">
                <div class="cp_content">
                          
                          <h2>Our Learners Work Across  <span><u>Top Companies </u></span></h2></div>
                <div className="border-2 border-red-500 rounded-3xl px-10 py-12">
                  
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
              </section> */}
             

              {/* {isSectionActive("system") && course.requirement?.length > 0 && (
                <section class=" section-padding">
                  <div class="container">
                    <div class="row">
                      <div class="col-lg-12 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0" style={{
                        visibility: "visible",
                        animationDuration: "1s",
                        animationDelay: "0.1s",
                        animationName: "fadeInUp"
                      }}
                      >
                        <div class="cp_content">
                          <h4>Best Online Learning Platform</h4>
                          <h2>{course.requirements_main_title}</h2>


                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <ul className="space-y-6">
                                {course.requirement?.map((requirement, index) => (
                                  <Requirement key={index} text={requirement} />
                                ))}
                              </ul>
                            </div>
                            {course?.requirements_image?.trim() !== "" && (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div class="cp_img">
                                  <img src={`https://backstagepass.co.in/studentlms/uploads/system_requirement/${course.requirements_image}`} alt="image" />
                                </div>
                              </div>)}
                          </div>


                         
                        </div>

                      </div>
                     
                    </div>
                  </div>
                </section>
              )} */}

              {/* {isSectionActive("audience") && course.card?.length > 0 && (
                <section class="topic_content_p2 section-padding">
                  <div class="container">
                    <div class="section-title">
                      <h2>Important </h2>
                      <p> This {Number(course.course_type) === 1
                        ? "Course"
                        : "Webinar"} is for You,  <span><u>If You are</u></span></p>
                    </div>
                    <div class="row">

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {course.card?.map((card, index) => (
                          <Card key={index} text={card} />
                        ))}
                      </div>


                    </div>
                  </div>
                </section>
              )}
              <br /><br /> */}

              {/* {isSectionActive("career") && course.career?.length > 0 && (
                <>
                  <section class="topic_content_p2 section-padding">
                    <div class="container">
                      <div class="section-title">
                        <h2>Career Opportunities </h2>
                        <p>{course.career_main_title}</p>
                      </div>
                      <div class="row">

                        {course.career?.map((career, index) => (
                          <CareerCard key={index} text={career} />
                        ))}



                      </div>
                    </div>
                  </section>
                  <section className="max-w-7xl mx-auto px-6 py-0">



                    
                    <div className="relative overflow-hidden rounded-2xl bg-[#a43a3a] text-white grid lg:grid-cols-1 items-center">

                     
                      <div className="flex justify-center lg:justify-end">

                        <img
                          src={`https://backstagepass.co.in/studentlms/uploads/course_inner/${course.didyouknow_image}`}
                          alt="Career Illustration"
                          className="w-full rounded-xl"
                        />
                      </div>
                    </div>

                  </section>
                </>
              )}


              <br /><br /> */}

              {/* {isSectionActive("faqs") && course.faqs?.length > 0 && (
                <>

                  <section class="topic_content_p2 section-padding">
                    <div class="container">
                      <div className="section-title">
                        <h2>Frequently Asked Question</h2>
                        <p>General <span><u>Questions</u></span></p>
                      </div>

                      <div className="space-y-5">
                        {faqs.map((item, index) => {
                          const isOpen = open === index;

                          return (
                            <div
                              key={item.q}
                              className="bg-white rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                            >
                             
                              <button
                                onClick={() => setOpen(isOpen ? null : index)}
                                className="w-full flex justify-between items-center px-8 py-6 text-left"
                              >
                                <span className="text-[16px] font-medium text-blue-600" style={{
                                  color: "#1a2d62",
                                  fontWeight: 600,
                                  fontSize: "19px"
                                }}
                                >
                                  {item.q}
                                </span>

                                <span className="text-red-600 text-xl font-semibold" style={{
                                  color: "#1a2d62",
                                  fontWeight: 600,
                                  fontSize: "24px"
                                }}
                                >
                                  {isOpen ? "−" : "+"}
                                </span>
                              </button>

                            
                              {isOpen && (
                                <div className="px-8 pb-6 text-[15px] leading-[26px] text-[#444]">
                                  {item.a}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </section>

                </>
              )} */}


              
              <div class="sidebar-post" id="page-enroll-cta">
                <div class="newsletter-form">
                  <h4>{getButtonLabel()} the {course.coursename}</h4>
                  <form action="#" class="subscribe">

                    <button type="button" class="sub_btn" onClick={() => setOpen1(true)}> 
                      
                      {getButtonLabel()} @ {course.course_type !== 2 && (
    <>
     
        <span className="line-through text-gray-300 ml-1">
        ₹{course.orignialpayment}
        </span>
     
      <span className="ml-1 font-bold text-[#fff]">
        ₹{course.total_payment}
      </span>
    </>
  )}
                      </button>
                  </form>
                </div>
              </div>



              {/* <section className="bg-[#6d1c1c] text-white text-center py-16" id="page-enroll-cta">
          <h2 className="text-3xl font-bold mb-6">
            Enroll in the {course.coursename}
          </h2>
          <button onClick={() => setOpen1(true)} className="bg-red-600 px-12 py-4 rounded-full text-lg">
            Enroll @ ₹{course.total_payment}
          </button>
        </section> */}
              <EnrollModal open={open1} onClose={() => setOpen1(false)} courseId={course.course_id} />

              {/* <div className="fixed bottom-0 left-0 w-full z-[9999]">
                <div className="bg-[#1f1f1f] h-20 flex items-center justify-center relative">
                  <span className="absolute top-0 left-0 w-full h-[2px] bg-red-600" />
                  <button onClick={() => {
                    if (!email) {
                      const path = window.location.pathname;

                      if (path !== "/") {
                        localStorage.setItem("postLoginRedirect", path);
                      }

                      signIn("google", {
                        callbackUrl: window.location.href,
                      });
                    } else {
                      setOpen1(true);
                    }
                  }} className="px-20 py-4 rounded-full bg-red-600 text-white">
                    {getButtonLabel()}
                  </button>
                </div>
              </div> */}







            </div>

            {/* ================= RIGHT SIDE (STICKY) ================= */}
            <div className="col-lg-4 order-1 order-lg-2">
              <div className="sticky-sidebar">

                <div className="enroll-card">
                  <img src={`https://backstagepass.co.in/studentlms/uploads/featuredcourses/${course.courses_image}`} />

                  {/* <button className="btn btn-danger w-100">
                    ENROLL NOW
                  </button> */}

                  <button onClick={() => {
                    if (!email) {
                      const path = window.location.pathname;

                      if (path !== "/") {
                        localStorage.setItem("postLoginRedirect", path);
                      }

                      signIn("google", {
                        callbackUrl: window.location.href,
                      });
                    } else {
                      setOpen1(true);
                    }
                  }} className="inline-block bg-red-600 text-white px-5 py-2 rounded-full text-sm mb-8  w-100" style={{
                    marginTop: "15px",
                    marginBottom: "10px",
                    borderRadius: "26px",
                  }}
                  >
                  {getButtonLabel()} @ {course.course_type !== 2 && (
    <>
      
        <span className="line-through text-gray-300 ml-1">
          ₹{course.orignialpayment}
        </span>
     
      <span className="ml-1 font-bold text-[#fff]">
        ₹{course.total_payment}
      </span>
    </>
  )}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>



      {/* <main className="text-gray-800 pb-20">
        <header className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://backstagepass.co.in/newlogo-324ee245.webp"
                alt="Backstage Pass Institute of Gaming"
                className="h-12 w-auto"
              />
            </div>
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

        <section className="relative bg-[#7b1e23] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
            <div className="text-white">
              <h1 className="text-[44px] font-semibold text-[#ffb347] mb-6">
                {course.coursename}
              </h1>
              <p className="text-md leading-relaxed mb-8">
                {course.innerpage_description}
              </p>
              {Number(course.buy_course) === 1 && (

                <h3 className="text-xl font-semibold mb-4">Buy this Course @</h3>
              )}

              <div className="flex items-center gap-4 mb-4">
                <span className="line-through text-gray-300 text-xl">₹{course.orignialpayment}</span>
                <span className="text-3xl font-bold text-[#ffb347]">₹{course.total_payment}</span>
                <span className="bg-white text-red-600 font-semibold px-4 py-1 rounded-full text-sm">
                  {course.discount_value}% Disc.
                </span>
              </div>
              {Number(course.limited_offer) === 1 && (
                <span className="inline-block bg-red-600 text-white px-5 py-2 rounded-full text-sm mb-8">
                  Limited Time Offer!
                </span>
              )}

              <div className="relative bg-white rounded-xl shadow-lg grid grid-cols-4 text-center text-black">
                <div className="py-6">
                  <p className="font-semibold">{course.number_of_modules} Modules</p>
                  <p className="text-sm text-gray-600">with Certifications</p>
                </div>
                <div className="py-6">
                  <p className="font-semibold">{course.duration} Hours</p>
                  <p className="text-sm text-gray-600">Recorded Content</p>
                </div>
                <div className="py-6">
                  <p className="font-semibold">Online</p>
                  <p className="text-sm text-gray-600">Mode</p>
                </div>
                <div className="py-6">
                  <p className="font-semibold">English</p>
                  <p className="text-sm text-gray-600">Language</p>
                </div>
                <span className="absolute top-6 bottom-6 left-1/4 w-px bg-gray-200" />
                <span className="absolute top-6 bottom-6 left-2/4 w-px bg-gray-200" />
                <span className="absolute top-6 bottom-6 left-3/4 w-px bg-gray-200" />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border-[6px] border-white overflow-hidden shadow-2xl">
                <img
                  src={`https://backstagepass.co.in/studentlms/uploads/course_inner/${course.innerpage_image}`}
                  alt={course.coursename}
                  className="w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

       
       
        {isSectionActive("key_features") && course.key_features?.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">
              Key Features
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {course.key_features.map((feature, index) => (
                <Feature key={index} text={feature} />
              ))}
            </div>
          </section>
        )}

       
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">Our Awards</h2>
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

       
        {isSectionActive("topics") && course.topics?.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-semibold mb-10">Course Topics You will Learn</h2>
            <div className="space-y-6">
              {topics.map((topic, index) => {
                const isOpen = activeIndex === index;

                return (
                  <div key={topic.title} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <button
                      onClick={() => setActiveIndex(isOpen ? null : index)}
                      className="w-full flex justify-between items-center px-8 py-6 text-left"
                    >
                      <span className="text-lg font-semibold">{topic.title}</span>
                      <ChevronDown
                        className={`text-red-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>


                    <div
                      className={`px-8 transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] pb-6" : "max-h-0"
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
        )}

       
        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10">
          <img
            src="https://backstagepass.co.in/certificate-with-badge-265a0669.png"
            width={300}
            alt="Certificate"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Let Your Certificates Speak</h2>
            <ul className="space-y-3">
              <List text="Industry recognized certificate" />
              <List text="Shareable on LinkedIn" />
              <List text="Add to resume & portfolio" />
            </ul>
          </div>
        </section>

       
        {isSectionActive("outcomes") && course.outcomes?.length > 0 && (
          <section className="bg-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl font-bold mb-4">After this Course, You will be Able to</h2>
                <ul className="space-y-3">
                  {course.outcomes?.map((outcomes, index) => (
                    <List key={index} text={outcomes} />
                  ))}
                </ul>
              </div>
              <img src={`https://backstagepass.co.in/studentlms/uploads/course_outcomes/${course.outcomes_image}`} />
            </div>
          </section>
        )}

       
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="border-2 border-red-500 rounded-3xl px-10 py-12">
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

       
        {isSectionActive("system") && course.requirement?.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="flex justify-center">

                <img
                  src={`https://backstagepass.co.in/studentlms/uploads/system_requirement/${course.requirements_image}`}

                  alt="System Requirements Illustration"
                  className="max-w-md w-full"
                />

              </div>

              <div>
                <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">
                  {course.requirements_main_title}
                </h2>
                <ul className="space-y-6">
                  {course.requirement?.map((requirement, index) => (
                    <Requirement key={index} text={requirement} />
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

       
        {isSectionActive("audience") && course.card?.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20">
         
            <h2 className="text-3xl font-medium text-[#2d2d2d] mb-12">
              This is the One for You, If You are
            </h2>

           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {course.card?.map((card, index) => (
                <Card key={index} text={card} />
              ))}
            </div>
          </section>
        )}
        {isSectionActive("career") && course.career?.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20">

          
            <h2 className="text-3xl font-medium text-[#2d2d2d] mb-4">
              Career Opportunities
            </h2>

            <p className="text-[16px] text-[#4a4a4a] mb-10">
              {course.career_main_title}
            </p>

           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {course.career?.map((career, index) => (
                <CareerCard key={index} text={career} />
              ))}
            </div>

           
            <div className="relative overflow-hidden rounded-2xl bg-[#a43a3a] text-white grid lg:grid-cols-2 items-center">

            
              <div className="p-12">
                <h3 className="text-3xl font-semibold mb-4">
                  Did You Know?
                </h3>

                <p className="mb-4 text-white/90">
                  The average salary is
                </p>

                <p className="text-5xl font-bold text-[#ffd24d] mb-2">
                  {course.average_salary}
                </p>

                <p className="text-lg">
                  /year in India
                </p>
              </div>

           
              <div className="flex justify-center lg:justify-end">
                <img
                  src="https://backstagepass.co.in/didyouneed-131b8fce.webp"
                  alt="Career Illustration"
                  className="max-h-[260px] w-auto"
                />
              </div>
            </div>

          </section>
        )}

      
        {isSectionActive("faqs") && course.faqs?.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20">
          
            <h2 className="text-3xl font-medium text-[#2d2d2d] mb-10">
              Frequently Asked Questions
            </h2>

           
            <div className="space-y-5">
              {faqs.map((item, index) => {
                const isOpen = open === index;

                return (
                  <div
                    key={item.q}
                    className="bg-white rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                  >
                   
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

                    
                    {isOpen && (
                      <div className="px-8 pb-6 text-[15px] leading-[26px] text-[#444]">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>)}
       
        <section className="bg-[#6d1c1c] text-white text-center py-16" id="page-enroll-cta">
          <h2 className="text-3xl font-bold mb-6">
            Enroll in the {course.coursename}
          </h2>
          <button onClick={() => setOpen1(true)} className="bg-red-600 px-12 py-4 rounded-full text-lg">
            Enroll @ ₹{course.total_payment}
          </button>
        </section>
        <EnrollModal open={open1} onClose={() => setOpen1(false)} courseId={course.course_id} />

        <div className="fixed bottom-0 left-0 w-full z-[9999]">
          <div className="bg-[#1f1f1f] h-20 flex items-center justify-center relative">
            <span className="absolute top-0 left-0 w-full h-[2px] bg-red-600" />
            <button onClick={() => {
              if (!email) {
                const path = window.location.pathname;

                if (path !== "/") {
                  localStorage.setItem("postLoginRedirect", path);
                }

                signIn("google", {
                  callbackUrl: window.location.href,
                });
              } else {
                setOpen1(true);
              }
            }} className="px-20 py-4 rounded-full bg-red-600 text-white">
              ENROLL NOW
            </button>
          </div>
        </div>

      </main> */}

      <div className="footer section-padding" style={{ paddingTop: "80px" }}>
				<div className="container">
					<div className="row">
						<div className="col-lg-3 col-sm-6 col-xs-12">
							<div className="single_footer">
								<a href="#"><img src="images/Bsp_White.png" alt="" /></a>
								<p>Building future game developers through structured, practical learning.
									Create real projects. Build real skills. Grow your career.
								</p>
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
									<p>+91-8065912040</p>
								</div>
								<div className="sf_contact">
									<span className="ti-email"></span>
									<h3>Email Address</h3>
									<p>learning@backstagepass.co.in</p>
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
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
    </>
  );
}

// COMPONENTS


const BasicDetails = ({ course }) => {
  if (!course?.course_overview) return null;
const [showVideo, setShowVideo] = useState(false); 

const shouldShowVideo =
    course?.video_on_off === "1" &&
    course?.playback_id;
  return (
    <>
     <section className="section-top">
                <div className="container">
                  <div className="col-lg-10 offset-lg-1">
                    <div className="section-top-title wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
                      <div>
                        <h1 className="text-[44px] font-semibold text-[#ffb347] mb-6">
                          {course.coursename}
                        </h1>
                        <p className="text-md leading-relaxed mb-8" style={{ marginBottom: "20px" }}>
                          {course.innerpage_description}
                        </p>
                        {Number(course.buy_course) === 1 && (

                          <h3 className="text-xl font-semibold mb-4" style={{
                            fontWeight: 600,
                            fontSize: "21px"
                          }}
                          >Buy this Course @</h3>
                        )}
                        {Number(course.course_type) !== 2 && (
                        <div className="gap-4 mb-4">  <div className="flex items-center gap-4 mb-1">
                            <span className="line-through text-gray-300 text-3xl">₹{course.orignialpayment}</span>
                            <span className="text-3xl font-bold text-[#ee1b24]">₹{course.total_payment}</span>
                            <span className="bg-white text-red-600 font-semibold px-4 py-1 rounded-full text-sm">
                              {course.discount_value}% Disc.
                            </span>
                          </div>
                        <p style={{fontSize: "14px"}}>*Price inclusive of all applicable taxes (GST)</p></div>)}
                          
                        {Number(course.limited_offer) === 1 && (
                          <span className="inline-block bg-red-600 text-white px-5 py-2 rounded-full text-sm mb-8">
                            Limited Time Offer!
                          </span>
                        )}

                       <div className="
  bg-white 
  rounded-xl 
  shadow-lg 
  grid 
  grid-cols-2 
  lg:grid-cols-4 
  text-center 
  text-black
  divide-y 
  lg:divide-y-0 
  lg:divide-x 
  divide-gray-200
">
                          <div className="py-6">
                            <p className="font-semibold">
                              {course.number_of_modules}
                              {Number(course.course_type) === 1 ? " Modules" : " Learning"}
                            </p>

                            <p className="text-sm text-gray-600">
                              {Number(course.course_type) === 1
                                ? "with Certifications"
                                : " Modules"}
                            </p>
                          </div>
                          <div className="py-6">
                            <p className="font-semibold">{course.duration} Hours</p>
                            <p className="text-sm text-gray-600">Recorded Content</p>
                          </div>
                          <div className="py-6">
                            <p className="font-semibold">Online</p>
                            <p className="text-sm text-gray-600">Mode</p>
                          </div>
                          <div className="py-6">
                            <p className="font-semibold">English</p>
                            <p className="text-sm text-gray-600">Language</p>
                          </div>
                          {/* <span className="absolute top-6 bottom-6 left-1/4 w-px bg-gray-200" />
                          <span className="absolute top-6 bottom-6 left-2/4 w-px bg-gray-200" />
                          <span className="absolute top-6 bottom-6 left-3/4 w-px bg-gray-200" /> */}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </section>
              <br /><br />
              {shouldShowVideo && (
                <>
                  <div
                    className="video-area"
                    style={{
                      position: "relative",
                      backgroundImage: `url(https://backstagepass.co.in/studentlms/uploads/course_inner/${course?.innerpage_image})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundColor: "#000",
                      width: "100%",
                      maxWidth: "900px",
                      margin: "0 auto",
                      aspectRatio: "16/9",
                      borderRadius: "12px",
                      paddingTop: "56.25%", // 16:9 ratio trick
                    }}
                  >
                    {!showVideo ? (
                      <button
  type="button"
  onClick={() => setShowVideo(true)}
  className="video-play-btn"
>
  <span className="ripple"></span>
  <svg style={{fontSize: "44px", width: "55px", height: "55px"}}
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="red"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
</button>

                    ) : (
                      course?.playback_id && (
                        <MuxPlayer
                          playbackId={course.playback_id}
                          autoPlay
                          playsInline
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: "12px",
    animation: "fadeInVideo 0.6s ease forwards",
                          }}
                        />
                      )
                    )}
                  </div>




                  <br /></>)}

              <section class="topic_content_p2 section-padding">
                <div class="container">
                  <div class="section-title">
                    {/* <h2>AboutUs </h2> */}
                    <p>{course.overview_title}</p>
                  </div>
                  <div class="row">

                    <div className="course-overview"
                      dangerouslySetInnerHTML={{
                        __html: course.course_overview
                          ?.replace(/<p>\s*<\/p>/g, "")
                          ?.replace(/<p>&nbsp;<\/p>/g, "")
                      }}
                    ></div>



                  </div>
                </div>
              </section>
              <div className="bg-gray-50 rounded-3xl shadow-md p-8 flex flex-col md:flex-row items-top gap-8 min-h-[220px]">

                {/* IMAGE */}
                <div className="flex-shrink-0">
                  <img
                    src={`https://backstagepass.co.in/studentlms/uploads/mentors/${course.mentor_photo}`}
                    alt={course.mentor_name}
                    className="w-36 h-36 object-cover rounded-2xl border-4 border-red-600 shadow-sm"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col justify-center text-left flex-1">

                  <h3 className="text-2xl font-bold text-[#1a2d62]">
                    <b>{course.mentor_name}</b>
                  </h3>

                  <p className="text-red-600 font-semibold mt-1 mb-3">
                    {course.mentor_designation}
                  </p>

                  {course.mentor_bio && course.mentor_bio.trim() !== "Bio" && (
                    <p className="text-gray-600 leading-relaxed max-w-2xl">
                      {course.mentor_bio}
                    </p>
                  )}
                </div>

              </div>




              
              <br /><br />
              </>
  );
};


const KeyFeatures = ({ course }) => {
  if (!course?.key_features?.length) return null;

  return (
    <section class="topic_content_p2 section-padding">
                  <div class="container">
                    <div class="section-title">
                      <h2>Important </h2>
                      <p>Key  <span>Features</span></p>
                    </div>
                    <div class="row">

                      {course.key_features.map((feature, index) => (
                        <Feature key={index} text={feature} />
                      ))}



                    </div>
                  </div>
                </section>
  );
};


const AwardsSection = () => {
  return (
    <section className="topic_content_p2 section-padding">
      <div className="container">
        <div className="section-title">
          <p>
            Our <span>Awards</span>
          </p>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          navigation
          autoplay={{ delay: 4000 }}
          loop
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
        >
          {awards.map((award, index) => (
            <SwiperSlide key={index}>
              <Award img={award.img} title={award.title} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

const CertificateSection = ({ course }) => {
  if ([2, 3].includes(Number(course?.course_type))) return null;

  return (
    <>
      <br /><br />
      <section className="course_promo section-padding">
        <div className="container">
          <div className="row">
            
            <div className="col-lg-6 col-sm-12 col-xs-12">
              <div className="cp_content">
                <h2>
                  Let Your <span>Certificates</span> Speak
                </h2>
                <ul>
                  <li><span className="ti-check"></span>Certificate are awarded immediately upon <br/>successfully completing all course modules.</li>
                  <li><span className="ti-check"></span>You receive an official completion certificate that validates your skills.</li>
                  <li><span className="ti-check"></span>Your certificate serves as proof of learning and can be added to your resume or portfolio.</li>
                </ul>
              </div>
            </div>

            <div className="col-lg-6 col-sm-12 col-xs-12">
              <div className="cp_img">
                <img
                  src="https://backstagepass.co.in/certificate-with-badge-265a0669.png"
                  className="img-fluid"
                  alt="certificate"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
      <br /><br />
    </>
  );
};


const Outcomes = ({ course }) => {
  if (!course?.outcomes?.length) return null;

  return (
     <section class=" section-padding">
                  <div class="container">
                    <div class="row">
                      <div class="col-lg-12 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0" style={{
                        visibility: "visible",
                        animationDuration: "1s",
                        animationDelay: "0.1s",
                        animationName: "fadeInUp"
                      }}
                      >
                        <div class="cp_content">
                          {/* <h4>Best Online Learning Platform</h4> */}
                          <h2>After this {Number(course.course_type) === 1
                            ? "Course"
                            : "Webinar"},   <span>You will be</span> Able to</h2>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <ul className="space-y-3">
                                {course.outcomes?.map((outcomes, index) => (
                                  <List key={index} text={outcomes} />
                                ))}
                              </ul>
                            </div>
                            {course?.outcomes_image?.trim() !== "" && (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div class="cp_img">
                                  <img src={`https://backstagepass.co.in/studentlms/uploads/course_outcomes/${course.outcomes_image}`} alt="image" />
                                </div>
                              </div>
                            )}
                          </div>


                          
                        </div>

                      </div>
                     
                    </div>
                  </div>
                </section>
  );
};




const Topics = ({ course }) => {

  const [activeIndex, setActiveIndex] = useState(null);

  if (!course?.topics?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      
<div className="section-title">
          <p>
            Course Topics <span>You will Learn</span>
          </p>
        </div>
      <div className="space-y-6">
        {course.topics.map((topic, index) => {

          const isOpen = activeIndex === index;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() =>
                  setActiveIndex(isOpen ? null : index)
                }
                className="w-full flex justify-between items-center px-8 py-3 text-left"
              >
                <span className="text-lg font-semibold" style={{color: "#111"}}>
                  {topic.title}
                </span>

                <ChevronDown
                  className={`text-red-600 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`px-8 transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[600px] pb-6" : "max-h-0"
                } overflow-hidden`}
              >
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {topic.points.map((point, i) => (
                    <li style={{marginBottom: "7px"}} key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};



// {isSectionActive("topics") && course.topics?.length > 0 && (
//           <section className="max-w-6xl mx-auto px-6 py-20">
//             <h2 className="text-3xl font-semibold mb-10">Course Topics You will Learn</h2>
//             <div className="space-y-6">
//               {topics.map((topic, index) => {
//                 const isOpen = activeIndex === index;

//                 return (
//                   <div key={topic.title} className="bg-white rounded-xl shadow-md overflow-hidden">
//                     <button
//                       onClick={() => setActiveIndex(isOpen ? null : index)}
//                       className="w-full flex justify-between items-center px-8 py-6 text-left"
//                     >
//                       <span className="text-lg font-semibold">{topic.title}</span>
//                       <ChevronDown
//                         className={`text-red-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
//                           }`}
//                       />
//                     </button>


//                     <div
//                       className={`px-8 transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] pb-6" : "max-h-0"
//                         } overflow-hidden`}
//                     >
//                       <ul className="list-disc pl-5 space-y-2 text-gray-700">
//                         {topic.points.map(point => (
//                           <li key={point}>{point}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>


//                 );
//               })}
//             </div>
//           </section>
//         )}

const TopCompaniesSection = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto px-0 py-0 mb-10">
        
        <div className="cp_content text-left mb-8">
          <h2>
            Our Learners Work Across{" "}
            <span>Top Companies</span>
          </h2>
        </div>

        <div className="border-2 border-red-500 rounded-3xl px-10 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-10 gap-x-8 items-center justify-items-center">
            {logos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="max-h-12 object-contain transition duration-300 hover:scale-110"
              />
            ))}
          </div>
        </div>

      </section>
    </>
  );
};


const SystemRequirements = ({ course }) => {
  if (!course?.requirement?.length) return null;

  return (
    <section class=" section-padding">
                  <div class="container">
                    <div class="row">
                      <div class="col-lg-12 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0" style={{
                        visibility: "visible",
                        animationDuration: "1s",
                        animationDelay: "0.1s",
                        animationName: "fadeInUp"
                      }}
                      >
                        <div class="cp_content">
                          {/* <h4>Best Online Learning Platform</h4> */}
                          <h2>System Requirements for <span>{course.requirements_main_title} </span></h2>


                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <ul className="space-y-6">
                                {course.requirement?.map((requirement, index) => (
                                  <Requirement key={index} text={requirement} />
                                ))}
                              </ul>
                            </div>
                            {course?.requirements_image?.trim() !== "" && (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div class="cp_img">
                                  <img src={`https://backstagepass.co.in/studentlms/uploads/system_requirement/${course.requirements_image}`} alt="image" />
                                </div>
                              </div>)}
                          </div>


                         
                        </div>

                      </div>
                     
                    </div>
                  </div>
                </section>
  );
};


const Audience = ({ course }) => {
  if (!course?.card?.length) return null;

  return (
    <>
    <section class="topic_content_p2 section-padding">
                  <div class="container">
                    <div class="section-title">
                      {/* <h2>Important </h2> */}
                      <p> This {Number(course.course_type) === 1
                        ? "Course"
                        : "Webinar"} is for You,  <span>If You are</span></p>
                    </div>
                    <div class="row">

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {course.card?.map((card, index) => (
                          <Card key={index} text={card} />
                        ))}
                      </div>


                    </div>
                  </div>
                </section>
                <br/><br/>
                </>
  );
};


const Career = ({ course }) => {
  if (!course?.career?.length) return null;

  const hasCareerImage =
  course?.didyouknow_image &&
  course.didyouknow_image !== "" &&
  course.didyouknow_image !== "0";

  return (
    <>
    <section class="topic_content_p2 section-padding">
                    <div class="container">
                      <div class="section-title">
                        <h2>Career Opportunities </h2>
                        <p>{course.career_main_title}</p>
                      </div>
                      <div class="row">

                        {course.career?.map((career, index) => (
                          <CareerCard key={index} text={career} />
                        ))}



                      </div>
                    </div>
                  </section>
                  {hasCareerImage && (
                  <section className="max-w-7xl mx-auto px-6 py-0">



                    
                    <div className="relative overflow-hidden rounded-2xl bg-[#a43a3a] text-white grid lg:grid-cols-1 items-center">

                     
                      <div className="flex justify-center lg:justify-end">

                        <img
                          src={`https://backstagepass.co.in/studentlms/uploads/course_inner/${course.didyouknow_image}`}
                          alt="Career Illustration"
                          className="w-full rounded-xl"
                        />
                      </div>
                    </div>

                  </section>)}<br/><br/>
                  </>
  );
};


const FaqSection = ({ course }) => {
  const [open, setOpen] = useState(null);

  if (!course?.faqs?.length) return null;

  return (
    <>
    <section class="topic_content_p2 section-padding">
                    <div class="container">
                      <div className="section-title">
                        <h2>Frequently Asked</h2>
                        <p>General <span>Questions</span></p>
                      </div>

                      <div className="space-y-5">
                        {course.faqs.map((item, index) => {
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
                                <span className="text-[16px] font-medium text-blue-600" style={{
                                  color: "#1a2d62",
                                  fontWeight: 600,
                                  fontSize: "19px"
                                }}
                                >
                                  {item.q}
                                </span>

                                <span className="text-red-600 text-xl font-semibold" style={{
                                  color: "#1a2d62",
                                  fontWeight: 600,
                                  fontSize: "24px"
                                }}
                                >
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

                    </div>
                  </section><br/><br/>
                  </>
  );
};

const CustomSection = ({ data }) => {
  if (!data) return null;

  const imageUrl =
  data?.image &&
  data.image.trim() !== "" &&
  data.image !== "null"
    ? data.image.startsWith("http")
      ? data.image
      : `https://backstagepass.co.in/studentlms/uploads/course_sections/${data.image}`
    : null;


  return (
    <section className="py-10 bg-[#fff]">
      <div className="max-w-6xl mx-auto px-6">

        {/* TITLE */}
        {data?.title && (
          // <div className="mb-10">
          //   <h2 className="text-3xl md:text-4xl font-bold text-[#1a2d62] relative inline-block">
          //     {data.title}
          //     <span className="absolute left-0 -bottom-2 w-16 h-1 bg-red-600 rounded-full"></span>
          //   </h2>
          // </div>

          <div className="section-title">
                        <h2>Sections</h2>
                        <p>{data.title}</p>
                      </div>
        )}

        {/* CARD WRAPPER */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">

          {/* IMAGE */}
         {imageUrl && (
  <div className="relative w-full aspect-[16/7] overflow-hidden rounded-2xl mb-3">
    <img
      src={imageUrl}
      alt={data?.title || "Custom section"}
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> */}
  </div>
)}
          {/* CONTENT */}
          {data?.description && (
            <div className="p-4 md:p-6">
              <div
                className="
                  custom-content
                  prose
                  prose-lg
                  max-w-none
                  text-gray-700
                  leading-relaxed
                "
                dangerouslySetInnerHTML={{
                  __html: data.description,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};




const Feature = ({ text }) => (
  <div className="col-lg-6 col-sm-6 col-xs-12 mb-4 d-flex">
    <div className="single_tca d-flex w-100 align-items-center">
      
      <div className="icon-wrapper">
        <img
          src="assets/images/icon/star.svg"
          alt=""
          style={{ width: "32px" }}
        />
      </div>

      <h5 className="feature-text">
        {text}
      </h5>
    </div>
  </div>
);


const Award = ({ img, title }) => (
  <div className="relative rounded-2xl overflow-hidden shadow-lg group">
    <img
      src={img}
      alt={title}
      className="w-full h-[260px] object-cover transition-transform duration-300 group-hover:scale-105"
    />

    <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3">
      <p className="text-white text-sm font-medium leading-snug">
        {title}
      </p>
    </div>
  </div>
);



// const Award = ({ img, title }) => (
//   <div className="relative rounded-2xl overflow-hidden shadow-lg group">
//     {/* Image */}
//     <img
//       src={img}
//       alt={title}
//       className="w-full h-[260px] object-cover transition-transform duration-300 group-hover:scale-105"
//     />

//     {/* Overlay */}
//     <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3">
//       <p className="text-white text-sm font-medium leading-snug">
//         {title}
//       </p>
//     </div>
//   </div>
//);

const Requirement = ({ text }) => (
  <li><span class="ti-check"></span>{text} </li>
);
const Card = ({ text }) => (
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
const List = ({ text }) => (
  <li><span class="ti-check"></span>{text} </li>
);

const CareerCard = ({ text }) => (
  <div class="col-lg-6 col-sm-6 col-xs-12">
    <div className="single_tca">
      <img src="assets/images/icon/star.svg" alt="" />
      <h2><a href="#">{text}</a></h2>
    </div>
  </div>
);


// COMPANY LOGOS
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

