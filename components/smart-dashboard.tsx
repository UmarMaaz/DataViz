"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, AlertCircle, TrendingUp, CheckCircle, Zap, FileDown } from "lucide-react"
import { DataPreview } from "./data-preview"
import { SmartCharts } from "./smart-charts"
import { SmartStatistics } from "./smart-statistics"
import { useCSVData } from "@/hooks/use-csv-data"
import { CustomChart } from "./custom-chart"
import { FiltersPanel } from "./filters-panel"
import { ComparisonAnalysis } from "./comparison-analysis"
import { CorrelationAnalysis } from "./correlation-analysis"
import { AnomalyDetection } from "./anomaly-detection"
import { ExportReports } from "./export-reports"
import { WhatIfAnalysis } from "./what-if-analysis"

interface Recommendations {
  keyInsights: string
  recommendedColumns: any[]
  visualizations: any[]
  criticalStatistics: any[]
  dataQualityIssues: string[]
  actionableRecommendations: string[]
}

export function SmartDashboard() {
  const [activeTab, setActiveTab] = useState("insights")
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { analysis, hasData } = useCSVData()

  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [selectedChartType, setSelectedChartType] = useState<string>("bar")
  const [filteredData, setFilteredData] = useState<any[]>([])

  useEffect(() => {
    if (!analysis) {
      console.log("[v0] No analysis data yet")
      return
    }

    console.log("[v0] Analysis data received:", analysis.headers)

    const fetchRecommendations = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/analyze-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: analysis.data.slice(0, 100),
            statistics: analysis.statistics,
            columnInfo: analysis.columnInfo,
            headers: analysis.headers,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        const result = await response.json()
        console.log("[v0] Recommendations received:", result)
        setRecommendations(result.recommendations)
      } catch (error) {
        console.error("[v0] Error fetching recommendations:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [analysis])

  if (!hasData || !analysis) {
    return <Card className="p-8 text-center text-muted-foreground">Upload a CSV file to get started</Card>
  }

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Analyzing your data with AI...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center border-red-200 bg-red-50">
        <p className="text-red-700 font-semibold mb-2">Error analyzing data</p>
        <p className="text-red-600 text-sm">{error}</p>
      </Card>
    )
  }

  if (!recommendations) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Waiting for AI analysis...</p>
      </Card>
    )
  }

  const displayData = filteredData.length > 0 ? filteredData : analysis.data

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-10 bg-muted overflow-x-auto">
        <TabsTrigger value="insights" className="flex items-center gap-1 text-xs sm:text-sm">
          <Lightbulb className="w-4 h-4" />
          <span className="hidden sm:inline">Insights</span>
        </TabsTrigger>
        <TabsTrigger value="charts" className="flex items-center gap-1 text-xs sm:text-sm">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Charts</span>
        </TabsTrigger>
        <TabsTrigger value="statistics" className="flex items-center gap-1 text-xs sm:text-sm">
          <CheckCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Stats</span>
        </TabsTrigger>
        <TabsTrigger value="quality" className="flex items-center gap-1 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Quality</span>
        </TabsTrigger>
        <TabsTrigger value="comparison" className="flex items-center gap-1 text-xs sm:text-sm">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
        </TabsTrigger>
        <TabsTrigger value="correlation" className="flex items-center gap-1 text-xs sm:text-sm">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Correlate</span>
        </TabsTrigger>
        <TabsTrigger value="anomalies" className="flex items-center gap-1 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Anomalies</span>
        </TabsTrigger>
        <TabsTrigger value="whatif" className="flex items-center gap-1 text-xs sm:text-sm">
          <Zap className="w-4 h-4" />
          <span className="hidden sm:inline">What-If</span>
        </TabsTrigger>
        <TabsTrigger value="export" className="flex items-center gap-1 text-xs sm:text-sm">
          <FileDown className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </TabsTrigger>
        <TabsTrigger value="custom" className="flex items-center gap-1 text-xs sm:text-sm">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Custom</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <FiltersPanel headers={analysis.headers} data={analysis.data} onFiltersChange={setFilteredData} />
      </div>

      <TabsContent value="insights" className="mt-6 space-y-4">
        {recommendations && (
          <>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex gap-3">
                <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Key Insights</h3>
                  <p className="text-foreground/90">{recommendations.keyInsights}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Recommended Columns to Analyze</h3>
              <div className="space-y-3">
                {recommendations.recommendedColumns.map((col: any, idx: number) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">{col.name}</p>
                        <p className="text-sm text-muted-foreground">{col.reason}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          col.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : col.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {col.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Actionable Recommendations</h3>
              <ul className="space-y-2">
                {recommendations.actionableRecommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-foreground/90">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </TabsContent>

      <TabsContent value="charts" className="mt-6">
        {recommendations && <SmartCharts data={displayData} visualizations={recommendations.visualizations} />}
      </TabsContent>

      <TabsContent value="statistics" className="mt-6">
        {recommendations && (
          <SmartStatistics
            statistics={analysis.statistics}
            criticalStats={recommendations.criticalStatistics}
            columnInfo={analysis.columnInfo}
          />
        )}
      </TabsContent>

      <TabsContent value="quality" className="mt-6">
        {recommendations && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Data Quality Report</h3>
            {recommendations.dataQualityIssues.length > 0 ? (
              <ul className="space-y-2">
                {recommendations.dataQualityIssues.map((issue: string, idx: number) => (
                  <li key={idx} className="flex gap-2 items-start p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No data quality issues detected.</p>
            )}
          </Card>
        )}
      </TabsContent>

      <TabsContent value="comparison" className="mt-6">
        {recommendations && (
          <ComparisonAnalysis data={displayData} headers={analysis.headers} statistics={analysis.statistics} />
        )}
      </TabsContent>

      <TabsContent value="correlation" className="mt-6">
        {recommendations && (
          <CorrelationAnalysis data={displayData} headers={analysis.headers} statistics={analysis.statistics} />
        )}
      </TabsContent>

      <TabsContent value="anomalies" className="mt-6">
        {recommendations && (
          <AnomalyDetection data={displayData} headers={analysis.headers} statistics={analysis.statistics} />
        )}
      </TabsContent>

      <TabsContent value="whatif" className="mt-6">
        {recommendations && (
          <WhatIfAnalysis data={displayData} headers={analysis.headers} statistics={analysis.statistics} />
        )}
      </TabsContent>

      <TabsContent value="export" className="mt-6">
        {recommendations && (
          <ExportReports
            data={displayData}
            headers={analysis.headers}
            statistics={analysis.statistics}
            analysisTitle="Data Analysis"
          />
        )}
      </TabsContent>

      <TabsContent value="custom" className="mt-6 space-y-6">
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-foreground mb-4">Create Custom Visualization</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Select columns you want to analyze and choose a chart type that works best for your comparison.
          </p>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">Select Columns to Analyze</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {analysis.headers.map((header: string) => (
                  <label
                    key={header}
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-blue-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(header)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedColumns([...selectedColumns, header])
                        } else {
                          setSelectedColumns(selectedColumns.filter((c) => c !== header))
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">{header}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">Chart Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["bar", "line", "scatter", "histogram"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChartType(type)}
                    className={`p-3 rounded-lg border font-medium text-sm transition-all capitalize ${
                      selectedChartType === type
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-foreground border-slate-200 hover:border-blue-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {selectedColumns.length > 0 && (
              <Card className="p-4 bg-white border border-green-200">
                <p className="text-sm text-green-700">
                  <strong>Ready:</strong> Creating {selectedChartType} chart with {selectedColumns.length} column
                  {selectedColumns.length !== 1 ? "s" : ""}
                </p>
              </Card>
            )}
          </div>
        </Card>

        {selectedColumns.length > 0 && (
          <CustomChart data={analysis.data} columns={selectedColumns} chartType={selectedChartType} />
        )}
      </TabsContent>

      <TabsContent value="preview" className="mt-6">
        <DataPreview data={displayData} />
      </TabsContent>
    </Tabs>
  )
}
