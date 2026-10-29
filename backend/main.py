
from pathlib import Path
from backend.device_detection import discover_devices
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from backend.external_device_detection import (
    scan_bluetooth,
    scan_wifi_networks,
)

# Project paths
PROJECT_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = PROJECT_DIR / "models"

# Initialize API
app = FastAPI(
    title="Network Intrusion Detection API",
    description="API for classifying network traffic using ML models.",
    version="1.0.0",
)

# Allow the local React development server to connect.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://netsentinel-frontend-ng3f.onrender.com",
    "https://netsentinel-frontend-rg3f.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load trained models
svm_path = MODEL_DIR / "svm_model.pkl"
tree_path = MODEL_DIR / "decision_tree_model.pkl"

if not svm_path.exists() or not tree_path.exists():
    raise FileNotFoundError(
        "Trained models not found. Run ml/train_model.py first."
    )

models = {
    "svm": joblib.load(svm_path),
    "decision_tree": joblib.load(tree_path),
}


# Network features expected by the models
FEATURE_NAMES = [
    "duration", "protocol_type", "service", "flag",
    "src_bytes", "dst_bytes", "land", "wrong_fragment",
    "urgent", "hot", "num_failed_logins", "logged_in",
    "num_compromised", "root_shell", "su_attempted",
    "num_root", "num_file_creations", "num_shells",
    "num_access_files", "num_outbound_cmds",
    "is_host_login", "is_guest_login", "count", "srv_count",
    "serror_rate", "srv_serror_rate", "rerror_rate",
    "srv_rerror_rate", "same_srv_rate", "diff_srv_rate",
    "srv_diff_host_rate", "dst_host_count",
    "dst_host_srv_count", "dst_host_same_srv_rate",
    "dst_host_diff_srv_rate", "dst_host_same_src_port_rate",
    "dst_host_srv_diff_host_rate", "dst_host_serror_rate",
    "dst_host_srv_serror_rate", "dst_host_rerror_rate",
    "dst_host_srv_rerror_rate",
]


class TrafficRecord(BaseModel):
    model: str = Field(
        default="decision_tree",
        pattern="^(svm|decision_tree)$",
    )
    features: dict[str, str | int | float]


@app.get("/")
def home():
    return {
        "message": "Network Intrusion Detection API is running",
        "available_models": list(models.keys()),
    }


@app.get("/health")
def health():
    return {"status": "healthy", "models_loaded": list(models.keys())}


@app.post("/predict")
def predict(record: TrafficRecord):
    # Ensure that all 41 expected features are supplied.
    missing = [
        name for name in FEATURE_NAMES
        if name not in record.features
    ]
    extra = [
        name for name in record.features
        if name not in FEATURE_NAMES
    ]

    if missing or extra:
        raise HTTPException(
            status_code=422,
            detail={
                "missing_features": missing,
                "unexpected_features": extra,
            },
        )

    try:
        row = {name: record.features[name] for name in FEATURE_NAMES}
        traffic = pd.DataFrame([row], columns=FEATURE_NAMES)

        # Convert numeric inputs while retaining categorical fields.
        numeric_features = [
            name for name in FEATURE_NAMES
            if name not in ["protocol_type", "service", "flag"]
        ]

        for name in numeric_features:
            traffic[name] = pd.to_numeric(
                traffic[name], errors="raise"
            )

        prediction = int(models[record.model].predict(traffic)[0])
        label = "Intrusion" if prediction == 1 else "Normal"

        return {
            "model": record.model,
            "prediction": prediction,
            "label": label,
            "message": (
                "Potential intrusion detected"
                if prediction == 1
                else "Traffic classified as normal"
            ),
        }

    except (ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid feature value: {exc}",
        ) from exc
@app.get("/devices")
def get_devices():
    try:
        return discover_devices()
    except RuntimeError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc
    
@app.get("/devices/bluetooth")
def get_bluetooth_devices():
    return scan_bluetooth()

@app.get("/devices/wifi-networks")
def get_wifi_networks():
    return scan_wifi_networks()