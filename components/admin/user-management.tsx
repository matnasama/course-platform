"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, UserCheck, UserX, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "student",
    status: "active",
    enrollments: 3,
    joinDate: "2024-01-15",
    lastActive: "2024-03-10",
  },
  {
    id: "2",
    name: "María González",
    email: "maria@example.com",
    role: "instructor",
    status: "active",
    enrollments: 0,
    joinDate: "2023-12-01",
    lastActive: "2024-03-09",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    enrollments: 0,
    joinDate: "2023-11-01",
    lastActive: "2024-03-10",
  },
  {
    id: "4",
    name: "Carlos López",
    email: "carlos@example.com",
    role: "student",
    status: "inactive",
    enrollments: 1,
    joinDate: "2024-02-20",
    lastActive: "2024-02-25",
  },
  {
    id: "5",
    name: "Ana García",
    email: "ana@example.com",
    role: "student",
    status: "active",
    enrollments: 5,
    joinDate: "2024-01-08",
    lastActive: "2024-03-10",
  },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(mockUsers)
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Administrador</Badge>
      case "instructor":
        return <Badge className="bg-blue-100 text-blue-800">Instructor</Badge>
      case "student":
        return <Badge variant="secondary">Estudiante</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "inactive":
        return <Badge variant="outline">Inactivo</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">Suspendido</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleChangeRole = (userId: string, newRole: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    toast({
      title: "Rol actualizado",
      description: `El rol del usuario ha sido cambiado a ${newRole}.`,
    })
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido modificado.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <p className="text-muted-foreground">Administra todos los usuarios de la plataforma</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuario{filteredUsers.length !== 1 ? "s" : ""} encontrado
            {filteredUsers.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Inscripciones</TableHead>
                <TableHead>Fecha de registro</TableHead>
                <TableHead>Última actividad</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.enrollments}</TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "student")}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Hacer Estudiante
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "instructor")}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Hacer Instructor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "admin")}>
                          <Shield className="w-4 h-4 mr-2" />
                          Hacer Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                          {user.status === "active" ? (
                            <>
                              <UserX className="w-4 h-4 mr-2" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
