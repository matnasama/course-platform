"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Play,
  CheckCircle,
  Award,
  Globe,
  Smartphone,
  Database,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEnrollment } from "@/lib/enrollment-context"
import { EnrollmentModal } from "@/components/enrollment/enrollment-modal"
import { useToast } from "@/hooks/use-toast"

// Extended course data with more details
const allCourses = [
  {
    id: 1,
    title: "Desarrollo Full Stack con React y Node.js",
    description:
      "Aprende a crear aplicaciones web completas desde cero con las tecnologías más demandadas del mercado.",
    longDescription:
      "Este curso completo te llevará desde los fundamentos hasta conceptos avanzados del desarrollo full stack. Aprenderás React para el frontend, Node.js y Express para el backend, bases de datos con MongoDB, autenticación, deployment y mucho más. Al finalizar serás capaz de crear aplicaciones web profesionales completas.",
    instructor: "María González",
    instructorBio:
      "Desarrolladora Senior con 8+ años de experiencia en empresas tech. Ex-Google, especialista en React y Node.js.",
    rating: 4.8,
    students: 1250,
    duration: "12 semanas",
    price: 299,
    image: "/modern-web-development-coding-screen.png",
    category: "Desarrollo Web",
    level: "Intermedio",
    skills: ["React", "Node.js", "Express", "MongoDB", "JWT", "Deployment"],
    modules: [
      { title: "Fundamentos de React", duration: "2 semanas", lessons: 12 },
      { title: "Estado y Hooks Avanzados", duration: "2 semanas", lessons: 10 },
      { title: "Backend con Node.js", duration: "3 semanas", lessons: 15 },
      { title: "Base de Datos y APIs", duration: "2 semanas", lessons: 8 },
      { title: "Autenticación y Seguridad", duration: "2 semanas", lessons: 9 },
      { title: "Deployment y Producción", duration: "1 semana", lessons: 6 },
    ],
    requirements: ["Conocimientos básicos de JavaScript", "HTML y CSS", "Familiaridad con Git"],
    whatYouLearn: [
      "Crear aplicaciones React modernas y escalables",
      "Desarrollar APIs REST con Node.js y Express",
      "Implementar autenticación y autorización",
      "Trabajar con bases de datos NoSQL",
      "Desplegar aplicaciones en producción",
      "Mejores prácticas de desarrollo full stack",
    ],
  },
  {
    id: 2,
    title: "React Native: Apps Móviles Profesionales",
    description: "Domina React Native y crea aplicaciones móviles nativas para iOS y Android con un solo código base.",
    longDescription:
      "Conviértete en un desarrollador móvil experto con React Native. Este curso te enseñará a crear aplicaciones móviles nativas de alta calidad para iOS y Android usando JavaScript y React. Aprenderás navegación, estado global, APIs nativas, publicación en stores y mucho más.",
    instructor: "Carlos Ruiz",
    instructorBio:
      "Mobile Developer con 6+ años creando apps para startups y empresas Fortune 500. Especialista en React Native.",
    rating: 4.9,
    students: 890,
    duration: "10 semanas",
    price: 249,
    image: "/mobile-app-development.png",
    category: "Desarrollo Móvil",
    level: "Avanzado",
    skills: ["React Native", "Expo", "Navigation", "Redux", "Native APIs", "App Store"],
    modules: [
      { title: "Fundamentos de React Native", duration: "2 semanas", lessons: 10 },
      { title: "Navegación y Routing", duration: "1.5 semanas", lessons: 8 },
      { title: "Estado Global con Redux", duration: "2 semanas", lessons: 12 },
      { title: "APIs Nativas y Plugins", duration: "2 semanas", lessons: 9 },
      { title: "Optimización y Performance", duration: "1.5 semanas", lessons: 7 },
      { title: "Publicación en Stores", duration: "1 semana", lessons: 5 },
    ],
    requirements: ["Experiencia sólida con React", "JavaScript ES6+", "Conocimientos de desarrollo móvil (opcional)"],
    whatYouLearn: [
      "Crear apps móviles nativas con React Native",
      "Implementar navegación compleja",
      "Manejar estado global con Redux",
      "Integrar APIs nativas del dispositivo",
      "Optimizar performance de aplicaciones móviles",
      "Publicar apps en App Store y Google Play",
    ],
  },
  {
    id: 3,
    title: "PostgreSQL: Base de Datos Avanzada",
    description:
      "Conviértete en experto en PostgreSQL, desde consultas básicas hasta optimización y administración avanzada.",
    longDescription:
      "Domina PostgreSQL, una de las bases de datos más potentes y populares del mundo. Este curso cubre desde conceptos básicos hasta técnicas avanzadas de optimización, administración y arquitectura de bases de datos empresariales.",
    instructor: "Ana Martínez",
    instructorBio:
      "Database Administrator con 10+ años de experiencia. Especialista en PostgreSQL y arquitectura de datos empresariales.",
    rating: 4.7,
    students: 650,
    duration: "8 semanas",
    price: 199,
    image: "/database-server-technology.png",
    category: "Base de Datos",
    level: "Intermedio",
    skills: ["PostgreSQL", "SQL Avanzado", "Optimización", "Backup", "Replicación", "Monitoring"],
    modules: [
      { title: "Fundamentos de PostgreSQL", duration: "1.5 semanas", lessons: 8 },
      { title: "SQL Avanzado y Funciones", duration: "2 semanas", lessons: 12 },
      { title: "Índices y Optimización", duration: "2 semanas", lessons: 10 },
      { title: "Administración y Seguridad", duration: "1.5 semanas", lessons: 9 },
      { title: "Backup y Recuperación", duration: "1 semana", lessons: 6 },
    ],
    requirements: [
      "Conocimientos básicos de SQL",
      "Experiencia con bases de datos relacionales",
      "Conceptos básicos de sistemas",
    ],
    whatYouLearn: [
      "Dominar consultas SQL complejas",
      "Optimizar performance de bases de datos",
      "Implementar estrategias de backup y recuperación",
      "Configurar replicación y alta disponibilidad",
      "Administrar usuarios y permisos",
      "Monitorear y mantener bases de datos en producción",
    ],
  },
]

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { isEnrolled, getEnrollment } = useEnrollment()
  const { toast } = useToast()
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)

  const courseId = Number.parseInt(params.id as string)
  const course = allCourses.find((c) => c.id === courseId)
  const enrollment = getEnrollment(courseId)
  const userIsEnrolled = isEnrolled(courseId)

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
          <Button onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      </div>
    )
  }

  const handleEnrollClick = () => {
    if (!user) {
      toast({
        title: "Inicia sesión requerida",
        description: "Debes iniciar sesión para inscribirte a un curso.",
        variant: "destructive",
      })
      return
    }
    setShowEnrollmentModal(true)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Desarrollo Web":
        return <Globe className="w-5 h-5" />
      case "Desarrollo Móvil":
        return <Smartphone className="w-5 h-5" />
      case "Base de Datos":
        return <Database className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a cursos
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {getCategoryIcon(course.category)}
                <Badge variant="secondary">{course.category}</Badge>
                <Badge className="bg-accent text-accent-foreground">{course.level}</Badge>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                  <span>({course.students.toLocaleString()} estudiantes)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} inscritos</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-64 object-cover" />
              {userIsEnrolled && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                    <Play className="w-5 h-5 mr-2" />
                    Continuar curso
                  </Button>
                </div>
              )}
            </div>

            {/* Progress (if enrolled) */}
            {userIsEnrolled && enrollment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Tu progreso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso del curso</span>
                      <span>{enrollment.progress}% completado</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {enrollment.progress >= 100
                        ? "¡Felicitaciones! Has completado el curso."
                        : "Continúa aprendiendo para completar el curso."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción del curso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{course.longDescription}</p>
              </CardContent>
            </Card>

            {/* What you'll learn */}
            <Card>
              <CardHeader>
                <CardTitle>Lo que aprenderás</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Contenido del curso</CardTitle>
                <CardDescription>
                  {course.modules.length} módulos • {course.modules.reduce((acc, m) => acc + m.lessons, 0)} lecciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{module.title}</h4>
                        <Badge variant="outline">{module.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{module.lessons} lecciones</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <div className="text-3xl font-bold text-primary">${course.price}</div>
                {userIsEnrolled ? (
                  <Badge className="bg-green-100 text-green-800 w-fit">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Inscrito
                  </Badge>
                ) : (
                  <CardDescription>Precio único, acceso de por vida</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {userIsEnrolled ? (
                  <Button className="w-full" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Continuar curso
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleEnrollClick}>
                    Inscribirse ahora
                  </Button>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Duración: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>Certificado de finalización</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>Acceso de por vida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Comunidad de estudiantes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">{course.instructor}</h4>
                  <p className="text-sm text-muted-foreground">{course.instructorBio}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades que desarrollarás</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EnrollmentModal isOpen={showEnrollmentModal} onClose={() => setShowEnrollmentModal(false)} course={course} />
    </div>
  )
}
