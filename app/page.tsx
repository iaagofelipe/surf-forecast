"use client"

import { Waves, MapPin, Clock, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpotSearch } from "@/components/spot-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAllSpots } from "@/hooks/use-spot-data"
import Link from "next/link"

export default function HomePage() {
  const { spots, loading, error } = useAllSpots()

  return (
    <div className="min-h-screen bg-background pb-20">
      {" "}
      {/* Added pb-20 to prevent footer overlap */}
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">HaoliRadar</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Spot Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Buscar Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpotSearch />
          </CardContent>
        </Card>

        {/* Featured Spots */}
        {loading ? (
          <div className="text-center py-8">
            <Waves className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
            <p>Carregando picos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Erro ao carregar picos: {error}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {spots.slice(0, 6).map((spot) => (
              <Card key={spot.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{spot.name}</CardTitle>
                  <p className="text-sm text-foreground/80">{spot.location}</p>{" "}
                  {/* Improved contrast from muted-foreground to foreground/80 */}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Waves className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {spot.current?.waveHeight ? `${spot.current.waveHeight.toFixed(1)}m` : "N/A"}
                      </span>
                    </div>
                    {spot.condition && (
                      <span className={`text-sm px-2 py-1 rounded ${spot.condition.color}`}>
                        {spot.condition.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-foreground/80">
                    {" "}
                    {/* Improved contrast */}
                    <div className="flex items-center gap-1">
                      <Wind className="h-3 w-3" />
                      <span>
                        {spot.current?.windSpeed
                          ? `${spot.current.windSpeed.toFixed(0)} kt ${spot.current.windDirection}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Maré: {spot.current?.tideHeight ? `${spot.current.tideHeight.toFixed(1)}m` : "N/A"}</span>
                    </div>
                  </div>
                  <Link href={`/spot/${spot.slug}`}>
                    <Button className="w-full bg-transparent" variant="outline">
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Condições Gerais - Ceará</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">27°C</p>
                <p className="text-sm text-foreground/80">Água</p> {/* Improved contrast */}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">30°C</p>
                <p className="text-sm text-foreground/80">Ar</p> {/* Improved contrast */}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">NE</p>
                <p className="text-sm text-foreground/80">Vento Dom.</p> {/* Improved contrast */}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {spots.length > 0 && spots[0].current?.waveHeight
                    ? `${spots[0].current.waveHeight.toFixed(1)}m`
                    : "1.5m"}
                </p>
                <p className="text-sm text-foreground/80">Ondulação Méd.</p> {/* Improved contrast */}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Button variant="ghost" size="sm" className="flex flex-col gap-1">
              <Waves className="h-4 w-4" />
              <span className="text-xs">Picos</span>
            </Button>
            <Link href="/alerts">
              <Button variant="ghost" size="sm" className="flex flex-col gap-1">
                <Wind className="h-4 w-4" />
                <span className="text-xs">Alertas</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
