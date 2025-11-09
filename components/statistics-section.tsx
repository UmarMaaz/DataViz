"use client"

import { Card } from "@/components/ui/card"
import { Database } from "lucide-react"

interface StatisticsSectionProps {
  statistics: any
  columnInfo?: any
}

export function StatisticsSection({ statistics, columnInfo }: StatisticsSectionProps) {
  if (!statistics) {
    return <Card className="p-6 text-muted-foreground">No statistics available</Card>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(statistics).map(([colName, stats]: any) => (
          <Card key={colName} className="p-6 bg-card border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground capitalize">{colName.replace(/_/g, " ")}</p>
                {columnInfo?.[colName] && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Type: {columnInfo[colName].dtype} | {columnInfo[colName].completeness}
                  </p>
                )}
              </div>
              <Database className="w-5 h-5 text-primary flex-shrink-0" />
            </div>

            {stats.type === "numeric" ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Mean</span>
                  <span className="text-sm font-semibold text-foreground">{stats.mean?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Median</span>
                  <span className="text-sm font-semibold text-foreground">{stats.median?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Range</span>
                  <span className="text-sm font-semibold text-foreground">
                    {stats.min?.toFixed(2)} - {stats.max?.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Unique Values</span>
                  <span className="text-sm font-semibold text-foreground">{stats.unique}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Total Values</span>
                  <span className="text-sm font-semibold text-foreground">{stats.count}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
