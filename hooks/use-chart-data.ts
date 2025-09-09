"use client"

import { useState, useEffect } from "react"

interface ChartDataPoint {
  time: string
  waveHeight?: number
  period?: number
  windSpeed?: number
  windDirection?: number
  tideHeight?: number
  height?: number
  type?: string
}

interface ChartData {
  data: ChartDataPoint[]
  spot: string
  source: string
}

export function useChartData(type: "wave" | "tide", spot?: string) {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChartData() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({ type })
        if (spot) params.append("spot", spot)

        const response = await fetch(`/api/charts?${params}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch chart data")
        }

        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [type, spot])

  return { data, loading, error }
}
