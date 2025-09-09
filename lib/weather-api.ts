// Weather API integration layer for HaoliRadar
// Supports Open-Meteo (free), Stormglass (premium), and WorldTides

export interface WaveData {
  time: string
  waveHeight: number
  wavePeriod: number
  waveDirection: number
  windSpeed: number
  windDirection: number
}

export interface TideData {
  time: string
  height: number
  type?: "high" | "low"
}

export interface CurrentConditions {
  waveHeight: number
  wavePeriod: number
  waveDirection: number
  windSpeed: number
  windDirection: string
  waterTemp: number
  airTemp: number
  tideHeight: number
}

// Open-Meteo Marine API (Free)
export async function fetchOpenMeteoData(lat: number, lng: number): Promise<WaveData[]> {
  try {
    const response = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?` +
        `latitude=${lat}&longitude=${lng}` +
        `&hourly=wave_height,wave_direction,wave_period,wind_speed_10m,wind_direction_10m` +
        `&timezone=America/Fortaleza&forecast_days=3`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Open-Meteo data")
    }

    const data = await response.json()

    return data.hourly.time.map((time: string, index: number) => ({
      time,
      waveHeight: data.hourly.wave_height[index] || 0,
      wavePeriod: data.hourly.wave_period[index] || 0,
      waveDirection: data.hourly.wave_direction[index] || 0,
      windSpeed: data.hourly.wind_speed_10m[index] || 0,
      windDirection: data.hourly.wind_direction_10m[index] || 0,
    }))
  } catch (error) {
    console.error("Open-Meteo API error:", error)
    return []
  }
}

// Stormglass API (Premium - requires API key)
export async function fetchStormglassData(lat: number, lng: number): Promise<WaveData[]> {
  const apiKey = process.env.STORMGLASS_API_KEY

  if (!apiKey) {
    console.warn("Stormglass API key not found, falling back to Open-Meteo")
    return fetchOpenMeteoData(lat, lng)
  }

  try {
    const params = "waveHeight,wavePeriod,waveDirection,windSpeed,windDirection"
    const end = new Date()
    end.setDate(end.getDate() + 3)

    const response = await fetch(
      `https://api.stormglass.io/v2/weather/point?` +
        `lat=${lat}&lng=${lng}` +
        `&params=${params}` +
        `&end=${end.toISOString()}`,
      {
        headers: {
          Authorization: apiKey,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Stormglass data")
    }

    const data = await response.json()

    return data.hours.map((hour: any) => ({
      time: hour.time,
      waveHeight: hour.waveHeight?.noaa || hour.waveHeight?.sg || 0,
      wavePeriod: hour.wavePeriod?.noaa || hour.wavePeriod?.sg || 0,
      waveDirection: hour.waveDirection?.noaa || hour.waveDirection?.sg || 0,
      windSpeed: hour.windSpeed?.noaa || hour.windSpeed?.sg || 0,
      windDirection: hour.windDirection?.noaa || hour.windDirection?.sg || 0,
    }))
  } catch (error) {
    console.error("Stormglass API error:", error)
    // Fallback to Open-Meteo
    return fetchOpenMeteoData(lat, lng)
  }
}

// WorldTides API for tide data
export async function fetchTideData(lat: number, lng: number): Promise<TideData[]> {
  const apiKey = process.env.WORLDTIDES_API_KEY

  if (!apiKey) {
    // Return mock tide data if no API key
    return generateMockTideData()
  }

  try {
    const start = new Date()
    const end = new Date()
    end.setDate(end.getDate() + 2)

    const response = await fetch(
      `https://www.worldtides.info/api/v3?` +
        `heights&lat=${lat}&lon=${lng}` +
        `&start=${Math.floor(start.getTime() / 1000)}` +
        `&length=${48 * 3600}` +
        `&step=3600` +
        `&key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch WorldTides data")
    }

    const data = await response.json()

    return data.heights.map((height: any) => ({
      time: new Date(height.dt * 1000).toISOString(),
      height: height.height,
    }))
  } catch (error) {
    console.error("WorldTides API error:", error)
    return generateMockTideData()
  }
}

// Generate mock tide data as fallback
function generateMockTideData(): TideData[] {
  const data: TideData[] = []
  const now = new Date()

  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000)
    // Simple sine wave for tide simulation
    const hours = time.getHours() + time.getMinutes() / 60
    const height = 1.5 + Math.sin((hours * Math.PI) / 6) * 0.7

    data.push({
      time: time.toISOString(),
      height: Math.round(height * 10) / 10,
    })
  }

  return data
}

// Get current conditions for a spot
export async function getCurrentConditions(lat: number, lng: number): Promise<CurrentConditions> {
  try {
    // Fetch current weather data
    const waveData = await fetchOpenMeteoData(lat, lng)
    const tideData = await fetchTideData(lat, lng)

    const current = waveData[0] || {
      waveHeight: 1.0,
      wavePeriod: 8,
      waveDirection: 45,
      windSpeed: 15,
      windDirection: 45,
    }

    const currentTide = tideData[0] || { height: 1.0 }

    // Convert wind direction to compass
    const windDirectionText = getWindDirection(current.windDirection)

    return {
      waveHeight: current.waveHeight,
      wavePeriod: current.wavePeriod,
      waveDirection: current.waveDirection,
      windSpeed: current.windSpeed,
      windDirection: windDirectionText,
      waterTemp: 27, // Default for Ceará
      airTemp: 30, // Default for Ceará
      tideHeight: currentTide.height,
    }
  } catch (error) {
    console.error("Error fetching current conditions:", error)
    // Return default conditions
    return {
      waveHeight: 1.2,
      wavePeriod: 8,
      waveDirection: 45,
      windSpeed: 15,
      windDirection: "NE",
      waterTemp: 27,
      airTemp: 30,
      tideHeight: 1.0,
    }
  }
}

// Convert wind direction degrees to compass direction
function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Spot coordinates for Ceará surf spots
export const SPOT_COORDINATES = {
  taiba: { lat: -3.6167, lng: -38.9167 },
  paracuru: { lat: -3.4167, lng: -39.0333 },
  icarai: { lat: -2.8833, lng: -39.8833 },
  "canoa-quebrada": { lat: -4.0167, lng: -37.7667 },
  jericoacoara: { lat: -2.7833, lng: -40.5167 },
  cumbuco: { lat: -3.6333, lng: -38.9833 },
  pecem: { lat: -3.5833, lng: -38.8333 },
  lagoinha: { lat: -3.1833, lng: -39.7333 },
}
