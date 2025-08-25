"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, BookOpen, LogOut, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function UserMenu() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    })
  }

  const handleAdminPanel = () => {
    router.push("/admin")
  }

  const handleMyCourses = () => {
    router.push("/my-courses")
  }

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student":
        return "Estudiante"
      case "instructor":
        return "Instructor"
      case "admin":
        return "Administrador"
      default:
        return "Usuario"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{getRoleLabel(user.role)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMyCourses}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Mis Cursos</span>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem onClick={handleAdminPanel}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Panel Admin</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
