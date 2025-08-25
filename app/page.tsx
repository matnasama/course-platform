"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, BookOpen, Play, ChevronRight } from "lucide-react"
import { AuthModal } from "@/components/auth/auth-modal"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/lib/auth-context"
import { useEnrollment } from "@/lib/enrollment-context"
import { useRouter } from "next/navigation"

// Mock data for courses
const featuredCourses = [
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

const categories = [
  { name: "Desarrollo Web", count: 45, icon: "🌐" },
  { name: "Desarrollo Móvil", count: 28, icon: "📱" },
  { name: "Base de Datos", count: 22, icon: "🗄️" },
  { name: "DevOps", count: 18, icon: "⚙️" },
  { name: "UI/UX Design", count: 35, icon: "🎨" },
  { name: "Data Science", count: 31, icon: "📊" },
]

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const { user } = useAuth()
  const { isEnrolled } = useEnrollment()
  const router = useRouter()

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  const handleCourseClick = (courseId: number) => {
    router.push(`/course/${courseId}`)
  }

  const handleEnrollClick = (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation()
    if (!user) {
      openAuthModal("login")
      return
    }
    router.push(`/course/${courseId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ResidenciaTS</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#cursos" className="text-muted-foreground hover:text-foreground transition-colors">
                Cursos
              </a>
              <a href="#categorias" className="text-muted-foreground hover:text-foreground transition-colors">
                Categorías
              </a>
              <a href="#instructores" className="text-muted-foreground hover:text-foreground transition-colors">
                Instructores
              </a>
              <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">
                Contacto
              </a>
            </nav>
            <div className="flex items-center gap-3">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" onClick={() => openAuthModal("login")}>
                    Iniciar Sesión
                  </Button>
                  <Button onClick={() => openAuthModal("register")}>Registrarse</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Prepara tu examen de la residencia con esta
              <span className="text-primary"> capacitación</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Aprende las tecnologías más demandadas del mercado con instructores expertos. Más de 10,000 estudiantes ya
              han transformado sus carreras con nosotros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Explorar Curso
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <Play className="w-5 h-5 mr-2" />
                Plan de estudios
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Estudiantes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Cursos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Instructores</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="cursos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Cursos Destacados</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestros cursos más populares, diseñados por expertos de la industria
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card
                key={course.id}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">{course.category}</Badge>
                  {user && isEnrolled(course.id) && (
                    <Badge className="absolute top-3 right-3 bg-green-100 text-green-800">Inscrito</Badge>
                  )}
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
                  <CardDescription className="text-muted-foreground">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                       {course.students.toLocaleString('en-US')}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Instructor: <span className="font-medium text-foreground">{course.instructor}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">${course.price}</div>
                  <Button
                    className="group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                    onClick={(e) => handleEnrollClick(e, course.id)}
                  >
                    {user && isEnrolled(course.id) ? "Continuar" : "Inscribirse"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categorias" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Explora por Categorías</h2>
            <p className="text-xl text-muted-foreground">Encuentra el área perfecta para desarrollar tus habilidades</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="text-center hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.count} cursos</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para comenzar tu transformación?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya han dado el siguiente paso en sus carreras
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Ver Todos los Cursos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Hablar con un Asesor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">EduPlatform</span>
              </div>
              <p className="text-muted-foreground">
                Transformando carreras a través de la educación tecnológica de calidad.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Cursos</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Desarrollo Web
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Desarrollo Móvil
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Base de Datos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    DevOps
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Instructores
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Términos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 EduPlatform. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode={authMode} />
    </div>
  )
}
