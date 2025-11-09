"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { processCSVData } from "@/lib/data-processor"
import { useCSVData } from "@/hooks/use-csv-data"

export function CSVUploader() {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const { updateData, analysis } = useCSVData()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setFileName(file.name)

    try {
      const result = await processCSVData(file)
      console.log("[v0] Processing CSV with headers:", result.headers)
      console.log("[v0] Data rows:", result.data.length)

      updateData({
        data: result.data,
        statistics: result.statistics,
        columnInfo: result.columnInfo,
        headers: result.headers,
      })

      console.log(`CSV processed successfully: ${result.data.length} rows`)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to process CSV file")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8 mb-8 bg-card border-2 border-dashed border-muted">
      <div className="flex flex-col items-center justify-center">
        <Upload className="w-12 h-12 text-primary mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Upload CSV File</h2>
        <p className="text-muted-foreground text-center mb-6">Drag and drop or click to select a file</p>

        <label className="cursor-pointer">
          <input type="file" accept=".csv" onChange={handleFileUpload} disabled={isLoading} className="hidden" />
          <Button asChild disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <span>{isLoading ? "Processing..." : "Select File"}</span>
          </Button>
        </label>

        {fileName && (
          <p className="mt-4 text-sm text-muted-foreground">
            Selected: <span className="font-semibold text-foreground">{fileName}</span>
          </p>
        )}

        {analysis && (
          <div className="mt-4 text-sm text-green-600">✓ {analysis.data.length} rows processed successfully</div>
        )}
      </div>
    </Card>
  )
}
