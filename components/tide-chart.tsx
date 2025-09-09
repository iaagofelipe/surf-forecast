"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TideChartProps {
  data?: Array<{
    time: string
    height: number
  }>
}

export function TideChart({ data }: TideChartProps) {
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
        height: Math.round(item.height * 10) / 10,
      }
    }) || []

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
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
            formatter={(value) => [`${value}m`, "Maré"]}
          />
          <Area
            type="monotone"
            dataKey="height"
            stroke="hsl(var(--accent))"
            fill="hsl(var(--accent))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
