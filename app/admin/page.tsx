"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Shield,
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CourseForm } from "@/components/admin/course-form"
import { UserManagement } from "@/components/admin/user-management"

// Mock data for admin dashboard
const mockStats = {
  totalUsers: 10247,
  totalCourses: 156,
  totalRevenue: 125430,
  activeEnrollments: 8934,
}

const mockCourses = [
  {
    id: 1,
    title: "Desarrollo Full Stack con React y Node.js",
    instructor: "María González",
    students: 1250,
    revenue: 373750,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "React Native: Apps Móviles Profesionales",
    instructor: "Carlos Ruiz",
    students: 890,
    revenue: 221610,
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: 3,
    title: "PostgreSQL: Base de Datos Avanzada",
    instructor: "Ana Martínez",
    students: 650,
    revenue: 129350,
    status: "draft",
    createdAt: "2024-02-15",
  },
]

const mockRecentActivity = [
  { id: 1, action: "Nuevo usuario registrado", user: "Carlos López", time: "Hace 5 min" },
  { id: 2, action: "Curso completado", user: "Ana García", course: "React Básico", time: "Hace 15 min" },
  { id: 3, action: "Nueva inscripción", user: "Luis Martín", course: "Node.js Avanzado", time: "Hace 30 min" },
  { id: 4, action: "Pago procesado", user: "María Rodríguez", amount: "$299", time: "Hace 1 hora" },
]

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const handleEditCourse = (course: any) => {
    setEditingCourse(course)
    setShowCourseForm(true)
  }

  const handleDeleteCourse = (courseId: number) => {
    // Mock delete functionality
    console.log("Deleting course:", courseId)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "draft":
        return <Badge variant="secondary">Borrador</Badge>
      case "archived":
        return <Badge variant="outline">Archivado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al sitio
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Bienvenido, {user.name}</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">+8 nuevos este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+23% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inscripciones Activas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeEnrollments.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user}
                          {activity.course && ` - ${activity.course}`}
                          {activity.amount && ` - ${activity.amount}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gestión de Cursos</h2>
                <p className="text-muted-foreground">Administra todos los cursos de la plataforma</p>
              </div>
              <Button
                onClick={() => {
                  setEditingCourse(null)
                  setShowCourseForm(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Curso
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Estudiantes</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell>{course.students.toLocaleString()}</TableCell>
                        <TableCell>${course.revenue.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(course.status)}</TableCell>
                        <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteCourse(course.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
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
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
              <p className="text-muted-foreground">Ajustes generales de la plataforma</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                  <CardDescription>Ajustes básicos de la plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Registro de usuarios</h4>
                      <p className="text-sm text-muted-foreground">Permitir que nuevos usuarios se registren</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Habilitado
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo mantenimiento</h4>
                      <p className="text-sm text-muted-foreground">Activar modo mantenimiento del sitio</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Deshabilitado
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configurar notificaciones del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificaciones por email</h4>
                      <p className="text-sm text-muted-foreground">Enviar notificaciones por correo electrónico</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          onClose={() => {
            setShowCourseForm(false)
            setEditingCourse(null)
          }}
        />
      )}
    </div>
  )
}
