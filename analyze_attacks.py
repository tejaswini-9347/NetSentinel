
from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import classification_report

PROJECT_DIR = Path(__file__).resolve().parent
DATA_DIR = PROJECT_DIR / "dataset"
MODEL_DIR = PROJECT_DIR / "models"

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
    "dst_host_srv_rerror_rate"
]

# Load the official test data.
data = pd.read_csv(DATA_DIR / "KDDTest+.txt", header=None)

X_test = data.iloc[:, :41].copy()
X_test.columns = FEATURE_NAMES

attack_names = data.iloc[:, 41].astype(str).str.strip()
y_test = (attack_names.str.lower() != "normal").astype(int)

# Difficulty score is intentionally not used.
for model_name in ["svm_model", "decision_tree_model"]:
    print("\n" + "=" * 65)
    print("MODEL:", model_name)

    model_path = MODEL_DIR / f"{model_name}.pkl"
    model = joblib.load(model_path)

    predictions = model.predict(X_test)

    print("\nOverall classification report:")
    print(classification_report(
        y_test,
        predictions,
        labels=[0, 1],
        target_names=["Normal", "Intrusion"],
        zero_division=0
    ))

    results = pd.DataFrame({
        "attack": attack_names,
        "actual_intrusion": y_test,
        "predicted_intrusion": predictions
    })

    # Analyze intrusion detection separately for each attack type.
    attacks = results[results["actual_intrusion"] == 1]

    summary = attacks.groupby("attack").agg(
        total=("actual_intrusion", "size"),
        detected=("predicted_intrusion", "sum")
    )

    summary["missed"] = summary["total"] - summary["detected"]
    summary["recall_percent"] = (
        summary["detected"] / summary["total"] * 100
    ).round(2)

    print("\nAttack types with the most missed records:")
    print(
        summary.sort_values("missed", ascending=False)
        .head(20)
        .to_string()
    )
