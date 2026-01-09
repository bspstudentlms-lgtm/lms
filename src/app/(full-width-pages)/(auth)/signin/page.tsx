export const dynamic = "force-dynamic";

import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backstagepass SignIn Page | Backstagepass Dashboard Template",
  description: "This is Backstagepass Signin Page LMSAdmin Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
