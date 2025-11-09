import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyDwdj4RKjQMoQSqAxF2IGudWb0pOzF7GH8")

export async function POST(request: NextRequest) {
  try {
    const { data, statistics, columnInfo, headers } = await request.json()

    if (!data || !headers) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const analysisPrompt = `You are a business data analyst. Analyze this dataset and generate visualizations that drive SPECIFIC BUSINESS DECISIONS.

Dataset: ${headers.length} columns, ${data.length} rows

Columns and Types:
${Object.entries(columnInfo)
  .map(
    ([col, info]: any) =>
      `- ${col}: ${info.dtype} (${info.non_null}/${data.length} values, ${info.completeness} complete)`,
  )
  .join("\n")}

Statistics:
${JSON.stringify(statistics, null, 2)}

Sample Data:
${JSON.stringify(data.slice(0, 5), null, 2)}

GENERATE ACTIONABLE VISUALIZATIONS that answer specific business questions:
- Compare performance across categories/regions (group by categorical, sum/avg numeric)
- Show trends that reveal top performers vs underperformers
- Highlight key metrics that directly impact revenue/profit/growth
- Avoid generic "top 10" - instead focus on meaningful business comparisons

Return ONLY valid JSON (no markdown):
{
  "keyInsights": "2-3 sentences: What specific business opportunity or problem does this data reveal?",
  "recommendedColumns": [
    {
      "name": "column_name",
      "reason": "How does this directly impact a business decision?",
      "priority": "high|medium|low"
    }
  ],
  "visualizations": [
    {
      "columns": ["col1", "col2"],
      "type": "scatter|line|histogram|bar|box",
      "title": "Specific business question answered",
      "insight": "What decision or action does this visualization support?"
    }
  ],
  "criticalStatistics": [
    {
      "column": "column_name",
      "metric": "mean|median|min|max|range",
      "value": "the value",
      "significance": "Why this matters for business decisions"
    }
  ],
  "dataQualityIssues": [],
  "actionableRecommendations": ["Specific business action based on data findings"]
}`

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
    console.log("[v0] Gemini response received:", text.substring(0, 100))

    // Parse the JSON response
    let recommendations
    try {
      recommendations = JSON.parse(text)
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Could not parse recommendations")
      }
    }

    return NextResponse.json({
      recommendations,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Analysis recommendations error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations", details: String(error) }, { status: 500 })
  }
}
