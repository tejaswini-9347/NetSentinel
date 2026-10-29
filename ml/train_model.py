
from pathlib import Path
import time

import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score
)

# --------------------------------------------------
# 1. Project paths
# --------------------------------------------------

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "dataset"
MODEL_DIR = PROJECT_DIR / "models"

TRAIN_FILE = DATA_DIR / "KDDTrain+.txt"
TEST_FILE = DATA_DIR / "KDDTest+.txt"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

# --------------------------------------------------
# 2. Dataset features
# --------------------------------------------------

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

CATEGORICAL_FEATURES = [
    "protocol_type", "service", "flag"
]

NUMERIC_FEATURES = [
    name for name in FEATURE_NAMES
    if name not in CATEGORICAL_FEATURES
]


# --------------------------------------------------
# 3. Load dataset
# --------------------------------------------------

def load_dataset(file_path):
    if not file_path.exists():
        raise FileNotFoundError(
            f"Dataset not found: {file_path}"
        )

    data = pd.read_csv(file_path, header=None)

    if data.shape[1] != 43:
        raise ValueError(
            f"{file_path.name}: expected 43 columns, "
            f"found {data.shape[1]}"
        )

    X = data.iloc[:, :41].copy()
    X.columns = FEATURE_NAMES

    labels = data.iloc[:, 41].astype(str).str.strip()

    # Normal = 0; all attack types = 1
    y = (labels.str.lower() != "normal").astype(int)

    return X, y


print("Loading NSL-KDD dataset...")

X_train, y_train = load_dataset(TRAIN_FILE)
X_test, y_test = load_dataset(TEST_FILE)

print("Training records:", len(X_train))
print("Testing records:", len(X_test))
print("Features:", X_train.shape[1])

print("\nTraining class distribution:")
print(y_train.value_counts().rename(index={
    0: "Normal",
    1: "Intrusion"
}))

print("\nTesting class distribution:")
print(y_test.value_counts().rename(index={
    0: "Normal",
    1: "Intrusion"
}))


# --------------------------------------------------
# 4. Preprocessing
# --------------------------------------------------

def create_pipeline(classifier):
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "numeric",
                StandardScaler(),
                NUMERIC_FEATURES
            ),
            (
                "categorical",
                OneHotEncoder(handle_unknown="ignore"),
                CATEGORICAL_FEATURES
            )
        ]
    )

    return Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])


# --------------------------------------------------
# 5. Define models and parameter searches
# --------------------------------------------------

model_configs = {
    "svm_model": {
        "pipeline": create_pipeline(
            LinearSVC(
                class_weight="balanced",
                max_iter=20000,
                random_state=42
            )
        ),
        "parameters": {
            "classifier__C": [0.01, 0.1, 1, 10]
        }
    },

    "decision_tree_model": {
        "pipeline": create_pipeline(
            DecisionTreeClassifier(
                class_weight="balanced",
                random_state=42
            )
        ),
        "parameters": {
            "classifier__max_depth": [10, 20, 30, None],
            "classifier__min_samples_leaf": [1, 2, 5, 10],
            "classifier__min_samples_split": [2, 10]
        }
    }
}

# Cross-validation uses training data only.
cv = StratifiedKFold(
    n_splits=3,
    shuffle=True,
    random_state=42
)


# --------------------------------------------------
# 6. Tune, evaluate and save
# --------------------------------------------------

results = []

for model_name, config in model_configs.items():
    print("\n" + "=" * 65)
    print("Tuning:", model_name)

    start_time = time.time()

    search = GridSearchCV(
        estimator=config["pipeline"],
        param_grid=config["parameters"],
        scoring="f1",
        cv=cv,
        n_jobs=-1,
        refit=True,
        verbose=1,
        error_score="raise"
    )

    search.fit(X_train, y_train)

    # GridSearchCV refits the best configuration
    # on the complete training dataset.
    best_model = search.best_estimator_

    # Evaluate only after model selection.
    predictions = best_model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)
    intrusion_f1 = f1_score(
        y_test, predictions, zero_division=0
    )

    print("\nBest parameters:")
    print(search.best_params_)

    print(
        f"Best cross-validation intrusion F1: "
        f"{search.best_score_ * 100:.2f}%"
    )

    print(f"Test accuracy: {accuracy * 100:.2f}%")
    print(f"Test intrusion F1: {intrusion_f1 * 100:.2f}%")

    print("\nClassification report:")
    print(classification_report(
        y_test,
        predictions,
        labels=[0, 1],
        target_names=["Normal", "Intrusion"],
        zero_division=0
    ))

    print("Confusion matrix:")
    print(confusion_matrix(
        y_test,
        predictions,
        labels=[0, 1]
    ))

    model_path = MODEL_DIR / f"{model_name}.pkl"
    joblib.dump(best_model, model_path)

    print("Saved:", model_path)
    print(f"Time taken: {time.time() - start_time:.1f} seconds")

    results.append({
        "Model": model_name,
        "Test Accuracy (%)": round(accuracy * 100, 2),
        "Intrusion F1 (%)": round(intrusion_f1 * 100, 2),
        "CV Intrusion F1 (%)": round(search.best_score_ * 100, 2),
        "Best Parameters": str(search.best_params_)
    })


# --------------------------------------------------
# 7. Compare the tuned models
# --------------------------------------------------

print("\n" + "=" * 65)
print("FINAL MODEL COMPARISON")

results_df = pd.DataFrame(results)
print(results_df.to_string(index=False))

print("\nBoth tuned pipelines have been saved.")
