"use client"

import { Card } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

interface InsightsSectionProps {
  insights: string
  isLoading?: boolean
}

export function InsightsSection({ insights, isLoading = false }: InsightsSectionProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
      <div className="flex items-start gap-4">
        {isLoading ? (
          <Loader2 className="w-6 h-6 text-primary flex-shrink-0 mt-1 animate-spin" />
        ) : (
          <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Insights (Gemini 2.0)</h3>
          <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {isLoading ? (
              <p className="text-muted-foreground">Generating insights...</p>
            ) : insights ? (
              insights
            ) : (
              "Upload a CSV file to generate AI insights..."
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
