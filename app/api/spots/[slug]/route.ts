import { type NextRequest, NextResponse } from "next/server"
import { getCurrentConditions, fetchOpenMeteoData, fetchTideData, SPOT_COORDINATES } from "@/lib/weather-api"
import { generateAISurfAnalysis, getSpotCharacteristics } from "@/lib/ai-surf-analysis"

// Calculate surf condition based on wave height, wind, and other factors
function calculateSurfCondition(conditions: any): { rating: string; color: string; score: number } {
  let score = 0

  // Wave height scoring (0-40 points)
  const waveHeight = conditions.waveHeight
  if (waveHeight >= 1.0 && waveHeight <= 2.5) {
    score += 40 - Math.abs(waveHeight - 1.75) * 10
  } else if (waveHeight > 2.5) {
    score += Math.max(0, 30 - (waveHeight - 2.5) * 5)
  } else {
    score += waveHeight * 20
  }

  // Wind scoring (0-30 points)
  const windSpeed = conditions.windSpeed
  if (windSpeed <= 15) {
    score += 30 - windSpeed
  } else {
    score += Math.max(0, 15 - (windSpeed - 15) * 2)
  }

  // Wave period scoring (0-20 points)
  const period = conditions.wavePeriod
  if (period >= 8) {
    score += 20
  } else {
    score += period * 2.5
  }

  // Tide scoring (0-10 points)
  const tideHeight = conditions.tideHeight
  if (tideHeight <= 1.5) {
    score += 10
  } else {
    score += Math.max(0, 10 - (tideHeight - 1.5) * 5)
  }

  // Determine rating and color
  if (score >= 80) {
    return { rating: "Excelente", color: "bg-green-500/20 text-green-400", score }
  } else if (score >= 60) {
    return { rating: "Bom", color: "bg-primary/20 text-primary", score }
  } else if (score >= 40) {
    return { rating: "Regular", color: "bg-accent/20 text-accent", score }
  } else {
    return { rating: "Ruim", color: "bg-red-500/20 text-red-400", score }
  }
}

// Helper functions for spot information
function getSpotName(slug: string): string {
  const names: Record<string, string> = {
    taiba: "Taíba",
    paracuru: "Paracuru",
    icarai: "Icaraí de Amontada",
    "canoa-quebrada": "Canoa Quebrada",
    jericoacoara: "Jericoacoara",
    cumbuco: "Cumbuco",
    pecem: "Pecém",
    lagoinha: "Lagoinha",
  }
  return names[slug] || slug
}

function getSpotLocation(slug: string): string {
  const locations: Record<string, string> = {
    taiba: "São Gonçalo do Amarante, CE",
    paracuru: "Paracuru, CE",
    icarai: "Amontada, CE",
    "canoa-quebrada": "Aracati, CE",
    jericoacoara: "Jijoca de Jericoacoara, CE",
    cumbuco: "Caucaia, CE",
    pecem: "São Gonçalo do Amarante, CE",
    lagoinha: "Paraipaba, CE",
  }
  return locations[slug] || "Ceará, Brasil"
}

function getSpotDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    taiba: "Praia de areia branca com ondas consistentes. Ideal para iniciantes e intermediários.",
    paracuru: "Pico clássico do Ceará, conhecido por suas ondas tubulares.",
    icarai: "Um dos melhores picos do Ceará para kitesurf e windsurf.",
    "canoa-quebrada": "Famosa praia com falésias coloridas e boas condições de vento.",
    jericoacoara: "Destino mundial para kitesurf com ventos constantes.",
    cumbuco: "Próximo a Fortaleza, ótimo para kitesurf e windsurf.",
    pecem: "Porto com ondas consistentes e boa infraestrutura.",
    lagoinha: "Praia selvagem com coqueiros e ondas para todos os níveis.",
  }
  return descriptions[slug] || "Pico de surf no Ceará"
}

function getSpotIdealConditions(slug: string): string {
  const conditions: Record<string, string> = {
    taiba: "Vento NE 10-20kt, maré baixa a média",
    paracuru: "Vento E/NE 8-15kt, maré baixa",
    icarai: "Vento NE 15-25kt, maré baixa a média",
    "canoa-quebrada": "Vento E/SE 12-20kt, maré baixa a média",
    jericoacoara: "Vento E/NE 15-25kt, maré baixa a média",
    cumbuco: "Vento E/NE 12-22kt, maré baixa a média",
    pecem: "Vento NE 10-18kt, maré baixa a média",
    lagoinha: "Vento E/NE 8-16kt, maré baixa a média",
  }
  return conditions[slug] || "Vento offshore, maré baixa a média"
}

function getSpotDifficulty(slug: string): string {
  const difficulties: Record<string, string> = {
    taiba: "Iniciante/Intermediário",
    paracuru: "Intermediário",
    icarai: "Intermediário/Avançado",
    "canoa-quebrada": "Intermediário",
    jericoacoara: "Intermediário/Avançado",
    cumbuco: "Iniciante/Intermediário",
    pecem: "Intermediário",
    lagoinha: "Iniciante/Intermediário",
  }
  return difficulties[slug] || "Intermediário"
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Get coordinates for the spot
    const coordinates = SPOT_COORDINATES[slug as keyof typeof SPOT_COORDINATES]

    if (!coordinates) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 })
    }

    // Fetch current conditions and forecast data
    const [currentConditions, waveData, tideData] = await Promise.all([
      getCurrentConditions(coordinates.lat, coordinates.lng),
      fetchOpenMeteoData(coordinates.lat, coordinates.lng),
      fetchTideData(coordinates.lat, coordinates.lng),
    ])

    // Calculate surf condition rating
    const condition = calculateSurfCondition(currentConditions)

    const spotCharacteristics = getSpotCharacteristics(slug)
    const aiAnalysis = await generateAISurfAnalysis(
      {
        ...currentConditions,
        spotName: getSpotName(slug),
        spotType: spotCharacteristics.type,
        idealWindDirection: spotCharacteristics.idealWindDirection,
        idealWaveDirection: spotCharacteristics.idealWaveDirection,
      },
      waveData.slice(0, 24),
    )

    return NextResponse.json({
      name: getSpotName(slug),
      location: getSpotLocation(slug),
      slug,
      description: getSpotDescription(slug),
      idealConditions: getSpotIdealConditions(slug),
      difficulty: getSpotDifficulty(slug),
      current: currentConditions,
      condition,
      forecast: {
        waves: waveData.slice(0, 48), // 48 hours
        tides: tideData.slice(0, 48),
      },
      analysis: aiAnalysis, // Added AI analysis to response
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch spot data" }, { status: 500 })
  }
}
