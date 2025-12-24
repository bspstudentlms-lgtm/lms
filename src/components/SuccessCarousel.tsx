"use client";

import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

/* ------------------ TYPES ------------------ */
type Student = {
  id: number;
  name: string;
  photo: string;
  course: string;
  testimonial: string;
};

/* ------------------ DATA ------------------ */
const students: Student[] = [
  {
    id: 1,
    photo: "https://backstagepass.co.in/zgast/Taniya_Das.jpg",
    name: "Taniya Das",
    course: "Game Art and Design (2nd Year)",
    testimonial:
      "Game Art introduced me to the visual side of development, where we learned art both traditionally and digitally. It helped us create characters, environments, and props. I learned how to color, style, and detail our art to make it more alive and realistic for games. Thanking Backstage Pass for providing such a great course for learning.",
  },
  {
    id: 2,
    photo: "https://backstagepass.co.in/zgast/Anisa_Dhiman.jpg",
    name: "Anisa Dhiman",
    course: "Game Design (2nd Year)",
    testimonial:
      "Through game design, I learned how to translate my vision and ideas into a structured process by understanding the game development pipeline and the essential steps needed before creating a game. This helped me improve my ability to visualize concepts, generate better ideas, and bring everything together into a cohesive design. I would like to thank Backstage Pass.",
  },
  {
    id: 3,
    photo: "https://backstagepass.co.in/zgast/Piyush_Gaur.jpg",
    name: "Piyush Gaur",
    course: "Game Design (4th Year)",
    testimonial:
      "With the guidance of mentors like Vishnu Sir, Sandeep Sir, and Sandy Sir, I learned how game design shapes player experience and how to build engaging loops and meaningful choices. Backstage Pass is a great place to learn and grow in game development.",
  },
  {
    id: 4,
    photo: "https://backstagepass.co.in/zgast/Manish_Chetla.jpg",
    name: "Manish Chetla",
    course: "M.Sc. Game Technology",
    testimonial:
      "I learned the complete process of game design, from transforming ideas into playable experiences to understanding structured steps like Game Design Documents (GDD) and level design. I also developed hands-on skills in C# and Unity, gaining practical knowledge of how design concepts are translated into real game mechanics. These learnings strengthened both my creative and technical abilities. Backstage Pass truly builds professionals for the game industry.",
  },
  {
    id: 5,
    photo: "https://backstagepass.co.in/zgast/Ansh_Srivastava.jpg",
    name: "Ansh Srivastava",
    course: "M.Sc. Game Technology (Second Year)",
    testimonial:
      "Learning Game Design taught me how every mechanic, level flow, and system ties back to creating fun for the player. It wasn’t just theory—it was about breaking down why games feel engaging and how to design mechanics that actually work in real gameplay. On the Game Art side, I learned how shapes, silhouettes, textures, and styles come together to match a game's mood and build a strong player experience. Backstage Pass makes you feel like you’re in the real game dev grind, but with the coolest vibe.",
  },
  {
    id: 6,
    photo: "https://backstagepass.co.in/zgast/Shane_Warren_Silveira.jpg",
    name: "Shane Warren Silveira",
    course: "B.Sc. (Hons.) CSGD – 4th Year",
    testimonial:
      "Through Game Development, I learned how to design mechanics, build engaging systems, and implement technical features that bring interactive ideas to life. In Game Design, I understood how gameplay, story, and aesthetics shape player experiences. Together, these disciplines taught me how creativity and technology must work hand in hand, helping me think critically, solve problems systematically, and design with purpose. Backstage Pass and its mentors provide the perfect launchpad for aspiring game creators.",
  },
];


/* ------------------ HELPERS ------------------ */
const truncate = (text: string, limit = 120) =>
  text.length > limit ? text.slice(0, limit) + "..." : text;

/* ------------------ COMPONENT ------------------ */
export default function CourseCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3500 })]
  );

  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-12">

        {/* LEFT TITLE */}
        <div className="lg:w-1/4 flex items-center">
          <h2 className="text-5xl font-bold text-red-600">
            Testimonials
          </h2>
        </div>

        {/* RIGHT CAROUSEL */}
        <div className="lg:w-3/4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex-[0_0_100%] md:flex-[0_0_48%] lg:flex-[0_0_32%]"
                >
                  <div className="bg-white rounded-2xl shadow-md p-6 h-full relative">

                    {/* Quote icon */}
                    <span className="absolute top-4 right-4 text-yellow-400 text-2xl font-bold">
                      ”
                    </span>

                    {/* Text */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {truncate(s.testimonial)}
                    </p>

                    {/* Show More */}
                    <button
                      onClick={() => setActiveStudent(s)}
                      className="text-red-500 text-sm font-medium mb-6"
                    >
                      Show More
                    </button>

                    {/* Footer */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={s.photo}
                          alt={s.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-red-600 font-semibold text-sm">
                          {s.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {s.course}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------ MODAL ------------------ */}
      {activeStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-lg w-full mx-4 rounded-2xl p-6 relative">

            {/* Close */}
            <button
              onClick={() => setActiveStudent(null)}
              className="absolute top-3 right-4 text-2xl text-gray-500"
            >
              ×
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
  {/* IMAGE */}
  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
    <Image
      src={activeStudent.photo}
      alt={activeStudent.name}
      width={64}
      height={64}
      className="w-full h-full object-cover"
    />
  </div>

  {/* TEXT */}
  <div>
    <p className="text-red-600 font-semibold">
      {activeStudent.name}
    </p>
    <p className="text-gray-500 text-sm">
      {activeStudent.course}
    </p>
  </div>
</div>


            {/* Full testimonial */}
            <p className="text-gray-700 text-sm leading-relaxed">
              “{activeStudent.testimonial}”
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
