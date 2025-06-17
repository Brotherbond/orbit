// NextAuth-like authentication utilities
export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "admin" | "user" | "manager"
}

export interface Session {
  user: User
  expires: string
}

// Mock authentication state
let currentUser: User | null = null
let currentSession: Session | null = null

export const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  // Mock authentication logic
  if (email === "admin@example.com" && password === "password") {
    currentUser = {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
    }

    currentSession = {
      user: currentUser,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    return { success: true }
  }

  return { success: false, error: "Invalid credentials" }
}

export const signUp = async (userData: {
  name: string
  email: string
  password: string
}): Promise<{ success: boolean; error?: string }> => {
  // Mock registration logic
  currentUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    role: "user",
  }

  currentSession = {
    user: currentUser,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

  return { success: true }
}

export const signOut = async (): Promise<void> => {
  currentUser = null
  currentSession = null
}

export const getSession = (): Session | null => {
  return currentSession
}

export const useSession = () => {
  return {
    data: currentSession,
    status: currentSession ? "authenticated" : "unauthenticated",
  }
}

export const requireAuth = (callback: () => void) => {
  if (!currentSession) {
    throw new Error("Authentication required")
  }
  callback()
}
