
import pandas as pd
from pathlib import Path

# Find the project folder and training dataset
project_folder = Path(__file__).resolve().parent.parent
dataset_file = project_folder / "dataset" / "KDDTrain+.txt"

# Check whether the file exists
if not dataset_file.exists():
    print("ERROR: Training dataset file was not found.")
else:
    # NSL-KDD files do not contain a header row
    data = pd.read_csv(dataset_file, header=None)

    print("Dataset loaded successfully!")
    print("Number of rows:", data.shape[0])
    print("Number of columns:", data.shape[1])

    print("\nFirst 3 records:")
    print(data.head(3).to_string(index=False))

    # Column 42 contains the attack label
    print("\nMost common labels:")
    print(data.iloc[:, 41].value_counts().head(10))
