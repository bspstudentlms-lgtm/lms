export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
      <p className="text-sm font-medium text-gray-600">
        Loading your course…
      </p>
    </div>
  );
}
