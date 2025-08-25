"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

interface Enrollment {
  id: string
  userId: string
  courseId: number
  enrolledAt: string
  progress: number
  status: "active" | "completed" | "paused"
  paymentStatus: "pending" | "completed" | "failed"
}

interface EnrollmentContextType {
  enrollments: Enrollment[]
  enrollInCourse: (courseId: number, paymentMethod: string) => Promise<boolean>
  isEnrolled: (courseId: number) => boolean
  getEnrollment: (courseId: number) => Enrollment | undefined
  updateProgress: (courseId: number, progress: number) => void
  getUserEnrollments: () => Enrollment[]
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined)

// Mock enrollments data
const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    userId: "1",
    courseId: 1,
    enrolledAt: "2024-02-15",
    progress: 65,
    status: "active",
    paymentStatus: "completed",
  },
  {
    id: "2",
    userId: "1",
    courseId: 3,
    enrolledAt: "2024-03-01",
    progress: 30,
    status: "active",
    paymentStatus: "completed",
  },
]

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Load enrollments from localStorage
    const storedEnrollments = localStorage.getItem("enrollments")
    if (storedEnrollments) {
      setEnrollments(JSON.parse(storedEnrollments))
    } else {
      setEnrollments(mockEnrollments)
      localStorage.setItem("enrollments", JSON.stringify(mockEnrollments))
    }
  }, [])

  const enrollInCourse = async (courseId: number, paymentMethod: string): Promise<boolean> => {
    if (!user) return false

    // Check if already enrolled
    const existingEnrollment = enrollments.find((e) => e.userId === user.id && e.courseId === courseId)
    if (existingEnrollment) return false

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      userId: user.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: "active",
      paymentStatus: "completed",
    }

    const updatedEnrollments = [...enrollments, newEnrollment]
    setEnrollments(updatedEnrollments)
    localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments))

    return true
  }

  const isEnrolled = (courseId: number): boolean => {
    if (!user) return false
    return enrollments.some((e) => e.userId === user.id && e.courseId === courseId)
  }

  const getEnrollment = (courseId: number): Enrollment | undefined => {
    if (!user) return undefined
    return enrollments.find((e) => e.userId === user.id && e.courseId === courseId)
  }

  const updateProgress = (courseId: number, progress: number) => {
    if (!user) return

    const updatedEnrollments = enrollments.map((e) =>
      e.userId === user.id && e.courseId === courseId
        ? { ...e, progress, status: progress >= 100 ? ("completed" as const) : ("active" as const) }
        : e,
    )

    setEnrollments(updatedEnrollments)
    localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments))
  }

  const getUserEnrollments = (): Enrollment[] => {
    if (!user) return []
    return enrollments.filter((e) => e.userId === user.id)
  }

  return (
    <EnrollmentContext.Provider
      value={{
        enrollments,
        enrollInCourse,
        isEnrolled,
        getEnrollment,
        updateProgress,
        getUserEnrollments,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext)
  if (context === undefined) {
    throw new Error("useEnrollment must be used within an EnrollmentProvider")
  }
  return context
}
