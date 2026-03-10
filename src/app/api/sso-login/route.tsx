import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const course = searchParams.get("course") || "dashboard";

  const loginUrl = `https://learning.backstagepass.co.in/api/auth/signin/google?callbackUrl=https://learning.backstagepass.co.in/${course}`;

  const response = NextResponse.redirect(loginUrl);

  response.cookies.set("course_redirect", course);

  return response;
}