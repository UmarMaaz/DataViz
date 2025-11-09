"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react"

interface DataPreviewProps {
  data: any
}

export function DataPreview({ data }: DataPreviewProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  if (!data || data.length === 0) {
    return <Card className="p-6 text-muted-foreground">No data available</Card>
  }

  const columns = Object.keys(data[0])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortOrder("asc")
    }
  }

  let displayData = data
  if (sortColumn) {
    displayData = [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      return sortOrder === "asc" ? comparison : -comparison
    })
  }

  const rows = displayData.slice(0, 20)

  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Data Preview ({data.length} rows total, showing {rows.length})
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-muted">
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className="text-left py-3 px-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {col}
                  {sortColumn === col && <ArrowUpDown className="w-4 h-4" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, idx: number) => (
            <tr key={idx} className="border-b border-muted hover:bg-muted/50">
              {columns.map((col) => (
                <td key={col} className="py-3 px-4 text-foreground">
                  {String(row[col]).substring(0, 50)}
                  {String(row[col]).length > 50 && "..."}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
