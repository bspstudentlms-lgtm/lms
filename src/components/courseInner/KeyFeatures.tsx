const features = [
  "Industry aligned curriculum",
  "Hands-on practical training",
  "Beginner friendly",
  "Completion certificate",
];

export default function KeyFeatures() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-4 border rounded-md">
              {f}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
