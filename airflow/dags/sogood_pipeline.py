from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
import os


# -------------------------
# 1. TRANSFORM DATA
# -------------------------
def transform():
    os.system("/spark/bin/spark-submit /opt/project/spark/transform_products.py")


# -------------------------
# 2. EXPORT POSTGRES
# -------------------------
def export():
    os.system("/spark/bin/spark-submit /opt/project/spark/export_postgres.py")


# -------------------------
# 3. TRAIN ML MODEL
# -------------------------
def train():
    os.system("python /opt/project/ml/train.py")


# -------------------------
# DAG
# -------------------------
with DAG(
    dag_id="sogood_full_pipeline",
    start_date=datetime(2024, 1, 1),
    schedule="@daily",
    catchup=False
) as dag:

    t1 = PythonOperator(
        task_id="transform_products",
        python_callable=transform
    )

    t2 = PythonOperator(
        task_id="export_postgres",
        python_callable=export
    )

    t3 = PythonOperator(
        task_id="train_ml",
        python_callable=train
    )

    t1 >> t2 >> t3