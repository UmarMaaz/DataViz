import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { data, statistics } = await request.json()

    if (!data || !statistics) {
      return NextResponse.json({ error: "Missing data or statistics" }, { status: 400 })
    }

    const prompt = `Analyze this CSV data and provide insights:

Data Sample (first 5 rows):
${JSON.stringify(data.slice(0, 5), null, 2)}

Statistics:
${JSON.stringify(statistics, null, 2)}

Total Rows: ${data.length}

Please provide 3-4 key insights about this dataset in a professional manner.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    return NextResponse.json({ insights: text })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
