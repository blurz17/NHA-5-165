"""FastAPI main application entrypoint."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import APP_NAME, APP_VERSION, ALLOWED_ORIGINS
from .schemas import (
    PredictionRequest, PredictionResponse,
    OptimizationRequest, OptimizationResponse,
    HealthResponse
)
from .service import service

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Building Energy Efficiency Heating & Cooling Load Prediction API. Deployed on Heroku, integrated with Vercel Frontend.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Vercel and local React applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["General"])
def root():
    return {
        "app": APP_NAME,
        "version": APP_VERSION,
        "status": "online",
        "documentation": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health", response_model=HealthResponse, tags=["General"])
def health_check():
    return HealthResponse(
        status="ok",
        version=APP_VERSION,
        models_loaded=service.is_loaded,
        algorithms_available=[
            "Linear Regression",
            "Decision Tree",
            "Random Forest",
            "Gradient Boosting",
            "XGBoost"
        ]
    )


@app.post("/api/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_loads(request: PredictionRequest):
    try:
        return service.predict(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.post("/api/optimize", response_model=OptimizationResponse, tags=["Optimization"])
def optimize_design(request: OptimizationRequest):
    try:
        return service.optimize(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization error: {str(e)}")


@app.get("/api/models", tags=["Model Registry"])
def list_models():
    return {
        "total_models": 10,
        "algorithms": ["Linear Regression", "Decision Tree", "Random Forest", "Gradient Boosting", "XGBoost"],
        "targets": ["Heating_Load", "Cooling_Load"],
        "benchmarks": service.get_models_metadata()
    }
