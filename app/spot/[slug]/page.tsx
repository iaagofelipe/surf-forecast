"use client"

import { Waves, Clock, Wind, ArrowLeft, TrendingUp, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { WaveChart } from "@/components/wave-chart"
import { TideChart } from "@/components/tide-chart"
import { AIAnalysisCard } from "@/components/ai-analysis-card"
import { useEffect, useState } from "react"

export default function SpotPage({ params }: { params: { slug: string } }) {
  const [spotInfo, setSpotInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/spots/${params.slug}`)

        if (!response.ok) {
          throw new Error("Spot not found")
        }

        const data = await response.json()
        setSpotInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchSpotData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Waves className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
          <p>Carregando dados do pico...</p>
        </div>
      </div>
    )
  }

  if (error || !spotInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Erro: {error || "Pico não encontrado"}</p>
          <Link href="/">
            <Button className="mt-4">Voltar</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { current, condition, forecast, analysis } = spotInfo

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
              <h1 className="text-xl font-bold text-foreground">{spotInfo.name}</h1>
              <p className="text-sm text-muted-foreground">{spotInfo.location}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Current Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Condições Atuais</span>
              <Badge className={condition?.color}>{condition?.rating}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Waves className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-semibold">{current?.waveHeight?.toFixed(1)}m</p>
                <p className="text-xs text-muted-foreground">Altura</p>
              </div>
              <div className="text-center">
                <Wind className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-semibold">
                  {current?.windSpeed?.toFixed(0)} kt {current?.windDirection}
                </p>
                <p className="text-xs text-muted-foreground">Vento</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-semibold">{current?.tideHeight?.toFixed(1)}m</p>
                <p className="text-xs text-muted-foreground">Maré</p>
              </div>
              <div className="text-center">
                <Thermometer className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-semibold">{current?.waterTemp}°C</p>
                <p className="text-xs text-muted-foreground">Água</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Card */}
        {analysis && <AIAnalysisCard analysis={analysis} />}

        {/* Wave Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Previsão de Ondas (48h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WaveChart data={forecast?.waves} />
          </CardContent>
        </Card>

        {/* Tide Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tábua de Marés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TideChart data={forecast?.tides} />
          </CardContent>
        </Card>

        {/* Spot Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Pico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Descrição</h4>
              <p className="text-sm text-muted-foreground">{spotInfo.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Condições Ideais</h4>
              <p className="text-sm text-muted-foreground">{spotInfo.idealConditions}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Nível</h4>
              <Badge variant="outline">{spotInfo.difficulty}</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
