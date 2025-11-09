"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CorrelationAnalysisProps {
  data: any[]
  headers: string[]
  statistics: Record<string, any>
}

export function CorrelationAnalysis({ data, headers, statistics }: CorrelationAnalysisProps) {
  const numericHeaders = headers.filter((h) => statistics[h]?.type === "numeric")
  const [xColumn, setXColumn] = useState<string>(numericHeaders[0] || "")
  const [yColumn, setYColumn] = useState<string>(numericHeaders[1] || "")

  const calculateCorrelation = () => {
    const xValues = data.map((r) => Number.parseFloat(r[xColumn])).filter((v) => !isNaN(v))
    const yValues = data.map((r) => Number.parseFloat(r[yColumn])).filter((v) => !isNaN(v))

    if (xValues.length === 0 || yValues.length === 0) return 0

    const xMean = xValues.reduce((a, b) => a + b) / xValues.length
    const yMean = yValues.reduce((a, b) => a + b) / yValues.length

    let numerator = 0,
      xDenom = 0,
      yDenom = 0

    for (let i = 0; i < xValues.length; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean)
      xDenom += Math.pow(xValues[i] - xMean, 2)
      yDenom += Math.pow(yValues[i] - yMean, 2)
    }

    return numerator / Math.sqrt(xDenom * yDenom)
  }

  const chartData = data
    .map((r) => ({
      x: Number.parseFloat(r[xColumn]),
      y: Number.parseFloat(r[yColumn]),
    }))
    .filter((d) => !isNaN(d.x) && !isNaN(d.y))

  const correlation = calculateCorrelation()

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-25 border-purple-200">
      <h3 className="text-lg font-semibold mb-4">Correlation Analysis</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">X Axis</label>
          <Select value={xColumn} onValueChange={setXColumn}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {numericHeaders.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Y Axis</label>
          <Select value={yColumn} onValueChange={setYColumn}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {numericHeaders.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4 bg-white mb-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Correlation Coefficient</p>
          <p
            className={`text-2xl font-bold ${correlation > 0.7 ? "text-green-600" : correlation < -0.7 ? "text-red-600" : "text-yellow-600"}`}
          >
            {correlation.toFixed(3)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {Math.abs(correlation) > 0.7 ? "Strong" : Math.abs(correlation) > 0.4 ? "Moderate" : "Weak"} relationship
          </p>
        </div>
      </Card>

      <div className="bg-white p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name={xColumn} />
            <YAxis dataKey="y" name={yColumn} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="Data Points" data={chartData} fill="#8b5cf6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
