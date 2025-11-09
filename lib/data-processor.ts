import Papa from "papaparse"

export interface DataAnalysis {
  data: any[]
  statistics: Record<string, any>
  columnInfo: Record<string, any>
  headers: string[]
}

export async function processCSVData(file: File): Promise<DataAnalysis> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[]
        const headers = results.meta.fields || []

        const statistics = calculateStatistics(data, headers)
        const columnInfo = getColumnInfo(data, headers)

        resolve({
          data,
          statistics,
          columnInfo,
          headers,
        })
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

function calculateStatistics(data: any[], headers: string[]): Record<string, any> {
  const stats: Record<string, any> = {}

  headers.forEach((header) => {
    const values = data.map((row) => row[header]).filter((v) => v !== null && v !== undefined && v !== "")

    const numericValues = values.map((v) => Number.parseFloat(v)).filter((v) => !isNaN(v))

    if (numericValues.length > 0) {
      stats[header] = {
        type: "numeric",
        count: values.length,
        mean: numericValues.reduce((a, b) => a + b) / numericValues.length,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        median: getMedian(numericValues),
        sum: numericValues.reduce((a, b) => a + b),
      }
    } else {
      stats[header] = {
        type: "string",
        count: values.length,
        unique: new Set(values).size,
      }
    }
  })

  return stats
}

function getColumnInfo(data: any[], headers: string[]): Record<string, any> {
  const info: Record<string, any> = {}

  headers.forEach((header) => {
    const values = data.map((row) => row[header]).filter((v) => v !== null && v !== undefined)

    const isNumeric = values.some((v) => !isNaN(Number.parseFloat(v)))
    const nullCount = data.filter((row) => !row[header]).length

    info[header] = {
      dtype: isNumeric ? "number" : "string",
      non_null: values.length,
      null: nullCount,
      unique: new Set(values).size,
      completeness: ((values.length / data.length) * 100).toFixed(2) + "%",
    }
  })

  return info
}

function getMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}
