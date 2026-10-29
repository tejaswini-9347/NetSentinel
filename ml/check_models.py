
from pathlib import Path
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = PROJECT_DIR / "dataset" / "KDDTest+.txt"
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

data = pd.read_csv(DATA_FILE, header=None)
X_test = data.iloc[:, :41].copy()
X_test.columns = FEATURE_NAMES

labels = data.iloc[:, 41].astype(str).str.strip()
y_test = (labels.str.lower() != "normal").astype(int)

for name in ["svm_model", "decision_tree_model"]:
    model_path = MODEL_DIR / f"{name}.pkl"
    model = joblib.load(model_path)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    print(f"\n{name}")
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print("First 10 predictions:", predictions[:10].tolist())
    print("First 10 actual labels:", y_test.iloc[:10].tolist())
