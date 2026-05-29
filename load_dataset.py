import kagglehub
import os
import shutil

BASE_DIR = os.path.expanduser("~/projects/PredictiveMaintenanceSystem")
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

os.makedirs(DATASET_DIR, exist_ok=True)

temp_path = kagglehub.dataset_download(
    "shivamb/machine-predictive-maintenance-classification"
)

# переносим файлы вручную
shutil.copytree(temp_path, DATASET_DIR, dirs_exist_ok=True)

print("Dataset moved to:", DATASET_DIR)