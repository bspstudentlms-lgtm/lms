//import CourseClient from './CourseClient';
import CourseDetailsLatest from "@/components/course-detail/coursedetailslatest";

interface CoursePagePropsLatest {
  params: { id: string };
}


export default function CourseDetailsPage({ params }: CoursePagePropsLatest) {
  const { id } = params;

  return (
    <div>
      <CourseDetailsLatest id={id} />
    </div>
  );
}