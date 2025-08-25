"use client"

import { useState } from "react"

export function useTodoManager() {
  const [tasks] = useState([
    { status: "done", task: "Configurar Base de Datos" },
    { status: "done", task: "Crear Landing Page de Cursos" },
    { status: "done", task: "Implementar Sistema de Autenticación" },
    { status: "done", task: "Construir Panel de Administración" },
    { status: "done", task: "Agregar Sistema de Inscripciones" },
  ])

  return { tasks }
}
