import { CSVUploader } from "@/components/csv-uploader"
import { SmartDashboard } from "@/components/smart-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">DataViz</h1>
          <p className="text-muted-foreground">Upload and analyze your data with AI-powered insights</p>
        </header>
        <CSVUploader />
        <SmartDashboard />
      </div>
    </main>
  )
}
