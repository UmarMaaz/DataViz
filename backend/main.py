from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io
import json
from typing import Dict, Any, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Data Analysis Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataAnalyzer:
    @staticmethod
    def parse_csv(file_content: bytes) -> pd.DataFrame:
        """Parse CSV file and return DataFrame"""
        try:
            df = pd.read_csv(io.BytesIO(file_content))
            return df
        except Exception as e:
            logger.error(f"CSV parsing error: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")

    @staticmethod
    def calculate_statistics(df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate comprehensive statistics for numeric columns"""
        stats = {}
        
        for col in df.select_dtypes(include=[np.number]).columns:
            stats[str(col)] = {
                "count": int(df[col].count()),
                "mean": float(df[col].mean()),
                "std": float(df[col].std()),
                "min": float(df[col].min()),
                "25%": float(df[col].quantile(0.25)),
                "50%": float(df[col].quantile(0.50)),
                "75%": float(df[col].quantile(0.75)),
                "max": float(df[col].max()),
            }
        
        return stats

    @staticmethod
    def get_column_info(df: pd.DataFrame) -> Dict[str, Any]:
        """Get detailed information about each column"""
        info = {}
        
        for col in df.columns:
            col_data = df[col]
            info[str(col)] = {
                "type": str(col_data.dtype),
                "non_null": int(col_data.count()),
                "null": int(col_data.isna().sum()),
                "unique": int(col_data.nunique()),
                "memory_usage": float(col_data.memory_usage(deep=True)) / 1024,  # KB
            }
        
        return info

    @staticmethod
    def get_correlation_matrix(df: pd.DataFrame) -> List[List[float]]:
        """Calculate correlation matrix for numeric columns"""
        numeric_df = df.select_dtypes(include=[np.number])
        
        if numeric_df.shape[1] < 2:
            return []
        
        correlation = numeric_df.corr().values.tolist()
        return correlation

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and analyze CSV file"""
    try:
        content = await file.read()
        
        # Parse CSV
        df = DataAnalyzer.parse_csv(content)
        
        # Calculate statistics
        statistics = DataAnalyzer.calculate_statistics(df)
        column_info = DataAnalyzer.get_column_info(df)
        correlation = DataAnalyzer.get_correlation_matrix(df)
        
        return JSONResponse({
            "success": True,
            "filename": file.filename,
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "statistics": statistics,
            "column_info": column_info,
            "correlation": correlation,
            "sample_data": df.head(10).to_dict(orient='records'),
        })
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_data(payload: Dict[str, Any]):
    """Analyze data and return insights"""
    try:
        data = payload.get("data", {})
        statistics = payload.get("statistics", {})
        
        insights = {
            "columns_analyzed": len(statistics),
            "total_data_points": sum([stat.get("count", 0) for stat in statistics.values()]),
            "data_quality": "Good" if all([stat.get("count", 0) > 0 for stat in statistics.values()]) else "Needs attention",
        }
        
        return JSONResponse(insights)
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
