import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { readdirSync } from "fs"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

function parseCSV(content: string) {
  const lines = content.trim().split("\n")
  if (lines.length === 0) return []

  const headers = lines[0].split(",").map((h) => h.trim())
  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    const row: any = {}
    headers.forEach((header, idx) => {
      row[header] = isNaN(Number(values[idx])) ? values[idx] : Number(values[idx])
    })
    return row
  })

  return data
}

function calculateStatistics(data: any[]) {
  if (data.length === 0) return {}

  const numericColumns = Object.keys(data[0]).filter((col) => {
    return data.some((row) => typeof row[col] === "number")
  })

  const stats: any = {}

  numericColumns.forEach((col) => {
    const values = data.map((row) => row[col]).filter((v) => typeof v === "number")
    const sorted = values.sort((a, b) => a - b)

    stats[`${col}_mean`] = values.reduce((a, b) => a + b, 0) / values.length
    stats[`${col}_median`] = sorted[Math.floor(sorted.length / 2)]
    stats[`${col}_min`] = Math.min(...values)
    stats[`${col}_max`] = Math.max(...values)
    stats[`${col}_count`] = values.length
  })

  return stats
}

export async function GET() {
  try {
    const files = readdirSync(UPLOAD_DIR)
    if (files.length === 0) {
      return NextResponse.json({ data: null, statistics: null, insights: "" })
    }

    const latestFile = files.sort().pop()
    const content = await readFile(join(UPLOAD_DIR, latestFile!), "utf-8")
    const data = parseCSV(content)
    const statistics = calculateStatistics(data)

    // Generate insights using AI
    let insights = "Analyzing your data..."
    try {
      const analysisResponse = await fetch(
        new URL("/api/analyze", process.env.VERCEL_URL || "http://localhost:3000").toString(),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: data.slice(0, 100), statistics }),
        },
      )

      if (analysisResponse.ok) {
        const result = await analysisResponse.json()
        insights = result.insights
      }
    } catch (error) {
      console.error("AI analysis error:", error)
    }

    return NextResponse.json({ data, statistics, insights })
  } catch (error) {
    console.error("Data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
