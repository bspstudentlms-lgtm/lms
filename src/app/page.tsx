import HomePageContent from '@/components/HomePageContent';

export const metadata = {
  title: "Backstagepass online learning | Online Gaming Courses & certificates",
  description:
    "Learn with Self-Paced Online Gaming Courses from Top Industry Experts",

   openGraph: {
    title: "Backstagepass online learning | Online Gaming Courses & certificates",
    description:
      "Learn with Self-Paced Online Gaming Courses from Top Industry Experts",
    url: "https://learning.backstagepass.co.in/",
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
    title: "Backstagepass online learning | Online Gaming Courses & certificates",
    description:
      "Learn with Self-Paced Online Gaming Courses from Top Industry Experts",
    images: ["https://backstagepass.co.in/newlogo-324ee245.webp"],
  },
};


export default function RootPage() {
  return <HomePageContent />;
}