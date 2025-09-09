"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WaveChartProps {
  data?: Array<{
    time: string
    waveHeight: number
    wavePeriod: number
    waveDirection: number
    windSpeed: number
    windDirection: number
  }>
}

export function WaveChart({ data }: WaveChartProps) {
  const chartData =
    data?.map((item) => {
      const date = new Date(item.time)
      const hours = date.getHours().toString().padStart(2, "0")
      const day = date.getDate()
      const today = new Date().getDate()

      let timeLabel = `${hours}:00`
      if (day !== today) {
        timeLabel = `${day}/${date.getMonth() + 1} ${hours}:00`
      }

      return {
        time: timeLabel,
        height: Math.round(item.waveHeight * 10) / 10,
        period: Math.round(item.wavePeriod),
        windSpeed: Math.round(item.windSpeed),
      }
    }) || []

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="time"
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
            label={{ value: "Altura (m)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value, name) => {
              if (name === "height") return [`${value}m`, "Altura"]
              if (name === "period") return [`${value}s`, "Período"]
              if (name === "windSpeed") return [`${value}kt`, "Vento"]
              return [value, name]
            }}
          />
          <Line
            type="monotone"
            dataKey="height"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            name="height"
          />
          <Line
            type="monotone"
            dataKey="period"
            stroke="hsl(var(--accent))"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="period"
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
