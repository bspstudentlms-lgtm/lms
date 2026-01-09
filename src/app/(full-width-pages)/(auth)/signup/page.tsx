export const dynamic = "force-dynamic";

import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backstagepass SignUp Page | Backstagepass Dashboard Template",
  description: "This is Backstagepass SignUp Page LMSAdmin Dashboard Template",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
