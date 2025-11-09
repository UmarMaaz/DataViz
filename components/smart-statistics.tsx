"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react"

interface SmartStatisticsProps {
  statistics: any
  criticalStats: any[]
  columnInfo?: any
}

export function SmartStatistics({ statistics, criticalStats, columnInfo }: SmartStatisticsProps) {
  // Find the best and worst performing stats
  const numericStats = Object.entries(statistics)
    .filter(([_, stats]: any) => stats.type === "numeric")
    .map(([colName, stats]: any) => ({
      name: colName,
      mean: stats.mean || 0,
      median: stats.median || 0,
      min: stats.min || 0,
      max: stats.max || 0,
      range: (stats.max || 0) - (stats.min || 0),
    }))

  const highestAverage = numericStats.length > 0 ? numericStats.reduce((a, b) => (a.mean > b.mean ? a : b)) : null
  const lowestAverage = numericStats.length > 0 ? numericStats.reduce((a, b) => (a.mean < b.mean ? a : b)) : null

  return (
    <div className="space-y-6">
      {/* Key Decision Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Critical Metrics for Decision Making
        </h3>
        {criticalStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalStats.map((stat: any, idx: number) => (
              <Card key={idx} className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">{stat.column}</p>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-foreground">
                    {typeof stat.value === "number" ? stat.value.toFixed(2) : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{stat.metric}</p>
                </div>
                <p className="text-sm text-blue-900 font-medium border-l-3 border-blue-400 pl-3">{stat.significance}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-muted-foreground">
            No critical statistics identified. Check your data and try again.
          </Card>
        )}
      </div>

      {/* Quick Insights */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highestAverage && (
            <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Strongest Metric</p>
                  <p className="text-xl font-bold text-foreground mt-1">{highestAverage.name}</p>
                  <p className="text-sm text-green-800 mt-1">Average: {highestAverage.mean.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          )}

          {lowestAverage && (
            <Card className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-orange-900">Area to Watch</p>
                  <p className="text-xl font-bold text-foreground mt-1">{lowestAverage.name}</p>
                  <p className="text-sm text-orange-800 mt-1">Average: {lowestAverage.mean.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* All Column Summaries */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-slate-600" />
          All Column Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(statistics).map(([colName, stats]: any) => (
            <Card key={colName} className="p-4 border border-slate-200 hover:border-slate-400 transition-colors">
              <p className="text-sm font-bold text-slate-700 capitalize mb-3">{colName.replace(/_/g, " ")}</p>

              {stats.type === "numeric" ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-xs text-slate-600">Average</span>
                    <span className="font-bold text-foreground">{stats.mean?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span className="text-xs text-slate-600">Highest</span>
                    <span className="font-bold text-foreground">{stats.max?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span className="text-xs text-slate-600">Lowest</span>
                    <span className="font-bold text-foreground">{stats.min?.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span className="text-xs text-slate-600">Unique Values</span>
                    <span className="font-bold text-foreground">{stats.unique}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span className="text-xs text-slate-600">Total Entries</span>
                    <span className="font-bold text-foreground">{stats.count}</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
