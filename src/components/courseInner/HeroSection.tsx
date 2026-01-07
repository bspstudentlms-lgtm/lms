import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-[#8b2d2d] text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 px-6 py-14">

        {/* LEFT */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Basics Of Maya for Beginners
          </h1>

          <p className="text-sm text-gray-200 mb-6">
            Learn Autodesk Maya from scratch with industry-driven curriculum
            designed by professional artists.
          </p>

          <div className="mb-4">
            <span className="line-through text-gray-300 mr-2">₹4999</span>
            <span className="text-xl font-bold text-white">₹2799</span>
          </div>

          <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-md font-semibold">
            Enroll Now
          </button>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <Image
            src="/maya-course-banner.png"
            alt="Maya Course"
            width={500}
            height={300}
            className="rounded-lg"
          />
        </div>

      </div>
    </section>
  );
}
