"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, FileJson, FileText } from "lucide-react"

interface ExportReportsProps {
  data: any[]
  headers: string[]
  statistics: Record<string, any>
  analysisTitle: string
}

export function ExportReports({ data, headers, statistics, analysisTitle }: ExportReportsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h]
            return typeof val === "string" && val.includes(",") ? `"${val}"` : val
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${analysisTitle}_data.csv`
    a.click()
  }

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${analysisTitle}_data.json`
    a.click()
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-25 border-indigo-200">
      <h3 className="text-lg font-semibold mb-4">Export & Report</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={exportToCSV} variant="outline" className="gap-2 h-20 flex-col bg-transparent">
          <FileDown className="w-5 h-5" />
          Export CSV
        </Button>
        <Button onClick={exportToJSON} variant="outline" className="gap-2 h-20 flex-col bg-transparent">
          <FileJson className="w-5 h-5" />
          Export JSON
        </Button>
      </div>
    </Card>
  )
}
