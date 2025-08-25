"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "student" | "instructor" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "password123",
    role: "student" as const,
  },
  {
    id: "2",
    name: "María González",
    email: "maria@example.com",
    password: "instructor123",
    role: "instructor" as const,
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      }
      setUser(userSession)
      localStorage.setItem("user", JSON.stringify(userSession))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: "student" as const,
    }

    mockUsers.push(newUser)

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }

    setUser(userSession)
    localStorage.setItem("user", JSON.stringify(userSession))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
