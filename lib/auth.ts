import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
          throw new Error("Email and password are required")
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await response.json()

          if (response.ok && data.status === "success") {
            const { user, token } = data.data.item
            return {
              id: user.id,
              email: user.email,
              name: `${user.first_name} ${user.last_name}`,
              role: user.role?.name,
              accessToken: token,
            }
          } else {
            throw new Error(data.message || "Invalid credentials")
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error("Authentication failed")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string
        session.user.role = token.role as string
      }
      return session
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
}
