import { NextResponse } from "next/server"
import { getCurrentConditions, SPOT_COORDINATES } from "@/lib/weather-api"

// Spot information database
const SPOTS_INFO = {
  taiba: {
    name: "Taíba",
    location: "São Gonçalo do Amarante, CE",
    slug: "taiba",
    description: "Praia de areia branca com ondas consistentes. Ideal para iniciantes e intermediários.",
    idealConditions: "Vento NE 10-20kt, maré baixa a média",
    difficulty: "Iniciante/Intermediário",
  },
  paracuru: {
    name: "Paracuru",
    location: "Paracuru, CE",
    slug: "paracuru",
    description: "Pico clássico do Ceará, conhecido por suas ondas tubulares.",
    idealConditions: "Vento E/NE 8-15kt, maré baixa",
    difficulty: "Intermediário",
  },
  icarai: {
    name: "Icaraí de Amontada",
    location: "Amontada, CE",
    slug: "icarai",
    description: "Um dos melhores picos do Ceará para kitesurf e windsurf.",
    idealConditions: "Vento NE 15-25kt, maré baixa a média",
    difficulty: "Intermediário/Avançado",
  },
  "canoa-quebrada": {
    name: "Canoa Quebrada",
    location: "Aracati, CE",
    slug: "canoa-quebrada",
    description: "Famosa praia com falésias coloridas e boas condições de vento.",
    idealConditions: "Vento E/SE 12-20kt, maré baixa a média",
    difficulty: "Intermediário",
  },
  jericoacoara: {
    name: "Jericoacoara",
    location: "Jijoca de Jericoacoara, CE",
    slug: "jericoacoara",
    description: "Destino mundial para kitesurf com ventos constantes.",
    idealConditions: "Vento E/NE 15-25kt, maré baixa a média",
    difficulty: "Intermediário/Avançado",
  },
  cumbuco: {
    name: "Cumbuco",
    location: "Caucaia, CE",
    slug: "cumbuco",
    description: "Próximo a Fortaleza, ótimo para kitesurf e windsurf.",
    idealConditions: "Vento E/NE 12-22kt, maré baixa a média",
    difficulty: "Iniciante/Intermediário",
  },
  pecem: {
    name: "Pecém",
    location: "São Gonçalo do Amarante, CE",
    slug: "pecem",
    description: "Porto com ondas consistentes e boa infraestrutura.",
    idealConditions: "Vento NE 10-18kt, maré baixa a média",
    difficulty: "Intermediário",
  },
  lagoinha: {
    name: "Lagoinha",
    location: "Paraipaba, CE",
    slug: "lagoinha",
    description: "Praia selvagem com coqueiros e ondas para todos os níveis.",
    idealConditions: "Vento E/NE 8-16kt, maré baixa a média",
    difficulty: "Iniciante/Intermediário",
  },
}

export async function GET() {
  try {
    // Fetch current conditions for all spots
    const spotsWithConditions = await Promise.all(
      Object.entries(SPOTS_INFO).map(async ([slug, info]) => {
        const coordinates = SPOT_COORDINATES[slug as keyof typeof SPOT_COORDINATES]

        if (!coordinates) {
          return { ...info, current: null, condition: null }
        }

        try {
          const current = await getCurrentConditions(coordinates.lat, coordinates.lng)

          // Calculate condition rating
          let score = 0
          const waveHeight = current.waveHeight
          const windSpeed = current.windSpeed

          if (waveHeight >= 1.0 && waveHeight <= 2.5) score += 40
          if (windSpeed <= 15) score += 30
          if (current.wavePeriod >= 8) score += 20
          if (current.tideHeight <= 1.5) score += 10

          let condition
          if (score >= 80) {
            condition = { rating: "Excelente", color: "bg-green-500/20 text-green-400" }
          } else if (score >= 60) {
            condition = { rating: "Bom", color: "bg-primary/20 text-primary" }
          } else if (score >= 40) {
            condition = { rating: "Regular", color: "bg-accent/20 text-accent" }
          } else {
            condition = { rating: "Ruim", color: "bg-red-500/20 text-red-400" }
          }

          return { ...info, current, condition }
        } catch (error) {
          console.error(`Error fetching data for ${slug}:`, error)
          return { ...info, current: null, condition: null }
        }
      }),
    )

    return NextResponse.json(spotsWithConditions)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch spots data" }, { status: 500 })
  }
}
