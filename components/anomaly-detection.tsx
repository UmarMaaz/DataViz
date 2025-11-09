"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface AnomalyDetectionProps {
  data: any[]
  headers: string[]
  statistics: Record<string, any>
}

export function AnomalyDetection({ data, headers, statistics }: AnomalyDetectionProps) {
  const findAnomalies = () => {
    const anomalies: any[] = []
    const numericHeaders = headers.filter((h) => statistics[h]?.type === "numeric")

    numericHeaders.forEach((col) => {
      const values = data.map((r) => Number.parseFloat(r[col])).filter((v) => !isNaN(v))
      if (values.length === 0) return

      const mean = values.reduce((a, b) => a + b) / values.length
      const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length)
      const threshold = 3

      data.forEach((row, idx) => {
        const value = Number.parseFloat(row[col])
        if (!isNaN(value)) {
          const zScore = Math.abs((value - mean) / (stdDev || 1))
          if (zScore > threshold) {
            anomalies.push({
              column: col,
              rowIndex: idx,
              value,
              mean,
              deviation: zScore.toFixed(2),
              severity: zScore > 4 ? "high" : "medium",
            })
          }
        }
      })
    })

    return anomalies.sort((a, b) => b.deviation - a.deviation).slice(0, 10)
  }

  const anomalies = findAnomalies()

  return (
    <Card className="p-6 bg-gradient-to-br from-red-50 to-red-25 border-red-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        Anomaly Detection
      </h3>

      {anomalies.length === 0 ? (
        <p className="text-muted-foreground">No anomalies detected in your data.</p>
      ) : (
        <div className="space-y-3">
          {anomalies.map((anom, idx) => (
            <Card key={idx} className="p-3 bg-white border border-red-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{anom.column}</p>
                  <p className="text-xs text-muted-foreground">Row {anom.rowIndex + 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{anom.value.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">vs {anom.mean.toFixed(2)} avg</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    anom.severity === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {anom.severity}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}
