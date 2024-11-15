import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.active = user.active;
        session.user.phone = user.phone;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      return url.startsWith("/api/auth/signin") ? baseUrl + "/app" : url;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 40000,
      },
    }),
    // ...add more providers here
  ],
  theme: {
    colorScheme: "dark",
    logo: "/logo/png/logo-no-background-mang.png",
  },
  pages: {
    newUser: "/app",
  },
};

export default NextAuth(authOptions);

