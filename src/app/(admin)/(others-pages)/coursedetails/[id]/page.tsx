//import CourseClient from './CourseClient';
import CourseDetail from "@/components/course-detail/courseDetail";

interface CoursePageProps {
  params: { id: string };
}


export default function CourseDetailsPage({ params }: CoursePageProps) {
  const { id } = params;

  return (
    <div>
      <CourseDetail id={id} />
    </div>
  );
}