import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      first_name: string
      last_name: string
    } & DefaultSession["user"]
    accessToken: string
  }

  interface User {
    id: string
    email: string
    name: string
    first_name: string
    last_name: string
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    first_name: string
    last_name: string
    accessToken: string
  }
}
