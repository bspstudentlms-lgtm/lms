import { Outfit } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import ConditionalHeader from "../layout/ConditionalHeader"; 

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Backstage Pass LMS | Online Learning Platform",
  description:
    "Backstage Pass LMS offers live classes, recorded courses, quizzes, mentor support, and certificates for skill development.",

  openGraph: {
    title: "Backstage Pass LMS | Learn. Practice. Get Certified",
    description:
      "A complete Learning Management System with live classes, recorded videos, quizzes, mentor support, and certificates.",
    url: "https://lms-bsp.vercel.app/",
    siteName: "Backstage Pass LMS",
    images: [
      {
        url: "https://backstagepass.co.in/newlogo-324ee245.webp",
        width: 1200,
        height: 630,
        alt: "Backstage Pass LMS",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Backstage Pass LMS | Online Learning Platform",
    description:
      "Learn with expert mentors through live classes, videos, quizzes, and certifications.",
    images: ["https://backstagepass.co.in/newlogo-324ee245.webp"],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ClientProviders>
          <ConditionalHeader />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

