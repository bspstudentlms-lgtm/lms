import Image from "next/image";
import Link from "next/link";


export const metadata = {
  title: "Terms & Conditions | Backstage Pass",
  description: "Terms and Conditions for Backstage Pass LMS",
};

export default function TermsAndConditionsPage() {
  return (
    <>
     <header className="w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/bsp_logo_newupdated.png"
              alt="Backstage Pass"
              width={48}
              height={48}
            />
            <div>
              <h1 className="text-lg font-bold leading-none">
                BACKSTAGE PASS
              </h1>
              <p className="text-xs tracking-wide text-gray-600">
                INSTITUTE OF GAMING
              </p>
            </div>
          </div>
        </Link>

        {/* Login Button */}
        <Link
          href="/login"
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition"
        >
          Login
        </Link>
      </div>
    </header>
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Terms & Conditions
      </h1>

      <p className="text-gray-700 mb-4">
        Welcome to Backstage Pass. By accessing or using our platform,
        you agree to be bound by the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Use of Platform
      </h2>
      <p className="text-gray-600 mb-4">
        This platform is intended for educational purposes only.
        Unauthorized use or redistribution of content is strictly prohibited.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Payments & Refunds
      </h2>
      <p className="text-gray-600 mb-4">
        All payments made are non-refundable unless explicitly stated.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. User Responsibilities
      </h2>
      <p className="text-gray-600 mb-4">
        Users are responsible for maintaining the confidentiality
        of their account credentials.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Changes to Terms
      </h2>
      <p className="text-gray-600">
        We reserve the right to update or modify these terms at any time.
      </p>
    </div>
    </>
  );
}
