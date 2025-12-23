export default function Footer() {
  return (
    <footer className="bg-[#1c1c1c] text-gray-300 px-6 md:px-20 py-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
        
        {/* Column 1 */}
        <div>
          <h3 className="font-semibold text-white mb-4">
            ZEN CLASS <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">LIVE CLASS</span>
          </h3>
          <ul className="space-y-2">
            <li>Full Stack Development</li>
            <li>Automation & Testing</li>
            <li>Data Science</li>
            <li>UI/UX</li>
            <li>DevOps</li>
            <li>Data Engineering</li>
            <li>Business Analytics with Digital Marketing</li>
            <li>All Programs</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold text-white mb-4">Popular Courses</h3>
          <ul className="space-y-2">
            <li>Python – IIT-M Pravartak Certified</li>
            <li>Java</li>
            <li>Mobile Hacking</li>
            <li>C Programming</li>
            <li>AWS</li>
            <li>Angular</li>
            <li>Dark Web</li>
            <li>All Courses</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold text-white mb-4">Self-Paced Courses</h3>
          <ul className="space-y-2">
            <li>Premium Pass</li>
            <li>Paid Courses</li>
            <li>Free Courses</li>
            <li>Combos</li>
          </ul>
          <h3 className="font-semibold text-white mt-6 mb-4">Practice Platforms</h3>
          <ul className="space-y-2">
            <li>CodeKata</li>
            <li>WebKata</li>
            <li>SQLKata</li>
            <li>Debugging</li>
            <li>IDE</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-semibold text-white mb-4">Products</h3>
          <ul className="space-y-2">
            <li>HackerKID</li>
            <li>Placement Preparation</li>
            <li>BackstagePass for Corporates</li>
            <li>Studytonight</li>
          </ul>
          <h3 className="font-semibold text-white mt-6 mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>Success Stories</li>
            <li>Learn Hub</li>
            <li className="flex items-center gap-2">
              Free Resources <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded">NEW</span>
            </li>
            <li>Blog</li>
            <li>Web Stories</li>
            <li>Rewards</li>
            <li>Refer a friend</li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2">
            <li>Refund Policy</li>
            <li>FAQs</li>
            <li>Contact Us</li>
            <li>About Us</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
