"use client"

import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { BarChart3 } from "lucide-react"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface ChartSectionProps {
  data: any
}

export function ChartSection({ data }: ChartSectionProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!data || data.length === 0) {
      setLoading(false)
      return
    }

    const columns = Object.keys(data[0])
    const numericColumns = columns.filter((col) => {
      const values = data.map((row: any) => row[col])
      return values.some((v: any) => {
        const num = Number.parseFloat(v)
        return !isNaN(num) && v !== null && v !== ""
      })
    })

    if (numericColumns.length >= 2) {
      setChartData({
        xCol: numericColumns[0],
        yCol: numericColumns[1],
      })
    }
    setLoading(false)
  }, [data])

  if (loading) {
    return (
      <Card className="p-6 text-muted-foreground flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Loading charts...
      </Card>
    )
  }

  if (!chartData) {
    return (
      <Card className="p-6 text-muted-foreground">
        No numeric data available for charts. Upload a CSV with numeric columns.
      </Card>
    )
  }

  const traces = [
    {
      x: data.map((row: any) => row[chartData.xCol]),
      y: data.map((row: any) => row[chartData.yCol]),
      mode: "markers",
      type: "scatter",
      marker: { color: "#3b82f6", size: 8, opacity: 0.7 },
      name: chartData.yCol,
    },
  ]

  const layout = {
    title: {
      text: `${chartData.yCol} vs ${chartData.xCol}`,
      font: { size: 16 },
    },
    xaxis: { title: chartData.xCol },
    yaxis: { title: chartData.yCol },
    hovermode: "closest" as const,
    plot_bgcolor: "#f8f9fa",
    paper_bgcolor: "#ffffff",
    font: { color: "#1f2937" },
    margin: { l: 60, r: 40, t: 60, b: 60 },
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Scatter Plot Analysis</h3>
        <Plot
          data={traces}
          layout={layout}
          useResizeHandler
          style={{ width: "100%", height: "400px" }}
          config={{ responsive: true }}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trend Visualization</h3>
        <Plot
          data={[
            {
              ...traces[0],
              mode: "lines+markers",
              fill: "tozeroy",
              line: { color: "#3b82f6", width: 2 },
              fillcolor: "rgba(59, 130, 246, 0.1)",
            },
          ]}
          layout={{
            ...layout,
            title: { text: `${chartData.yCol} Trend` },
          }}
          useResizeHandler
          style={{ width: "100%", height: "400px" }}
          config={{ responsive: true }}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Distribution Histogram</h3>
        <Plot
          data={[
            {
              x: data.map((row: any) => row[chartData.yCol]),
              type: "histogram",
              marker: { color: "#10b981" },
              nbinsx: 30,
            },
          ]}
          layout={{
            ...layout,
            title: { text: `${chartData.yCol} Distribution` },
            xaxis: { title: chartData.yCol },
            yaxis: { title: "Frequency" },
          }}
          useResizeHandler
          style={{ width: "100%", height: "400px" }}
          config={{ responsive: true }}
        />
      </Card>
    </div>
  )
}
