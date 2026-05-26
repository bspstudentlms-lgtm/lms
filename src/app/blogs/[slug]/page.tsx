// import InnerBlog from "@/components/InnerBlog";
import BlogDetails from "@/components/BlogDetails";

export const metadata = {
  title: "Find the Best Online Game Development Courses | Backstage Pass Online",
  description:
    "Discover top online gaming courses to learn game design, programming, and game art. Study anytime with flexible self-paced lessons.",

  openGraph: {
    title: "Find the Best Online Game Development Courses | Backstage Pass Online",
    description:
      "Learn with Self-Paced Online Gaming Courses from Top Industry Experts",
    url: "https://learning.backstagepass.co.in/all-courses",
    siteName: "Backstagepass online learning",
    images: [
      {
        url: "https://backstagepass.co.in/newlogo-324ee245.webp",
        width: 1200,
        height: 630,
        alt: "Backstagepass online learning",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Find the Best Online Game Development Courses | Backstage Pass Online",
    description:
      "Discover top online gaming courses to learn game design, programming, and game art. Study anytime with flexible self-paced lessons.",
    images: ["https://backstagepass.co.in/newlogo-324ee245.webp"],
  },
};

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  return <BlogDetails slug={params.slug} />;
}