const topics = [
  "Introduction to 3D and Maya",
  "Geometry & Modeling",
  "UV Mapping",
  "Texturing Basics",
  "Exporting Models",
];

export default function CourseTopics() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">
        Course Topics You Will Learn
      </h2>

      <div className="space-y-3">
        {topics.map((t, i) => (
          <details key={i} className="border rounded-md p-4">
            <summary className="font-semibold text-red-600">
              {t}
            </summary>
            <p className="mt-2 text-gray-600">
              Detailed hands-on explanation.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
