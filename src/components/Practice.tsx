"use client";
import { useState } from "react";

const tabs = [
  {
    name: "CodeKata",
    title: "CodeKata",
    description: [
      "CodeKata is an interactive platform for programming practice.",
      "Offers 1500+ coding problems curated by top IT industry experts.",
      "Helps showcase your skills for job recruitment.",
      "Enhances your ability to crack coding interviews."
    ],
    button: "Explore CodeKata",
    image: "https://www.guvi.in/assets/Cvy-k-kD-codekata.webp",
  },
  {
    name: "WebKata",
    title: "WebKata",
    description: [
      "Practice frontend & backend skills with real-world projects.",
      "Get hands-on with HTML, CSS, JS, and frameworks.",
      "Learn deployment & full-stack workflows."
    ],
    button: "Explore WebKata",
    image: "https://www.guvi.in/assets/DsvBF-Tw-webkata.webp",
  },
  {
    name: "SQLKata",
    title: "SQLKata",
    description: [
      "Solve database challenges with SQL queries.",
      "Covers beginner to advanced SQL problems.",
      "Gain confidence for DB interviews."
    ],
    button: "Explore SQLKata",
    image: "https://www.guvi.in/assets/GNnqGG_a-sqlkata.webp",
  },
];

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState("CodeKata");

  const activeContent = tabs.find((t) => t.name === activeTab);

  return (
    <div className="py-16 bg-white">
      {/* Section Title */}
      <h2 className="text-center text-3xl font-bold mb-8">
        Learn. Practice. Earn. Have Fun!
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="flex space-x-2 bg-gray-50 rounded-md shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-6 py-3 font-medium transition-all border-b-4 ${
                activeTab === tab.name
                  ? "bg-red-50 text-red-600 border-red-500"
                  : "text-gray-600 border-transparent hover:bg-gray-100"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left: Image */}
        <div className="flex justify-center">
          <img
            src={activeContent.image}
            alt={activeContent.title}
            className="w-[90%] md:w-[80%] shadow-lg rounded-lg"
          />
        </div>

        {/* Right: Text */}
        <div>
          <h3 className="text-2xl font-bold mb-4">{activeContent.title}</h3>
          <ul className="space-y-3 mb-6 text-gray-600">
            {activeContent.description.map((point, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-red-600 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-md shadow">
            {activeContent.button}
          </button>
        </div>
      </div>
    </div>
  );
}
