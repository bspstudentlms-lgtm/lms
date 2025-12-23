import Image from "next/image";
import Link from "next/link";
import Badge from "../ui/badge/Badge";
import { ArrowRightIcon } from "@/icons";

interface CourseCardProps {
  course: any;
  type: "enrolled" | "recommended";
}

export default function CourseCard({ course, type }: CourseCardProps) {
  const isCompleted = course.is_coursecompleted === 1;
  const isStarted = course.last_watched_topic_id > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
        />
        {isCompleted && (
          <span className="absolute right-2 top-2 rounded-full bg-green-600 px-3 py-1 text-xs text-white">
            Completed
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-800">
        {course.title}
      </h4>

      {/* Meta */}
      <p className="mb-3 text-xs text-gray-500">
        {course.duration} Hours
      </p>

      {/* Action */}
      {type === "enrolled" ? (
        isCompleted ? (
          <Link
            href={`/coursedetails/${course.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-100 py-2 text-sm font-medium text-green-700"
          >
            View Certificate
          </Link>
        ) : (
          <Link
            href={`/coursedetails/${course.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {isStarted ? "Continue Learning" : "Start Course"}
            <ArrowRightIcon />
          </Link>
        )
      ) : (
        <button
          onClick={() =>
            course.urlpath
              ? window.open(course.urlpath, "_blank")
              : alert("URL not available")
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-600 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
        >
          View Details
          <ArrowRightIcon />
        </button>
      )}
    </div>
  );
}
