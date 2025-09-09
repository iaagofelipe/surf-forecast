"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, Waves, Wind, Target, Trash2, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AlertForm } from "@/components/alert-form"

interface Alert {
  id: string
  email: string
  spotSlug: string
  spotName: string
  minWaveHeight: number
  maxWaveHeight: number
  maxWindSpeed: number
  preferredWindDirections: string[]
  minScore: number
  active: boolean
  createdAt: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState({ slug: "taiba", name: "Taíba" })
  const [loading, setLoading] = useState(true)

  // Mock alerts data
  useEffect(() => {
    // Simulate loading alerts from API
    setTimeout(() => {
      setAlerts([
        {
          id: "1",
          email: "surfer@example.com",
          spotSlug: "taiba",
          spotName: "Taíba",
          minWaveHeight: 1.0,
          maxWaveHeight: 3.0,
          maxWindSpeed: 20,
          preferredWindDirections: ["NE", "E"],
          minScore: 70,
          active: true,
          createdAt: "2024-01-15",
        },
        {
          id: "2",
          email: "surfer@example.com",
          spotSlug: "paracuru",
          spotName: "Paracuru",
          minWaveHeight: 0.8,
          maxWaveHeight: 2.5,
          maxWindSpeed: 15,
          preferredWindDirections: ["E", "ENE"],
          minScore: 65,
          active: true,
          createdAt: "2024-01-10",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleDeleteAlert = async (alertId: string) => {
    // Mock delete
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const handleCreateAlert = (alertData: any) => {
    // Mock create
    const newAlert: Alert = {
      id: Date.now().toString(),
      ...alertData,
      spotName: selectedSpot.name,
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setAlerts((prev) => [...prev, newAlert])
    setShowCreateForm(false)
  }

  const spots = [
    { slug: "taiba", name: "Taíba" },
    { slug: "paracuru", name: "Paracuru" },
    { slug: "icarai", name: "Icaraí de Amontada" },
    { slug: "canoa-quebrada", name: "Canoa Quebrada" },
    { slug: "jericoacoara", name: "Jericoacoara" },
    { slug: "cumbuco", name: "Cumbuco" },
    { slug: "pecem", name: "Pecém" },
    { slug: "lagoinha", name: "Lagoinha" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Bell className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
          <p>Carregando alertas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Alertas de Surf</h1>
              <p className="text-sm text-muted-foreground">Gerencie suas notificações por email</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Create Alert Button */}
        {!showCreateForm && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Bell className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <h3 className="font-semibold">Receba Alertas de Condições Ideais</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure alertas personalizados e seja notificado quando as condições estiverem perfeitas para
                    surfar.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <select
                    value={selectedSpot.slug}
                    onChange={(e) => {
                      const spot = spots.find((s) => s.slug === e.target.value)
                      if (spot) setSelectedSpot(spot)
                    }}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {spots.map((spot) => (
                      <option key={spot.slug} value={spot.slug}>
                        {spot.name}
                      </option>
                    ))}
                  </select>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Alerta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Alert Form */}
        {showCreateForm && (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <AlertForm spotSlug={selectedSpot.slug} spotName={selectedSpot.name} onSubmit={handleCreateAlert} />
          </div>
        )}

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Seus Alertas Ativos</h2>
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{alert.spotName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.active ? "default" : "secondary"}>
                        {alert.active ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Waves className="h-4 w-4 text-primary" />
                      <span>
                        {alert.minWaveHeight}m - {alert.maxWaveHeight}m
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-primary" />
                      <span>Max {alert.maxWindSpeed}kt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Score ≥{alert.minScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="truncate">{alert.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-muted-foreground">Ventos:</span>
                    {alert.preferredWindDirections.map((direction) => (
                      <Badge key={direction} variant="outline" className="text-xs">
                        {direction}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">Criado em {alert.createdAt}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Como Funcionam os Alertas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Os alertas são verificados a cada 3 horas durante o dia</p>
            <p>• Você receberá no máximo 1 email por pico por dia</p>
            <p>• O score é calculado com base nas condições ideais para cada pico</p>
            <p>• Você pode pausar ou excluir alertas a qualquer momento</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
