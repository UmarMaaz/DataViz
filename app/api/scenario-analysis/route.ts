import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { question, data, headers, statistics } = await req.json()

    const genAI = new GoogleGenerativeAI("AIzaSyDwdj4RKjQMoQSqAxF2IGudWb0pOzF7GH8")
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const dataContext = `
    Dataset Overview:
    - Total Records: ${data.length}
    - Columns: ${headers.join(", ")}
    
    Column Statistics:
    ${Object.entries(statistics)
      .map(([col, stats]: [string, any]) => {
        if (stats.type === "numeric") {
          return `${col}: Mean=${stats.mean?.toFixed(2)}, Min=${stats.min}, Max=${stats.max}, Sum=${stats.sum?.toFixed(2)}`
        } else {
          return `${col}: Unique Values=${stats.unique}, Count=${stats.count}`
        }
      })
      .join("\n")}
    `

    const prompt = `Based on this dataset, answer the following business question/scenario analysis:

${dataContext}

User Question: ${question}

Provide a clear, actionable analysis with:
1. Data-backed insights from the dataset
2. Recommended actions or next steps
3. Any potential risks or considerations
4. Quantified impact if possible

Keep the response concise and focused on decision-making.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const analysis = response.text()

    return Response.json({ analysis, success: true })
  } catch (error) {
    console.error("Scenario analysis error:", error)
    return Response.json({ error: "Failed to analyze scenario", success: false }, { status: 500 })
  }
}
