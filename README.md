# DataViz - Data Analysis & Visualization App

A modern, full-stack data analysis application built with Next.js, React, and Gemini AI. Upload CSV files, explore data through interactive visualizations, and get AI-powered insights.

## Features

- **📁 CSV Upload**: Drag-and-drop file upload with instant parsing
- **📊 Interactive Visualizations**: Scatter plots and line charts powered by Plotly
- **📈 Statistical Analysis**: Comprehensive statistics for numeric and categorical data
- **🤖 AI Insights**: Gemini 2.0 Flash-powered data analysis and recommendations
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **⚡ Real-time Processing**: Browser-based CSV processing for speed

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Plotly.js** - Interactive charts
- **shadcn/ui** - Component library

### Backend (Optional)
- **FastAPI** - Python API framework
- **Pandas** - Data processing
- **NumPy** - Numerical computing

### AI
- **Gemini 2.0 Flash** - AI-powered insights
- **Vercel AI SDK** - LLM integration

## Getting Started

### Prerequisites
- Node.js 18+
- Vercel account (for Gemini AI access)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables in Vercel:
   - Add integrations via Vercel dashboard
   - AI providers will be configured automatically

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open http://localhost:3000 in your browser

## Usage

1. **Upload CSV**: Click the upload area or drag and drop a CSV file
2. **Preview Data**: View your data in the Preview tab
3. **Analyze Statistics**: Check statistical summaries in the Statistics tab
4. **Visualize**: Explore scatter plots and line charts in the Charts tab
5. **Get Insights**: Read AI-generated insights in the Insights tab

## Deployment

Deploy to Vercel in one click:

\`\`\`bash
npm run build
npm start
\`\`\`

Or push to GitHub and connect to Vercel for automatic deployments.

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── api/              # API routes
│       ├── upload/       # File upload
│       ├── data/         # Data retrieval
│       └── gemini-insights/  # AI insights
├── components/
│   ├── csv-uploader.tsx     # Upload component
│   ├── data-dashboard.tsx   # Main dashboard
│   ├── data-preview.tsx     # Data table
│   ├── chart-section.tsx    # Visualizations
│   ├── statistics-section.tsx  # Stats display
│   └── insights-section.tsx    # AI insights
├── lib/
│   └── data-processor.ts   # Data processing utilities
└── public/
    └── uploads/            # Uploaded files
\`\`\`

## Configuration

### CSV Processing
- PapaParse handles CSV parsing
- Automatic type detection (numeric vs string)
- Support for large files

### Visualizations
- Plotly.js for interactive charts
- Responsive chart sizing
- Hover tooltips and legends

### AI Insights
- Gemini 2.0 Flash model
- 1000 token limit per insight
- Temperature: 0.7 for balanced responses

## API Endpoints

### POST /api/upload
Upload a CSV file and return parsed data.

### GET /api/data
Retrieve the latest uploaded dataset.

### POST /api/gemini-insights
Generate AI insights from data.

## Environment Variables

\`GEMINI_API_KEY\` - Gemini API key (auto-configured by Vercel)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
\`\`\`
