import { type NextRequest, NextResponse } from "next/server"
import { isValidEmail } from "@/lib/email-alerts"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, spotSlug, minWaveHeight, maxWaveHeight, maxWindSpeed, preferredWindDirections, minScore } = body

    // Validate input
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    if (!spotSlug || !minWaveHeight || !maxWaveHeight || !maxWindSpeed || !minScore) {
      return NextResponse.json({ error: "Dados obrigatórios faltando" }, { status: 400 })
    }

    if (!Array.isArray(preferredWindDirections) || preferredWindDirections.length === 0) {
      return NextResponse.json({ error: "Selecione pelo menos uma direção de vento" }, { status: 400 })
    }

    // In a real implementation, this would:
    // 1. Insert into database
    // 2. Send confirmation email
    // 3. Return the created alert

    console.log("[ALERT API] Creating alert:", {
      email,
      spotSlug,
      minWaveHeight,
      maxWaveHeight,
      maxWindSpeed,
      preferredWindDirections,
      minScore,
    })

    // Mock successful response
    return NextResponse.json({
      id: Date.now().toString(),
      message: "Alerta criado com sucesso!",
      alert: {
        email,
        spotSlug,
        minWaveHeight,
        maxWaveHeight,
        maxWindSpeed,
        preferredWindDirections,
        minScore,
        active: true,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Alert API error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Email obrigatório e válido" }, { status: 400 })
    }

    // In a real implementation, this would query the database
    // for alerts belonging to the email address

    console.log("[ALERT API] Fetching alerts for:", email)

    // Mock response
    const mockAlerts = [
      {
        id: "1",
        email,
        spotSlug: "taiba",
        spotName: "Taíba",
        minWaveHeight: 1.0,
        maxWaveHeight: 3.0,
        maxWindSpeed: 20,
        preferredWindDirections: ["NE", "E"],
        minScore: 70,
        active: true,
        createdAt: "2024-01-15T10:00:00Z",
      },
    ]

    return NextResponse.json({ alerts: mockAlerts })
  } catch (error) {
    console.error("Alert API error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
