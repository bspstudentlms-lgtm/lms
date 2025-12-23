import { Outfit } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import ConditionalHeader from "../layout/ConditionalHeader"; 

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Your App",
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

