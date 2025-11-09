# Data Analysis Backend

FastAPI-based backend for CSV data analysis and processing.

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Running the Server

\`\`\`bash
python main.py
\`\`\`

The server will start on `http://localhost:8000`

## API Endpoints

- `POST /upload` - Upload and analyze CSV file
- `POST /analyze` - Analyze data and return insights
- `GET /health` - Health check
