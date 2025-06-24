import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiClient } from "./api-client";
import { User } from "@/app/dashboard/users/page";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const { data } = await apiClient.post<{
            item: { user: User; token: string };
          }>("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, token } = data.item;
          if (user && token) {
            if (["distributor"].includes(user.role?.name)) {
              throw new Error("You're not allowed to login");
            }
            return {
              id: user.id,
              uuid: user.uuid,
              email: user.email,
              name: `${user.first_name} ${user.last_name}`,
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role?.name || "",
              accessToken: token,
            };
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          // console.error("Auth error:", error);
          throw new Error(error?.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.uuid = user.uuid;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.user.uuid = token.uuid as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
