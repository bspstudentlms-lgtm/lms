const outcomes = [
  "Understand 3D fundamentals",
  "Create basic models",
  "Apply textures",
  "Export assets",
];

export default function Outcomes() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">
        After this course, you will be able to
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        {outcomes.map((o, i) => (
          <li key={i}>{o}</li>
        ))}
      </ul>
    </section>
  );
}
