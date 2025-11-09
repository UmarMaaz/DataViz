import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyDwdj4RKjQMoQSqAxF2IGudWb0pOzF7GH8")

export async function POST(request: NextRequest) {
  try {
    const { data, statistics, columnInfo } = await request.json()

    if (!data) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const analysisPrompt = `You are a data analyst AI. Analyze this dataset and provide insightful observations:

Dataset Overview:
- Total Rows: ${data.length}
- Columns: ${Array.isArray(data[0]) ? data[0].length : Object.keys(data[0] || {}).length}

Sample Data (first 3 rows):
${JSON.stringify(data.slice(0, 3), null, 2)}

Column Information:
${JSON.stringify(columnInfo, null, 2)}

Statistics:
${JSON.stringify(statistics, null, 2)}

Please provide:
1. Key patterns and trends in the data
2. Notable statistics or anomalies
3. Data quality observations
4. Recommended visualizations
5. Potential next steps for analysis

Be concise but thorough in your analysis.`

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: analysisPrompt }],
        },
      ],
    })

    const text = result.response.text()
    console.log("[v0] Gemini insights generated:", text.substring(0, 100))

    return NextResponse.json({
      insights: text,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Gemini analysis error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
