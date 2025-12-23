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
    image: "/images/codekata.png",
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
    image: "/images/webkata.png",
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
    image: "/images/sqlkata.png",
  },
];

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState("CodeKata");

  const activeContent = tabs.find((t) => t.name === activeTab);

  return (
    <section className="corporates">
  <h2>BackstagePass for Corporates</h2>
  <p>Explore our customized corporate solutions for Siva your company!</p>
  
  <div className="corporate-services">
    <div className="service">
      <div className="icon">🏢</div>
      <h3>Specialized<br/>Corporate Training</h3>
    </div>
    <div className="service">
      <div className="icon">👥</div>
      <h3>Streamlined<br/>Corporate Hiring</h3>
    </div>
    <div className="service">
      <div className="icon">🔍</div>
      <h3>Corporate Social<br/>Responsibility</h3>
    </div>
    <div className="service">
      <div className="icon">📊</div>
      <h3>HYRE<br/>assessment</h3>
    </div>
    <div className="service">
      <div className="icon">🔄</div>
      <h3>End-to-End<br/>Campus Hiring</h3>
    </div>
  </div>

  <a href="#" className="btn">Learn More</a>
</section>

  );
}
