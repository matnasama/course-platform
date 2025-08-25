"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Loader2, CheckCircle, Star, Clock, Shield, Smartphone } from "lucide-react"
import { useEnrollment } from "@/lib/enrollment-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  course: any
}

export function EnrollmentModal({ isOpen, onClose, course }: EnrollmentModalProps) {
  const [step, setStep] = useState<"details" | "payment" | "processing" | "success">("details")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const { enrollInCourse } = useEnrollment()
  const { toast } = useToast()
  const router = useRouter()

  const handleEnrollment = async () => {
    setIsProcessing(true)
    setStep("processing")

    try {
      const success = await enrollInCourse(course.id, paymentMethod)

      if (success) {
        setStep("success")
        toast({
          title: "¡Inscripción exitosa!",
          description: `Te has inscrito correctamente al curso "${course.title}".`,
        })
      } else {
        throw new Error("Error en la inscripción")
      }
    } catch (error) {
      toast({
        title: "Error en la inscripción",
        description: "Hubo un problema procesando tu inscripción. Intenta nuevamente.",
        variant: "destructive",
      })
      setStep("payment")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep("details")
    setPaymentMethod("card")
    setPaymentData({ cardNumber: "", expiryDate: "", cvv: "", name: "" })
    onClose()
  }

  const handleSuccess = () => {
    handleClose()
    router.push(`/course/${course.id}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Inscribirse al curso</DialogTitle>
              <DialogDescription>Revisa los detalles del curso antes de proceder con el pago</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Course Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">por {course.instructor}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <Badge variant="secondary">{course.level}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${course.price}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's included */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lo que incluye</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Acceso de por vida al curso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Certificado de finalización</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Acceso en dispositivos móviles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Soporte del instructor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Comunidad de estudiantes</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button onClick={() => setStep("payment")}>Continuar al pago</Button>
              </div>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>Información de pago</DialogTitle>
              <DialogDescription>Completa tu información de pago para inscribirte al curso</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span>{course.title}</span>
                    <span>${course.price}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center mt-2 font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${course.price}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Método de pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Tarjeta de crédito/débito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Form */}
              {paymentMethod === "card" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información de la tarjeta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre en la tarjeta</Label>
                      <Input
                        id="name"
                        placeholder="Juan Pérez"
                        value={paymentData.name}
                        onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Fecha de vencimiento</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Tu información de pago está protegida con encriptación SSL de 256 bits.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep("details")}>
                  Volver
                </Button>
                <Button onClick={handleEnrollment} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Completar inscripción
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Procesando tu inscripción...</h3>
            <p className="text-muted-foreground">Por favor espera mientras procesamos tu pago.</p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">¡Inscripción exitosa!</h3>
            <p className="text-muted-foreground mb-6">
              Te has inscrito correctamente al curso "{course.title}". Ya puedes comenzar a aprender.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cerrar
              </Button>
              <Button onClick={handleSuccess}>Ir al curso</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
