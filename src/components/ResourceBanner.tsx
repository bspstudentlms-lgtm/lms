export default function ResourceBanner() {
  return (
    <div className="w-full flex justify-center py-10">
      <div className="w-full max-w-6xl rounded-xl shadow-md bg-gradient-to-r from-purple-100 to-purple-200 relative overflow-hidden p-10 text-center">
        
        {/* Background floating icons */}
        <div className="absolute inset-0 opacity-20">
          {/* You can replace these placeholders with SVG icons (React, Python, folders) */}
          <div className="absolute top-6 left-12 text-purple-600 text-5xl">⚛️</div>
          <div className="absolute top-12 right-16 text-purple-600 text-5xl">🐍</div>
          <div className="absolute bottom-8 left-1/4 text-purple-600 text-5xl">📂</div>
          <div className="absolute bottom-10 right-1/3 text-purple-600 text-5xl">📂</div>
        </div>

        {/* Content */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative">
          Find Our Perfect Free Resources to <br /> Enhance Your Skills Now!
        </h2>

        <button className="mt-6 bg-red-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg relative">
          Explore Now
        </button>
      </div>
    </div>
  );
}
