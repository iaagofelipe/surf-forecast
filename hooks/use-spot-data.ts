"use client"

import { useState, useEffect } from "react"

export interface SpotData {
  name: string
  location: string
  slug: string
  description: string
  idealConditions: string
  difficulty: string
  current?: {
    waveHeight: number
    wavePeriod: number
    waveDirection: number
    windSpeed: number
    windDirection: string
    waterTemp: number
    airTemp: number
    tideHeight: number
  }
  condition?: {
    rating: string
    color: string
  }
  forecast?: {
    waves: Array<{
      time: string
      waveHeight: number
      wavePeriod: number
      waveDirection: number
      windSpeed: number
      windDirection: number
    }>
    tides: Array<{
      time: string
      height: number
    }>
  }
}

export function useSpotData(slug?: string) {
  const [data, setData] = useState<SpotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchSpotData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/spots/${slug}`)

        if (!response.ok) {
          throw new Error("Failed to fetch spot data")
        }

        const spotData = await response.json()
        setData(spotData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchSpotData()
  }, [slug])

  return { data, loading, error }
}

export function useAllSpots() {
  const [spots, setSpots] = useState<SpotData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllSpots = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/spots")

        if (!response.ok) {
          throw new Error("Failed to fetch spots data")
        }

        const spotsData = await response.json()
        setSpots(spotsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchAllSpots()
  }, [])

  return { spots, loading, error, refetch: () => window.location.reload() }
}
