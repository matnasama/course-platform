"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useEnrollment } from "@/lib/enrollment-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Play, Award, ArrowLeft, CheckCircle, Star } from "lucide-react"

// Course data (same as in course detail page)
const allCourses = [
  {
    id: 1,
    title: "Desarrollo Full Stack con React y Node.js",
    description:
      "Aprende a crear aplicaciones web completas desde cero con las tecnologías más demandadas del mercado.",
    instructor: "María González",
    rating: 4.8,
    students: 1250,
    duration: "12 semanas",
    price: 299,
    image: "/modern-web-development-coding-screen.png",
    category: "Desarrollo Web",
    level: "Intermedio",
  },
  {
    id: 2,
    title: "React Native: Apps Móviles Profesionales",
    description: "Domina React Native y crea aplicaciones móviles nativas para iOS y Android con un solo código base.",
    instructor: "Carlos Ruiz",
    rating: 4.9,
    students: 890,
    duration: "10 semanas",
    price: 249,
    image: "/mobile-app-development.png",
    category: "Desarrollo Móvil",
    level: "Avanzado",
  },
  {
    id: 3,
    title: "PostgreSQL: Base de Datos Avanzada",
    description:
      "Conviértete en experto en PostgreSQL, desde consultas básicas hasta optimización y administración avanzada.",
    instructor: "Ana Martínez",
    rating: 4.7,
    students: 650,
    duration: "8 semanas",
    price: 199,
    image: "/database-server-technology.png",
    category: "Base de Datos",
    level: "Intermedio",
  },
]

export default function MyCoursesPage() {
  const { user, isLoading } = useAuth()
  const { getUserEnrollments } = useEnrollment()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
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

  if (!user) {
    return null
  }

  const enrollments = getUserEnrollments()
  const enrolledCourses = enrollments
    .map((enrollment) => {
      const course = allCourses.find((c) => c.id === enrollment.courseId)
      return { ...course, enrollment }
    })
    .filter(Boolean)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">En progreso</Badge>
      case "paused":
        return <Badge variant="outline">Pausado</Badge>
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
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Mis Cursos</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Inscritos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Completados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.filter((e) => e.status === "completed").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enrollments.length > 0
                  ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses */}
        {enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes cursos inscritos</h3>
              <p className="text-muted-foreground mb-4">
                Explora nuestro catálogo y encuentra el curso perfecto para ti
              </p>
              <Button onClick={() => router.push("/")}>Explorar cursos</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Tus cursos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                        {course.category}
                      </Badge>
                      {getStatusBadge(course.enrollment.status)}
                    </div>

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{course.level}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl leading-tight">{course.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">por {course.instructor}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progreso</span>
                            <span>{course.enrollment.progress}%</span>
                          </div>
                          <Progress value={course.enrollment.progress} className="h-2" />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                        </div>

                        <Button className="w-full" onClick={() => router.push(`/course/${course.id}`)}>
                          <Play className="w-4 h-4 mr-2" />
                          {course.enrollment.progress === 0 ? "Comenzar" : "Continuar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
