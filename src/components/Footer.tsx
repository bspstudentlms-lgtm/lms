import { Phone, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-[#f3f3f3] overflow-hidden">

      {/* CURVED TOP (OVERLAPS PREVIOUS SECTION) */}
      {/* <div className="absolute inset-x-0 -top-24 h-40 bg-white rounded-b-[100%]" /> */}

      {/* CONTENT */}
      <div className="relative px-6 md:px-20 pt-16 pb-20">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-red-600 font-semibold text-lg mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="hover:text-red-600 cursor-pointer">
                Terms and Conditions
              </li>
              <li className="hover:text-red-600 cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-red-600 cursor-pointer">
                Sitemap
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-red-600 font-semibold text-lg mb-4">
              Contact Info
            </h4>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex items-center gap-3">
                <Phone size={18} /> +91-8008002794
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} /> +91-8008002795
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} /> info@backstagepass.co.in
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} /> admissions@backstagepass.co.in
              </li>
            </ul>
          </div>

          {/* DOWNLOAD BUTTON */}
          <div className="flex md:justify-end">
            <button className="bg-red-600 hover:bg-red-700 transition text-white px-10 py-4 rounded-full font-semibold shadow-lg">
              Download Brochure
            </button>
          </div>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex justify-center gap-6 mt-12">
  <Image
    src="https://backstagepass.co.in/dicord-3587209a.webp"
    alt="Discord"
    width={24}
    height={24}
    className="opacity-80 hover:opacity-100 transition"
  />

  <Image
    src="https://backstagepass.co.in/instagram-7f56c0ec.webp"
    alt="Instagram"
    width={24}
    height={24}
    className="opacity-80 hover:opacity-100 transition"
  />

  <Image
    src="https://backstagepass.co.in/facebook-ef97cef8.webp"
    alt="Facebook"
    width={24}
    height={24}
    className="opacity-80 hover:opacity-100 transition"
  />

  <Image
    src="https://backstagepass.co.in/Youtube-71fc51e6.webp"
    alt="YouTube"
    width={24}
    height={24}
    className="opacity-80 hover:opacity-100 transition"
  />

  <Image
    src="https://backstagepass.co.in/linkedin-52d514f9.webp"
    alt="LinkedIn"
    width={24}
    height={24}
    className="opacity-80 hover:opacity-100 transition"
  />
</div>


        {/* COPYRIGHT */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © A Subsidiary of PVR Memorial Educational Society 2025.
          All Rights Reserved
        </p>

      </div>
    </footer>
  );
}
