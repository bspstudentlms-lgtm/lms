import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     return baseUrl; // redirects to homepage after login
  //   },
  // },
  callbacks: {
  async redirect({ url, baseUrl }) {
    // allow dynamic return URLs
    if (url.startsWith(baseUrl)) return url;
    return baseUrl;
  },
},
};

export default NextAuth(authOptions);