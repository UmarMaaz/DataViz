export interface VisualizationRecommendation {
  columns: string[]
  type: "scatter" | "line" | "histogram" | "bar" | "box"
  title: string
  insight: string
}

export interface ChartConfig {
  xCol?: string
  yCol?: string
  type: string
  title: string
}

export function generateCharts(data: any[], visualizations: VisualizationRecommendation[]): ChartConfig[] {
  return visualizations
    .filter((viz) => {
      // Validate that columns exist in data
      const cols = viz.columns
      if (data.length === 0) return false

      return cols.every((col) => col in data[0])
    })
    .slice(0, 3) // Limit to 3 visualizations for performance
    .map((viz) => ({
      xCol: viz.columns[0],
      yCol: viz.columns[1] || viz.columns[0],
      type: viz.type,
      title: viz.title,
      insight: viz.insight,
    }))
}

export function filterStatisticsByRecommendation(statistics: any, criticalStats: any[]): Record<string, any> {
  const filtered: Record<string, any> = {}

  criticalStats.forEach(({ column, metric, value }) => {
    if (!filtered[column]) {
      filtered[column] = statistics[column]
    }
  })

  // If no critical stats matched, return top numeric and categorical columns
  if (Object.keys(filtered).length === 0) {
    Object.entries(statistics).forEach(([col, stats]: any) => {
      if (stats.type === "numeric" && Object.keys(filtered).length < 3) {
        filtered[col] = stats
      }
    })
  }

  return filtered
}
