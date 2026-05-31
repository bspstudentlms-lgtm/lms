import { Outfit } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import ConditionalHeader from "../layout/ConditionalHeader"; 
import AnalyticsInit from "@/components/analytics/AnalyticsInit";
import Msg91Widget from "@/components/chat/Msg91Widget";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Backstagepass online learning | Online Gaming Courses & certificates",
  description:
    "Learn with Self-Paced Online Gaming Courses from Top Industry Experts",
    
  verification: {
    google: "rA-13zNhu6gV6Vo836kTcXNnNi4xzurZjEE4yfv7lw8",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {



  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        {/* <Msg91Widget />        */}
        <AnalyticsInit /> {/* ✅ analytics loaded once */}
        <ClientProviders>
          <ConditionalHeader />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

