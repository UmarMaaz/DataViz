"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"

interface SmartChartsProps {
  data: any[]
  visualizations: any[]
  recommendations?: any
}

export function SmartCharts({ data, visualizations, recommendations }: SmartChartsProps) {
  const [charts, setCharts] = useState<any[]>([])

  useEffect(() => {
    if (!visualizations || visualizations.length === 0 || !data) return

    const generatedCharts: any[] = []

    visualizations.forEach((viz: any, idx: number) => {
      const { columns, type, title, insight } = viz

      if (!columns || columns.length === 0) return

      try {
        let chartData: any[] = []

        if (type === "bar" && columns.length >= 2) {
          // Group by first column (categorical), aggregate second column (numeric)
          const groupBy = columns[0]
          const aggregateCol = columns[1]
          const grouped = data.reduce(
            (acc, row) => {
              const key = row[groupBy]
              const value = Number.parseFloat(row[aggregateCol])
              if (!isNaN(value)) {
                acc[key] = (acc[key] || 0) + value
              }
              return acc
            },
            {} as Record<string, number>,
          )

          chartData = Object.entries(grouped)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 15)
            .map(([name, value]) => ({ name, value }))
        } else if (type === "line" && columns.length >= 1) {
          // Timeline or progression chart
          const col = columns[0]
          chartData = data.slice(0, 30).map((row, i) => ({
            step: i + 1,
            value: Number.parseFloat(row[col]) || 0,
          }))
        } else if (type === "scatter" && columns.length >= 2) {
          // Scatter plot with actual data
          chartData = data
            .slice(0, 50)
            .filter((row) => !isNaN(Number.parseFloat(row[columns[0]])) && !isNaN(Number.parseFloat(row[columns[1]])))
            .map((row) => ({
              [columns[0]]: Number.parseFloat(row[columns[0]]),
              [columns[1]]: Number.parseFloat(row[columns[1]]),
            }))
        } else if (type === "histogram" && columns.length >= 1) {
          // Distribution histogram
          const col = columns[0]
          const values = data.map((r: any) => Number.parseFloat(r[col])).filter((v) => !isNaN(v))
          if (values.length > 0) {
            const min = Math.min(...values)
            const max = Math.max(...values)
            const range = max - min || 1
            const binSize = range / 10

            const bins: Record<string, number> = {}
            for (let i = 0; i < 10; i++) {
              const binStart = min + i * binSize
              const binEnd = min + (i + 1) * binSize
              const count = values.filter((v) => v >= binStart && v < binEnd).length
              bins[`${binStart.toFixed(0)}-${binEnd.toFixed(0)}`] = count
            }

            chartData = Object.entries(bins).map(([range, count]) => ({
              range,
              count,
            }))
          }
        }

        if (chartData.length > 0) {
          generatedCharts.push({
            id: `chart-${idx}`,
            title,
            insight,
            type,
            data: chartData,
            columns,
          })
        }
      } catch (error) {
        console.error("[v0] Error generating chart:", error)
      }
    })

    setCharts(generatedCharts)
  }, [data, visualizations])

  if (charts.length === 0) {
    return (
      <Card className="p-6 text-muted-foreground">
        No actionable visualizations available. Try uploading a different dataset.
      </Card>
    )
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  return (
    <div className="space-y-6">
      {charts.map((chart: any) => (
        <Card key={chart.id} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">{chart.title}</h3>
            <p className="text-sm text-muted-foreground">{chart.insight}</p>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            {chart.type === "bar" && (
              <BarChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}

            {chart.type === "line" && (
              <LineChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            )}

            {chart.type === "scatter" && (
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chart.columns[0]} fontSize={12} />
                <YAxis dataKey={chart.columns[1]} fontSize={12} />
                <Tooltip />
                <Scatter name={`${chart.columns[0]} vs ${chart.columns[1]}`} data={chart.data} fill="#3b82f6" />
              </ScatterChart>
            )}

            {chart.type === "histogram" && (
              <BarChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Card>
      ))}
    </div>
  )
}
