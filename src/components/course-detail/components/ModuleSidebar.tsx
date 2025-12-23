"use client";

export default function ModuleSidebar({
  modules,
  openModule,
  setOpenModule,
  watchedTopicIds,
}: any) {
  return (
    <aside className="p-4 border-l sticky top-0 max-h-screen overflow-y-auto">
      <ul className="space-y-2">
        {modules.map((module: any, idx: number) => (
          <li key={idx}>
            <button
              onClick={() => setOpenModule(idx)}
              className={`w-full text-left p-3 rounded-lg font-semibold ${
                idx === openModule
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {module.title}
            </button>

            {idx === openModule && Array.isArray(module?.topics) && (
                <ul className="mt-2 space-y-1">
                    {module.topics.map((t: any) => (
                    <li
                        key={t.id}   // ✅ FIX HERE
                        className="flex items-center justify-between p-2 text-sm rounded hover:bg-gray-100"
                    >
                        <span>{t.text}</span>

                        {t.video_duration && (
                        <span className="text-xs text-gray-500">
                            {t.video_duration}
                        </span>
                        )}
                    </li>
                    ))}
                </ul>
                )}


          </li>
        ))}
      </ul>
    </aside>
  );
}
