"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Zap, Loader2, Brain } from "lucide-react"

interface WhatIfAnalysisProps {
  data: any[]
  headers: string[]
  statistics: Record<string, any>
}

export function WhatIfAnalysis({ data, headers, statistics }: WhatIfAnalysisProps) {
  const numericHeaders = headers.filter((h) => statistics[h]?.type === "numeric")
  const [targetColumn, setTargetColumn] = useState<string>(numericHeaders[0] || "")
  const [adjustmentType, setAdjustmentType] = useState<"percentage" | "fixed">("percentage")
  const [adjustmentValue, setAdjustmentValue] = useState<number>(10)
  const [scenarios, setScenarios] = useState<any[]>([])

  const [customQuestion, setCustomQuestion] = useState<string>("")
  const [scenarioAnalysis, setScenarioAnalysis] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)

  const generateScenarios = () => {
    if (!targetColumn) return

    const values = data.map((r) => Number.parseFloat(r[targetColumn])).filter((v) => !isNaN(v))
    const currentSum = values.reduce((a, b) => a + b)
    const currentAvg = currentSum / values.length

    const scenarios = []

    // Base case
    scenarios.push({
      name: "Current",
      value: currentSum,
      average: currentAvg,
      change: 0,
    })

    // Positive scenario
    const positiveAdjustment =
      adjustmentType === "percentage" ? currentSum * (adjustmentValue / 100) : adjustmentValue * values.length
    scenarios.push({
      name: `+${adjustmentValue}${adjustmentType === "percentage" ? "%" : ""}`,
      value: currentSum + positiveAdjustment,
      average: (currentSum + positiveAdjustment) / values.length,
      change: ((positiveAdjustment / currentSum) * 100).toFixed(2),
    })

    // Negative scenario
    const negativeAdjustment =
      adjustmentType === "percentage" ? currentSum * (adjustmentValue / 100) : adjustmentValue * values.length
    scenarios.push({
      name: `-${adjustmentValue}${adjustmentType === "percentage" ? "%" : ""}`,
      value: currentSum - negativeAdjustment,
      average: (currentSum - negativeAdjustment) / values.length,
      change: ((-negativeAdjustment / currentSum) * 100).toFixed(2),
    })

    setScenarios(scenarios)
  }

  const analyzeCustomScenario = async () => {
    if (!customQuestion.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/scenario-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: customQuestion,
          data,
          headers,
          statistics,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setScenarioAnalysis(result.analysis)
      } else {
        setScenarioAnalysis("Error analyzing scenario. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setScenarioAnalysis("Failed to analyze scenario. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-25 border-amber-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600" />
          What-If Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Target Column</Label>
            <Select value={targetColumn} onValueChange={setTargetColumn}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {numericHeaders.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Adjustment Type</Label>
            <Select value={adjustmentType} onValueChange={(val: any) => setAdjustmentType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage %</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">
              {adjustmentType === "percentage" ? "Adjustment %" : "Adjustment Amount"}
            </Label>
            <Input
              type="number"
              value={adjustmentValue}
              onChange={(e) => setAdjustmentValue(Number(e.target.value))}
              placeholder="Enter value"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={generateScenarios} className="w-full bg-amber-600 hover:bg-amber-700">
              Generate Scenarios
            </Button>
          </div>
        </div>

        {scenarios.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scenarios.map((s, idx) => (
                <Card key={idx} className="p-4 bg-white border border-amber-100">
                  <p className="text-sm text-muted-foreground">{s.name}</p>
                  <p className="text-xl font-bold text-amber-600">{s.value.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg: {s.average.toFixed(2)}</p>
                  {s.change !== 0 && (
                    <p className={`text-xs font-semibold mt-1 ${s.change > 0 ? "text-green-600" : "text-red-600"}`}>
                      {s.change > 0 ? "+" : ""}
                      {s.change}% change
                    </p>
                  )}
                </Card>
              ))}
            </div>

            <div className="bg-white p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scenarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#b45309" name="Total Value" strokeWidth={2} />
                  <Line type="monotone" dataKey="average" stroke="#d97706" name="Average" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-25 border-purple-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Ask AI About Scenarios
        </h3>

        <p className="text-sm text-muted-foreground mb-3">
          Ask questions about your data or test business scenarios. AI will analyze your dataset and provide actionable
          insights.
        </p>

        <div className="space-y-3">
          <Label className="text-sm font-semibold">Your Question or Scenario</Label>
          <Textarea
            placeholder="Example: What if we increase discount by 15%? How would that impact our sales volume? Or: Which region has the highest growth potential?"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            className="min-h-20 resize-none"
          />

          <Button
            onClick={analyzeCustomScenario}
            disabled={!customQuestion.trim() || isAnalyzing}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        </div>

        {scenarioAnalysis && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100">
            <p className="text-sm font-semibold mb-2 text-purple-700">AI Analysis:</p>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{scenarioAnalysis}</div>
          </div>
        )}
      </Card>
    </div>
  )
}
