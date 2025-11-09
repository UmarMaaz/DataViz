"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Filter } from "lucide-react"

interface FilterPanelProps {
  headers: string[]
  data: any[]
  onFiltersChange: (filteredData: any[]) => void
}

interface FilterRule {
  column: string
  type: "equals" | "contains" | "range" | "numeric"
  value: string | number
  value2?: number
}

export function FiltersPanel({ headers, data, onFiltersChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterRule[]>([])
  const [showPanel, setShowPanel] = useState(false)

  const applyFilters = () => {
    let filtered = [...data]

    filters.forEach((filter) => {
      filtered = filtered.filter((row) => {
        const cellValue = row[filter.column]

        if (filter.type === "equals") {
          return cellValue === filter.value
        } else if (filter.type === "contains") {
          return String(cellValue).toLowerCase().includes(String(filter.value).toLowerCase())
        } else if (filter.type === "range" && filter.value2 !== undefined) {
          const num = Number.parseFloat(cellValue)
          return num >= Number.parseFloat(String(filter.value)) && num <= filter.value2
        } else if (filter.type === "numeric") {
          return Number.parseFloat(cellValue) > Number.parseFloat(String(filter.value))
        }
        return true
      })
    })

    onFiltersChange(filtered)
  }

  const addFilter = () => {
    setFilters([...filters, { column: headers[0], type: "equals", value: "" }])
  }

  const removeFilter = (idx: number) => {
    const newFilters = filters.filter((_, i) => i !== idx)
    setFilters(newFilters)
    if (newFilters.length === 0) {
      onFiltersChange(data)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowPanel(!showPanel)} variant="outline" className="gap-2">
        <Filter className="w-4 h-4" />
        Filters ({filters.length})
      </Button>

      {showPanel && (
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-25 border-blue-200">
          <div className="space-y-4">
            {filters.map((filter, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border border-blue-100 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    {/* Column Selection */}
                    <div>
                      <Label className="text-xs font-semibold mb-1 block">Column</Label>
                      <Select
                        value={filter.column}
                        onValueChange={(val) => {
                          const newFilters = [...filters]
                          newFilters[idx].column = val
                          setFilters(newFilters)
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map((h) => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filter Type */}
                    <div>
                      <Label className="text-xs font-semibold mb-1 block">Filter Type</Label>
                      <Select
                        value={filter.type}
                        onValueChange={(val: any) => {
                          const newFilters = [...filters]
                          newFilters[idx].type = val
                          newFilters[idx].value = ""
                          setFilters(newFilters)
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="numeric">Greater Than</SelectItem>
                          <SelectItem value="range">Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Value Input */}
                    <div>
                      <Label className="text-xs font-semibold mb-1 block">Value</Label>
                      <Input
                        type={filter.type === "numeric" || filter.type === "range" ? "number" : "text"}
                        placeholder="Enter value"
                        value={filter.value}
                        onChange={(e) => {
                          const newFilters = [...filters]
                          newFilters[idx].value = e.target.value
                          setFilters(newFilters)
                        }}
                        className="h-8 text-sm"
                      />
                    </div>

                    {/* Range Value */}
                    {filter.type === "range" && (
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Max Value</Label>
                        <Input
                          type="number"
                          placeholder="Enter max value"
                          value={filter.value2 || ""}
                          onChange={(e) => {
                            const newFilters = [...filters]
                            newFilters[idx].value2 = Number.parseFloat(e.target.value)
                            setFilters(newFilters)
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeFilter(idx)} className="p-1 hover:bg-red-100 rounded">
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button onClick={addFilter} variant="outline" size="sm" className="flex-1 bg-transparent">
                Add Filter
              </Button>
              <Button onClick={applyFilters} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Apply Filters
              </Button>
              <Button
                onClick={() => {
                  setFilters([])
                  onFiltersChange(data)
                }}
                variant="ghost"
                size="sm"
              >
                Clear All
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
