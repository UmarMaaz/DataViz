"use client"

import { useState, useEffect, useCallback } from "react"

interface AnalysisData {
  data: any[]
  statistics: Record<string, any>
  columnInfo: Record<string, any>
}

// Simple pub-sub for cross-component updates
let listeners: ((data: AnalysisData | null) => void)[] = []

export function notifyDataUpdate(data: AnalysisData | null) {
  listeners.forEach((listener) => listener(data))
}

export function useCSVData() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem("csvAnalysis")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setAnalysis(parsed)
        setHasData(true)
      } catch {
        console.error("Failed to parse stored data")
      }
    }

    // Subscribe to updates
    const handleUpdate = (data: AnalysisData | null) => {
      setAnalysis(data)
      setHasData(!!data)
    }

    listeners.push(handleUpdate)

    return () => {
      listeners = listeners.filter((l) => l !== handleUpdate)
    }
  }, [])

  const updateData = useCallback((newData: AnalysisData | null) => {
    if (newData) {
      localStorage.setItem("csvAnalysis", JSON.stringify(newData))
    } else {
      localStorage.removeItem("csvAnalysis")
    }
    setAnalysis(newData)
    setHasData(!!newData)
    notifyDataUpdate(newData)
  }, [])

  return { analysis, hasData, updateData }
}
