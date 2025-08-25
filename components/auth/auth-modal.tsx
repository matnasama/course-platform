"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const { login, register, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (mode === "login") {
      const success = await login(formData.email, formData.password)
      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        })
        onClose()
        setFormData({ name: "", email: "", password: "" })
      } else {
        setError("Credenciales incorrectas. Intenta con juan@example.com / password123")
      }
    } else {
      if (!formData.name.trim()) {
        setError("El nombre es requerido")
        return
      }

      const success = await register(formData.name, formData.email, formData.password)
      if (success) {
        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada exitosamente.",
        })
        onClose()
        setFormData({ name: "", email: "", password: "" })
      } else {
        setError("El email ya está registrado")
      }
    }
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setError("")
    setFormData({ name: "", email: "", password: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Ingresa tus credenciales para acceder a tu cuenta"
              : "Completa los datos para crear tu cuenta"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="link" onClick={toggleMode} className="text-sm">
            {mode === "login" ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </Button>
        </div>

        {mode === "login" && (
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <strong>Usuarios de prueba:</strong>
            <br />
            Estudiante: juan@example.com / password123
            <br />
            Instructor: maria@example.com / instructor123
            <br />
            Admin: admin@example.com / admin123
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
