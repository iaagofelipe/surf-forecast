import { NextResponse } from "next/server"

// Mock data generator for charts
function generateMockWaveData() {
  const now = new Date()
  const data = []

  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000)
    data.push({
      time: time.toISOString(),
      waveHeight: 0.8 + Math.random() * 2.5 + Math.sin(i / 6) * 0.5,
      period: 8 + Math.random() * 6,
      windSpeed: 5 + Math.random() * 15,
      windDirection: Math.floor(Math.random() * 360),
      tideHeight: 1.5 + Math.sin(i / 6.2) * 1.2,
    })
  }

  return data
}

function generateMockTideData() {
  const now = new Date()
  const data = []

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000)
    data.push({
      time: time.toISOString(),
      height: 1.5 + Math.sin((i / 24) * Math.PI * 4) * 1.2,
      type: i % 6 === 0 ? "high" : i % 6 === 3 ? "low" : "normal",
    })
  }

  return data
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const spot = searchParams.get("spot")

  try {
    // TODO: Replace with real API integration when available
    // This is mock data that can be easily replaced with real API calls

    if (type === "wave") {
      const waveData = generateMockWaveData()
      return NextResponse.json({
        success: true,
        data: waveData,
        spot: spot || "default",
        source: "mock", // Flag to indicate this is mock data
      })
    }

    if (type === "tide") {
      const tideData = generateMockTideData()
      return NextResponse.json({
        success: true,
        data: tideData,
        spot: spot || "default",
        source: "mock", // Flag to indicate this is mock data
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid chart type. Use "wave" or "tide"',
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Chart API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate chart data",
      },
      { status: 500 },
    )
  }
}
