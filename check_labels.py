
from pathlib import Path
import pandas as pd

project_dir = Path(__file__).resolve().parent
dataset_dir = project_dir / "dataset"

for filename in ["KDDTrain+.txt", "KDDTest+.txt"]:
    path = dataset_dir / filename
    data = pd.read_csv(path, header=None)

    labels = data.iloc[:, 41].astype(str).str.strip()

    print("\n" + "=" * 50)
    print(filename)
    print("Total records:", len(data))
    print("\nOriginal label counts:")
    print(labels.value_counts().head(25).to_string())

    binary_labels = labels.str.lower().eq("normal").map({
        True: "Normal",
        False: "Intrusion"
    })

    print("\nBinary class counts:")
    print(binary_labels.value_counts().to_string())
