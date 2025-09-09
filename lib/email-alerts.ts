// Email alert system for HaoliRadar
import { getCurrentConditions, SPOT_COORDINATES } from "./weather-api"
import { generateHeuristicAnalysis, getSpotCharacteristics } from "./ai-surf-analysis"

export interface AlertPreferences {
  email: string
  spotSlug: string
  minWaveHeight: number
  maxWaveHeight: number
  maxWindSpeed: number
  preferredWindDirections: string[]
  minScore: number
  active: boolean
}

export interface AlertCondition {
  id: string
  email: string
  spotSlug: string
  spotName: string
  conditions: any
  score: number
  message: string
}

// Check if current conditions match alert preferences
export function checkAlertConditions(conditions: any, preferences: AlertPreferences): boolean {
  // Wave height check
  if (conditions.waveHeight < preferences.minWaveHeight || conditions.waveHeight > preferences.maxWaveHeight) {
    return false
  }

  // Wind speed check
  if (conditions.windSpeed > preferences.maxWindSpeed) {
    return false
  }

  // Wind direction check
  if (!preferences.preferredWindDirections.includes(conditions.windDirection)) {
    return false
  }

  // Calculate score using heuristic analysis
  const spotCharacteristics = getSpotCharacteristics(preferences.spotSlug)
  const analysis = generateHeuristicAnalysis({
    ...conditions,
    spotName: getSpotName(preferences.spotSlug),
    spotType: spotCharacteristics.type,
    idealWindDirection: spotCharacteristics.idealWindDirection,
    idealWaveDirection: spotCharacteristics.idealWaveDirection,
  })

  // Score check
  if (analysis.score < preferences.minScore) {
    return false
  }

  return true
}

// Generate alert message
export function generateAlertMessage(conditions: any, spotName: string, score: number): string {
  const waveHeight = conditions.waveHeight.toFixed(1)
  const windSpeed = conditions.windSpeed.toFixed(0)
  const windDirection = conditions.windDirection

  let message = `🏄‍♂️ Boas condições em ${spotName}!\n\n`
  message += `📊 Score: ${score}/100\n`
  message += `🌊 Ondas: ${waveHeight}m\n`
  message += `💨 Vento: ${windSpeed}kt ${windDirection}\n`
  message += `🌊 Maré: ${conditions.tideHeight.toFixed(1)}m\n`

  if (score >= 80) {
    message += `\n✨ Condições excelentes! Não perca essa sessão!`
  } else if (score >= 70) {
    message += `\n👍 Muito boas condições para surfar!`
  } else {
    message += `\n🤙 Condições boas para uma sessão!`
  }

  return message
}

// Send email alert (mock implementation - would use real email service)
export async function sendEmailAlert(alert: AlertCondition): Promise<boolean> {
  try {
    // In a real implementation, this would use a service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    console.log(`[EMAIL ALERT] Sending to ${alert.email}:`)
    console.log(`Subject: Boas condições em ${alert.spotName}!`)
    console.log(`Message: ${alert.message}`)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return true
  } catch (error) {
    console.error("Failed to send email alert:", error)
    return false
  }
}

// Check all active alerts and send notifications
export async function processAlerts(): Promise<void> {
  try {
    // In a real implementation, this would:
    // 1. Query database for active alerts
    // 2. Check conditions for each spot
    // 3. Send emails for matching conditions
    // 4. Update last_sent_at timestamps

    console.log("[ALERT PROCESSOR] Processing surf alerts...")

    // Mock implementation
    const mockAlerts: AlertPreferences[] = [
      {
        email: "surfer@example.com",
        spotSlug: "taiba",
        minWaveHeight: 1.0,
        maxWaveHeight: 3.0,
        maxWindSpeed: 20,
        preferredWindDirections: ["NE", "E"],
        minScore: 70,
        active: true,
      },
    ]

    for (const alert of mockAlerts) {
      const coordinates = SPOT_COORDINATES[alert.spotSlug as keyof typeof SPOT_COORDINATES]
      if (!coordinates) continue

      const conditions = await getCurrentConditions(coordinates.lat, coordinates.lng)

      if (checkAlertConditions(conditions, alert)) {
        const spotName = getSpotName(alert.spotSlug)
        const spotCharacteristics = getSpotCharacteristics(alert.spotSlug)
        const analysis = generateHeuristicAnalysis({
          ...conditions,
          spotName,
          spotType: spotCharacteristics.type,
          idealWindDirection: spotCharacteristics.idealWindDirection,
          idealWaveDirection: spotCharacteristics.idealWaveDirection,
        })

        const alertCondition: AlertCondition = {
          id: `${alert.email}-${alert.spotSlug}-${Date.now()}`,
          email: alert.email,
          spotSlug: alert.spotSlug,
          spotName,
          conditions,
          score: analysis.score,
          message: generateAlertMessage(conditions, spotName, analysis.score),
        }

        await sendEmailAlert(alertCondition)
      }
    }
  } catch (error) {
    console.error("Error processing alerts:", error)
  }
}

// Helper function to get spot name
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

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Get available wind directions
export function getWindDirections(): string[] {
  return ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
}
