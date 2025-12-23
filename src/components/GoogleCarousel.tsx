"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";


const testimonials = [
  {
    name: "RAMYA KRISHNAN A",
    role: "Data Scientist",
    text: "BackstagePass Data Science Program was just fantastic. It covered statistics, machine learning, data visualization, and Python within its curriculum. Later, its hands–on projects allowed me to apply the concepts effectively and significantly improved my data science skills.",
    video: null,
  },
   {
    name: "Siva Ram Prasad K",
    role: "Game Designed",
    text: "BackstagePass Data Science Program was just fantastic. It covered statistics, machine learning, data visualization, and Python within its curriculum. Later, its hands–on projects allowed me to apply the concepts effectively and significantly improved my data science skills.",
    video: null,
  },
   {
    name: "Manasa M",
    role: "Data Scientist",
    text: "BackstagePass Data Science Program was just fantastic. It covered statistics, machine learning, data visualization, and Python within its curriculum. Later, its hands–on projects allowed me to apply the concepts effectively and significantly improved my data science skills.",
    video: null,
  },
  {
    name: "Joel",
    role: "Frontend Developer",
    text: null,
    video: "https://img.youtube.com/vi/VIDEO_ID/0.jpg", // replace with real thumbnail or custom image
  },
  {
    name: "Selva Kumaran",
    role: "Frontend Developer",
    text: "I completed BackstagePass Full Stack Development (MERN) Program, and their teaching with query resolution was excellent. My mentors used to explain concepts in Tamil in really clear–cut ways. Placement support along with mock interviews and job–specific prep sessions was very useful.",
    video: null,
  },
];

export default function CourseCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

 

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full bg-gray-50 py-0">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="min-w-[25%] px-3 md:min-w-[25%] sm:min-w-full"
            >
              <div className="bg-white rounded-2xl shadow-lg flex flex-col h-full">
                
                <h3 className="mt-4 pl-5 text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="mt-2 pl-5 pb-5 pr-5 text-sm text-gray-600 line-clamp-3">
                  {item.role}
                </p>

                {item.text && (
              <p className="mt-2 pl-5 pb-5 pr-5 text-sm text-gray-600 line-clamp-3">
                {item.text}
              </p>
            )}

            {item.video && (
              <div className="pl-5 pr-5 pb-5 mt-4 relative w-full h-40 rounded-lg overflow-hidden">
                <Image
                  src={item.video}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {/* Play button */}
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition">
                    ▶
                  </div>
                </button>
              </div>
            )}
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {/* <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={scrollPrev}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ◀ Prev
        </button>
        <button
          onClick={scrollNext}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Next ▶
        </button>
      </div> */}

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === selectedIndex ? "bg-red-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
