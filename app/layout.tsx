import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { EnrollmentProvider } from "@/lib/enrollment-context"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "EduPlatform - Cursos Profesionales",
  description: "Transforma tu carrera con cursos profesionales de tecnología",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <EnrollmentProvider>
            {children}
            <Toaster />
          </EnrollmentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
