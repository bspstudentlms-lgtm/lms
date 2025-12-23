"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

type Student = {
  id: number;
  name: string;
  photo: string;
  course: string;
  testimonial: string;
};

const students: Student[] = [
  {
    id: 1,
    photo: "https://drive.google.com/file/d/1r6MXi0KGnjWOwTbEtsEgMt8XnSKY2CG0/view?usp=drive_link",
    name: "Taniya Das",
    course: "Game Art and Design (2nd Year)",
    testimonial:
      "Game Art introduced me to the visual side of development, where we learned art both traditionally and digitally. It helped us create characters, environments, and props. I learned how to color, style, and detail art to make it feel alive and realistic for games. Thanking Backstage Pass for providing such a great course for learning.",
  },
  {
    id: 2,
    photo: "https://drive.google.com/file/d/1r6MXi0KGnjWOwTbEtsEgMt8XnSKY2CG0/view?usp=drive_link",
    name: "Anisa Dhiman",
    course: "Game Design (2nd Year)",
    testimonial:
      "Through game design, I learned how to translate my vision and ideas into a structured process by understanding the game development pipeline. This helped me improve my ability to visualize concepts, generate better ideas, and bring everything together into a cohesive design. I would like to thank Backstage Pass.",
  },
  {
    id: 3,
    photo: "https://drive.google.com/file/d/1r6MXi0KGnjWOwTbEtsEgMt8XnSKY2CG0/view?usp=drive_link",
    name: "Piyush Gaur",
    course: "Game Design (4th Year)",
    testimonial:
      "With the guidance of mentors like Vishnu Sir, Sandeep Sir, and Sandy Sir, I learned how game design shapes player experience and how to build engaging loops and meaningful choices. Backstage Pass is a great place to learn and grow in game development.",
  },
  {
    id: 4,
    photo: "https://drive.google.com/file/d/1r6MXi0KGnjWOwTbEtsEgMt8XnSKY2CG0/view?usp=drive_link",
    name: "Manish Chetla",
    course: "M.Sc. Game Technology",
    testimonial:
      "I learned the complete process of game design, from transforming ideas into playable experiences to understanding structured workflows like GDD and level design. I also gained hands-on experience with C# and Unity, strengthening both my creative and technical abilities. Backstage Pass truly builds professionals for the game industry.",
  },
  {
    id: 5,
    photo: "https://drive.google.com/file/d/1r6MXi0KGnjWOwTbEtsEgMt8XnSKY2CG0/view?usp=drive_link",
    name: "Ansh Srivastava",
    course: "M.Sc. Game Technology (2nd Year)",
    testimonial:
      "Learning Game Design taught me how every mechanic and system ties back to creating fun for the player. On the Game Art side, I learned how shapes, silhouettes, textures, and styles build strong visual identity. Backstage Pass makes you feel like you’re in the real game dev grind, but with the coolest vibe.",
  },
  {
    id: 6,
    photo: "https://drive.google.com/file/d/1r6MXi0KGnjWOwTbEtsEgMt8XnSKY2CG0/view?usp=drive_link",
    name: "Shane Warren Silveira",
    course: "B.Sc. (Hons.) CSGD – 4th Year",
    testimonial:
      "Through Game Development, I learned how to design mechanics, build systems, and implement technical features. In Game Design, I understood how gameplay, story, and aesthetics shape player experience. Creativity and technology working together helped me think critically and design with purpose. Backstage Pass provides the perfect launchpad for aspiring game creators.",
  },
];


export default function CourseCarousel() {
 const [emblaRef] = useEmblaCarousel(
  {
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  },
  [Autoplay({ delay: 3000 })]
);


  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex gap-4">
          {students.map((s) => (
            <div className="embla__slide flex justify-center" key={s.id}>
              <div className="student-card w-[90%] sm:w-[320px] bg-white rounded-2xl shadow-md p-4 sm:p-6">
                <div className="flex justify-center mt-4">
                  <Image
                    src={s.photo}
                    alt={s.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2 sm:border-4 border-red-100"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center">{s.name}</h3>
<p className="text-sm text-gray-500 text-center mb-3">{s.course}</p>

<p className="text-sm text-gray-700 leading-relaxed">
  “{s.testimonial}”
</p>
                {/* <div className="flex justify-center items-center mt-2 h-8 sm:h-10">
                  <Image
                    src={s.companyLogo}
                    alt={s.name}
                    width={150}
                    height={60}
                    className="object-contain"
                  />
                </div> */}
                {/* Before Role */}
                {/* <div className="mt-3 p-2 sm:p-3 border rounded-lg text-xs sm:text-sm text-gray-700">
                  <h3 className="text-lg font-semibold text-center">{s.name}</h3>
<p className="text-sm text-gray-500 text-center mb-3">{s.course}</p>

<p className="text-sm text-gray-700 leading-relaxed">
  “{s.testimonial}”
</p>

                </div> */}

                {/* After BackstagePass */}
                {/* <div className="flex items-center mt-2 text-green-600 text-xs sm:text-sm">
                  <span className="mr-2">⬇</span> After BSP
                </div> */}

                {/* After Role */}
                {/* <div className="mt-2 p-2 sm:p-3 bg-green-100 rounded-lg text-xs sm:text-sm font-medium text-green-800">
                  <input type="radio" readOnly checked className="mr-2" />{" "}
                  {s.afterRole}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
