import CoursePage from "@/components/CoursePage";

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `https://backstagepass.co.in/reactapi/api/course_innerpage.php?path=${params.path}`,
      { cache: "no-store" } // important if content changes
    );

    const data = await res.json();

    return {
      title: data?.meta_title || data?.course_name || "Game Development Course | Backstage Pass",
      description:
        data?.meta_description ||
        "Learn game development, 3D modeling, and design with expert-led courses from Backstage Pass.",
      openGraph: {
        title: data?.meta_title || data?.course_name,
        description: data?.meta_description,
       
      },
    };
  } catch (error) {
    return {
      title: "Game Development Course | Backstage Pass",
      description:
        "Learn game development, 3D modeling, and design with expert-led courses from Backstage Pass.",
    };
  }
}

export default function Page({ params }) {
  return <CoursePage params={params} />;
}