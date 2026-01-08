const faqs = [
  "Who is this course for?",
  "Do I need prior experience?",
  "Will I get a certificate?",
  "Is this self-paced?",
];

export default function FAQ() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {faqs.map((q, i) => (
          <details key={i} className="border rounded-md p-4">
            <summary className="font-medium text-red-600">
              {q}
            </summary>
            <p className="mt-2 text-gray-600">
              Answer goes here.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
