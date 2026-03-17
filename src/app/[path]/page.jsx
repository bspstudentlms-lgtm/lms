import CoursePage from "@/components/CoursePage";

export const metadata = {
  title: "Game Development Course | Backstage Pass",
  description:
    "Learn game development, 3D modeling, and design with expert-led courses from Backstage Pass.",
};

export default function Page({ params }) {
  return <CoursePage params={params} />;
}