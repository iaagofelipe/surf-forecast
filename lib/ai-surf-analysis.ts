import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface SurfAnalysis {
  recommendation: string
  score: number
  bestTime: string
  tips: string[]
  warnings: string[]
  skillLevel: "iniciante" | "intermediario" | "avancado"
  equipment: string[]
}

export interface SurfConditions {
  waveHeight: number
  wavePeriod: number
  waveDirection: number
  windSpeed: number
  windDirection: string
  tideHeight: number
  waterTemp: number
  airTemp: number
  spotName: string
  spotType: string
  idealWindDirection: string
  idealWaveDirection: string
}

// AI-powered surf analysis using OpenAI
export async function generateAISurfAnalysis(conditions: SurfConditions, forecast?: any[]): Promise<SurfAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn("OpenAI API key not found, using heuristic analysis")
    return generateHeuristicAnalysis(conditions, forecast)
  }

  try {
    const prompt = `
Você é um instrutor de surf experiente do Ceará, Brasil. Analise as condições atuais e forneça uma análise detalhada:

CONDIÇÕES ATUAIS:
- Pico: ${conditions.spotName}
- Altura das ondas: ${conditions.waveHeight}m
- Período das ondas: ${conditions.wavePeriod}s
- Direção das ondas: ${conditions.waveDirection}°
- Velocidade do vento: ${conditions.windSpeed}kt
- Direção do vento: ${conditions.windDirection}
- Altura da maré: ${conditions.tideHeight}m
- Temperatura da água: ${conditions.waterTemp}°C
- Temperatura do ar: ${conditions.airTemp}°C

CARACTERÍSTICAS DO PICO:
- Tipo: ${conditions.spotType}
- Direção ideal do vento: ${conditions.idealWindDirection}
- Direção ideal das ondas: ${conditions.idealWaveDirection}

Forneça uma análise em formato JSON com:
{
  "recommendation": "Recomendação principal (máximo 100 caracteres)",
  "score": número de 0-100,
  "bestTime": "Melhor horário para surfar hoje",
  "tips": ["dica1", "dica2", "dica3"] (máximo 3 dicas práticas),
  "warnings": ["aviso1", "aviso2"] (se houver riscos),
  "skillLevel": "iniciante|intermediario|avancado",
  "equipment": ["equipamento1", "equipamento2"] (recomendações de equipamento)
}

Seja específico para as condições do Ceará e use linguagem brasileira informal.
`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.3,
    })

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid AI response format")
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Validate the response structure
    if (!analysis.recommendation || typeof analysis.score !== "number") {
      throw new Error("Invalid analysis structure")
    }

    return {
      recommendation: analysis.recommendation,
      score: Math.max(0, Math.min(100, analysis.score)),
      bestTime: analysis.bestTime || "Manhã cedo",
      tips: Array.isArray(analysis.tips) ? analysis.tips.slice(0, 3) : [],
      warnings: Array.isArray(analysis.warnings) ? analysis.warnings.slice(0, 2) : [],
      skillLevel: ["iniciante", "intermediario", "avancado"].includes(analysis.skillLevel)
        ? analysis.skillLevel
        : "intermediario",
      equipment: Array.isArray(analysis.equipment) ? analysis.equipment.slice(0, 3) : [],
    }
  } catch (error) {
    console.error("AI analysis error:", error)
    return generateHeuristicAnalysis(conditions, forecast)
  }
}

// Fallback heuristic analysis when AI is not available
export function generateHeuristicAnalysis(conditions: SurfConditions, forecast?: any[]): SurfAnalysis {
  let score = 0
  const tips: string[] = []
  const warnings: string[] = []
  const equipment: string[] = []

  // Wave height analysis (0-40 points)
  const waveHeight = conditions.waveHeight
  if (waveHeight >= 0.8 && waveHeight <= 2.0) {
    score += 35
    tips.push("Altura das ondas está ideal para a maioria dos surfistas")
  } else if (waveHeight > 2.0 && waveHeight <= 3.0) {
    score += 25
    warnings.push("Ondas grandes - cuidado com a força da água")
    equipment.push("Prancha maior para mais estabilidade")
  } else if (waveHeight < 0.8) {
    score += 15
    tips.push("Ondas pequenas - ideal para longboard ou SUP")
    equipment.push("Longboard ou prancha de espuma")
  } else {
    score += 10
    warnings.push("Ondas muito grandes - apenas para surfistas experientes")
  }

  // Wind analysis (0-30 points)
  const windSpeed = conditions.windSpeed
  const isOffshore = conditions.windDirection.includes("E") || conditions.windDirection.includes("NE")

  if (windSpeed <= 10 && isOffshore) {
    score += 30
    tips.push("Vento offshore leve - condições perfeitas!")
  } else if (windSpeed <= 15 && isOffshore) {
    score += 25
    tips.push("Vento offshore moderado - boas condições")
  } else if (windSpeed > 20) {
    score += 5
    warnings.push("Vento forte - mar agitado e ondas desorganizadas")
  } else {
    score += 15
  }

  // Wave period analysis (0-20 points)
  const period = conditions.wavePeriod
  if (period >= 10) {
    score += 20
    tips.push("Período longo - ondas mais organizadas e potentes")
  } else if (period >= 7) {
    score += 15
  } else {
    score += 8
    tips.push("Período curto - ondas mais fechadas")
  }

  // Tide analysis (0-10 points)
  const tideHeight = conditions.tideHeight
  if (tideHeight <= 1.2) {
    score += 10
    tips.push("Maré baixa - melhor para a maioria dos picos")
  } else if (tideHeight <= 1.8) {
    score += 7
  } else {
    score += 3
    warnings.push("Maré alta - alguns picos podem não funcionar bem")
  }

  // Determine skill level and equipment
  let skillLevel: "iniciante" | "intermediario" | "avancado" = "intermediario"

  if (waveHeight <= 1.2 && windSpeed <= 15) {
    skillLevel = "iniciante"
    equipment.push("Prancha de espuma", "Leash de segurança")
  } else if (waveHeight > 2.5 || windSpeed > 20) {
    skillLevel = "avancado"
    equipment.push("Prancha performance", "Leash resistente")
  } else {
    equipment.push("Prancha intermediária", "Leash padrão")
  }

  // Add wetsuit recommendation based on water temperature
  if (conditions.waterTemp < 24) {
    equipment.push("Wetsuit 2mm")
  } else if (conditions.waterTemp < 26) {
    equipment.push("Lycra ou wetsuit fino")
  }

  // Determine best time based on forecast
  let bestTime = "Manhã cedo (6h-9h)"
  if (forecast && forecast.length > 0) {
    // Find the time with best conditions in the next 12 hours
    const next12Hours = forecast.slice(0, 12)
    const bestHour = next12Hours.reduce((best, current, index) => {
      const currentScore = calculateHourScore(current)
      const bestScore = calculateHourScore(next12Hours[best])
      return currentScore > bestScore ? index : best
    }, 0)

    const bestHourTime = new Date(next12Hours[bestHour].time)
    bestTime = `${bestHourTime.getHours()}h-${bestHourTime.getHours() + 2}h`
  }

  // Generate recommendation based on score
  let recommendation = ""
  if (score >= 80) {
    recommendation = "Condições excelentes! Hora de pegar umas ondas!"
  } else if (score >= 60) {
    recommendation = "Boas condições para surfar. Vale a pena!"
  } else if (score >= 40) {
    recommendation = "Condições regulares. Dá para se divertir."
  } else {
    recommendation = "Condições ruins. Melhor esperar."
  }

  return {
    recommendation,
    score: Math.max(0, Math.min(100, score)),
    bestTime,
    tips: tips.slice(0, 3),
    warnings: warnings.slice(0, 2),
    skillLevel,
    equipment: equipment.slice(0, 3),
  }
}

// Helper function to calculate score for a specific hour
function calculateHourScore(hourData: any): number {
  let score = 0

  // Wave height
  if (hourData.waveHeight >= 0.8 && hourData.waveHeight <= 2.0) score += 40
  else if (hourData.waveHeight > 2.0 && hourData.waveHeight <= 3.0) score += 25
  else score += 10

  // Wind speed
  if (hourData.windSpeed <= 10) score += 30
  else if (hourData.windSpeed <= 15) score += 20
  else score += 5

  // Wave period
  if (hourData.wavePeriod >= 10) score += 20
  else if (hourData.wavePeriod >= 7) score += 15
  else score += 8

  return score
}

// Get spot characteristics for analysis
export function getSpotCharacteristics(spotSlug: string) {
  const spotInfo: Record<string, any> = {
    taiba: {
      type: "Beach break de areia",
      idealWindDirection: "NE/E",
      idealWaveDirection: "NE",
    },
    paracuru: {
      type: "Point break com pedras",
      idealWindDirection: "E/NE",
      idealWaveDirection: "E",
    },
    icarai: {
      type: "Beach break ventoso",
      idealWindDirection: "NE",
      idealWaveDirection: "NE",
    },
    "canoa-quebrada": {
      type: "Beach break com falésias",
      idealWindDirection: "E/SE",
      idealWaveDirection: "E",
    },
    jericoacoara: {
      type: "Beach break de areia",
      idealWindDirection: "E/NE",
      idealWaveDirection: "NE",
    },
    cumbuco: {
      type: "Beach break próximo à cidade",
      idealWindDirection: "E/NE",
      idealWaveDirection: "NE",
    },
    pecem: {
      type: "Beach break com estrutura portuária",
      idealWindDirection: "NE",
      idealWaveDirection: "NE",
    },
    lagoinha: {
      type: "Beach break selvagem",
      idealWindDirection: "E/NE",
      idealWaveDirection: "E",
    },
  }

  return (
    spotInfo[spotSlug] || {
      type: "Beach break",
      idealWindDirection: "NE",
      idealWaveDirection: "NE",
    }
  )
}
