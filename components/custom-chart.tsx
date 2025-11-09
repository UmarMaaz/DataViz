"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface CustomChartProps {
  data: any[]
  columns: string[]
  chartType: string
}

export function CustomChart({ data, columns, chartType }: CustomChartProps) {
  if (columns.length === 0) {
    return <Card className="p-6 text-muted-foreground">Select at least one column to visualize</Card>
  }

  let chartData: any[] = []
  let xAxisKey = "name"
  let yAxisKey = "value"

  if (chartType === "bar" && columns.length >= 2) {
    // Group by first column (categorical), sum/avg second column (numeric)
    const groupByCol = columns[0]
    const aggregateCol = columns[1]

    const grouped = data.reduce(
      (acc, row) => {
        const key = row[groupByCol]
        const value = Number.parseFloat(row[aggregateCol])

        if (!isNaN(value)) {
          if (!acc[key]) {
            acc[key] = { name: key, value: 0, count: 0 }
          }
          acc[key].value += value
          acc[key].count += 1
        }
        return acc
      },
      {} as Record<string, any>,
    )

    chartData = Object.values(grouped)
      .sort((a, b) => b.value - a.value)
      .slice(0, 15)
    xAxisKey = "name"
    yAxisKey = "value"
  } else if (chartType === "line" && columns.length >= 2) {
    // Line chart comparing two numeric columns
    const col1 = columns[0]
    const col2 = columns[1]

    chartData = data
      .slice(0, 30)
      .filter((row) => !isNaN(Number.parseFloat(row[col1])) && !isNaN(Number.parseFloat(row[col2])))
      .map((row, idx) => ({
        step: idx + 1,
        [col1]: Number.parseFloat(row[col1]),
        [col2]: Number.parseFloat(row[col2]),
      }))
  } else if (chartType === "scatter" && columns.length >= 2) {
    // Scatter with actual data points
    const col1 = columns[0]
    const col2 = columns[1]

    chartData = data
      .filter((row) => !isNaN(Number.parseFloat(row[col1])) && !isNaN(Number.parseFloat(row[col2])))
      .slice(0, 100)
      .map((row) => ({
        [col1]: Number.parseFloat(row[col1]),
        [col2]: Number.parseFloat(row[col2]),
      }))
  } else if (chartType === "histogram" && columns.length >= 1) {
    // Distribution histogram
    const col = columns[0]
    const values = data.map((r: any) => Number.parseFloat(r[col])).filter((v) => !isNaN(v))

    if (values.length > 0) {
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min || 1
      const binSize = range / 10

      for (let i = 0; i < 10; i++) {
        const binStart = min + i * binSize
        const binEnd = min + (i + 1) * binSize
        const count = values.filter((v) => v >= binStart && v <= binEnd).length
        chartData.push({
          range: `${binStart.toFixed(0)}-${binEnd.toFixed(0)}`,
          count,
        })
      }
    }
  }

  if (chartData.length === 0) {
    return (
      <Card className="p-6 text-muted-foreground">
        Selected columns don't have compatible data for {chartType} chart. Try different columns or chart type.
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Visualization: {columns.join(" vs ")}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        {chartType === "bar" && (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        )}

        {chartType === "line" && (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="step" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={columns[0]} stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey={columns[1]} stroke="#10b981" strokeWidth={2} />
          </LineChart>
        )}

        {chartType === "scatter" && (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={columns[0]} type="number" fontSize={12} />
            <YAxis dataKey={columns[1]} type="number" fontSize={12} />
            <Tooltip />
            <Scatter name={`${columns[0]} vs ${columns[1]}`} data={chartData} fill="#3b82f6" />
          </ScatterChart>
        )}

        {chartType === "histogram" && (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  )
}
