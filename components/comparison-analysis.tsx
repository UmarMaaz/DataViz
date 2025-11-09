"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface ComparisonAnalysisProps {
  data: any[]
  headers: string[]
  statistics: Record<string, any>
}

export function ComparisonAnalysis({ data, headers, statistics }: ComparisonAnalysisProps) {
  const [segmentBy, setSegmentBy] = useState<string>("")
  const [metricColumn, setMetricColumn] = useState<string>("")
  const [comparisonType, setComparisonType] = useState<"bar" | "line">("bar")

  const numericHeaders = headers.filter((h) => statistics[h]?.type === "numeric")
  const categoricalHeaders = headers.filter((h) => statistics[h]?.type === "string")

  const generateComparison = () => {
    if (!segmentBy || !metricColumn) return []

    const grouped: Record<string, number[]> = {}
    data.forEach((row) => {
      const segment = String(row[segmentBy])
      const value = Number.parseFloat(row[metricColumn])
      if (!isNaN(value)) {
        if (!grouped[segment]) grouped[segment] = []
        grouped[segment].push(value)
      }
    })

    return Object.entries(grouped).map(([name, values]) => ({
      name,
      average: values.reduce((a, b) => a + b) / values.length,
      total: values.reduce((a, b) => a + b),
      count: values.length,
    }))
  }

  const comparisonData = generateComparison()

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-25 border-green-200">
      <h3 className="text-lg font-semibold mb-4">Segment & Compare</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">Segment By</label>
          <Select value={segmentBy} onValueChange={setSegmentBy}>
            <SelectTrigger>
              <SelectValue placeholder="Choose category..." />
            </SelectTrigger>
            <SelectContent>
              {categoricalHeaders.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Metric to Compare</label>
          <Select value={metricColumn} onValueChange={setMetricColumn}>
            <SelectTrigger>
              <SelectValue placeholder="Choose metric..." />
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
          <label className="text-sm font-semibold mb-2 block">Chart Type</label>
          <div className="flex gap-2">
            <Button
              variant={comparisonType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonType("bar")}
            >
              Bar
            </Button>
            <Button
              variant={comparisonType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonType("line")}
            >
              Line
            </Button>
          </div>
        </div>
      </div>

      {comparisonData.length > 0 && (
        <div className="bg-white p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            {comparisonType === "bar" ? (
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#8b5cf6" name="Average" />
                <Bar dataKey="total" fill="#3b82f6" name="Total" />
              </BarChart>
            ) : (
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#8b5cf6" name="Average" />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
