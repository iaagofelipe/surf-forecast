"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, Waves, Wind, Target } from "lucide-react"
import { isValidEmail, getWindDirections } from "@/lib/email-alerts"

interface AlertFormProps {
  spotSlug: string
  spotName: string
  onSubmit?: (alertData: any) => void
}

export function AlertForm({ spotSlug, spotName, onSubmit }: AlertFormProps) {
  const [email, setEmail] = useState("")
  const [minWaveHeight, setMinWaveHeight] = useState([1.0])
  const [maxWaveHeight, setMaxWaveHeight] = useState([3.0])
  const [maxWindSpeed, setMaxWindSpeed] = useState([20])
  const [minScore, setMinScore] = useState([70])
  const [selectedWindDirections, setSelectedWindDirections] = useState<string[]>(["NE", "E"])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const windDirections = getWindDirections()

  const handleWindDirectionToggle = (direction: string) => {
    setSelectedWindDirections((prev) =>
      prev.includes(direction) ? prev.filter((d) => d !== direction) : [...prev, direction],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setMessage("Por favor, insira um email válido.")
      return
    }

    if (selectedWindDirections.length === 0) {
      setMessage("Selecione pelo menos uma direção de vento.")
      return
    }

    setIsSubmitting(true)
    setMessage("")

    try {
      const alertData = {
        email,
        spotSlug,
        minWaveHeight: minWaveHeight[0],
        maxWaveHeight: maxWaveHeight[0],
        maxWindSpeed: maxWindSpeed[0],
        preferredWindDirections: selectedWindDirections,
        minScore: minScore[0],
      }

      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alertData),
      })

      if (response.ok) {
        setMessage("Alerta criado com sucesso! Você receberá emails quando as condições forem ideais.")
        onSubmit?.(alertData)
      } else {
        const error = await response.json()
        setMessage(error.message || "Erro ao criar alerta.")
      }
    } catch (error) {
      setMessage("Erro ao criar alerta. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Criar Alerta para {spotName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Wave Height Range */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Altura das Ondas
            </Label>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Mínima: {minWaveHeight[0]}m</Label>
                <Slider
                  value={minWaveHeight}
                  onValueChange={setMinWaveHeight}
                  max={5}
                  min={0.5}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Máxima: {maxWaveHeight[0]}m</Label>
                <Slider
                  value={maxWaveHeight}
                  onValueChange={setMaxWaveHeight}
                  max={5}
                  min={0.5}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              Vento Máximo: {maxWindSpeed[0]}kt
            </Label>
            <Slider value={maxWindSpeed} onValueChange={setMaxWindSpeed} max={30} min={5} step={1} className="mt-2" />
          </div>

          {/* Wind Directions */}
          <div className="space-y-3">
            <Label>Direções de Vento Preferidas</Label>
            <div className="grid grid-cols-4 gap-2">
              {windDirections.map((direction) => (
                <div key={direction} className="flex items-center space-x-2">
                  <Checkbox
                    id={direction}
                    checked={selectedWindDirections.includes(direction)}
                    onCheckedChange={() => handleWindDirectionToggle(direction)}
                  />
                  <Label htmlFor={direction} className="text-sm">
                    {direction}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedWindDirections.map((direction) => (
                <Badge key={direction} variant="secondary">
                  {direction}
                </Badge>
              ))}
            </div>
          </div>

          {/* Minimum Score */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Score Mínimo: {minScore[0]}/100
            </Label>
            <Slider value={minScore} onValueChange={setMinScore} max={100} min={30} step={5} className="mt-2" />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Criando Alerta..." : "Criar Alerta"}
          </Button>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes("sucesso") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
