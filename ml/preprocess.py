from pyspark.sql import SparkSession
from pyspark.sql.functions import col
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_PATH = os.path.join(BASE_DIR, "data/processed/products_clean.parquet")


def load_data():
    spark = SparkSession.builder.getOrCreate()

    df = spark.read.parquet(INPUT_PATH)

    # ----------------------------
    # CLEAN DATASET ML
    # ----------------------------
    df = df.select(
        col("fat").cast("double"),
        col("sugars").cast("double"),
        col("salt").cast("double"),
        col("additives_count").cast("double"),
        col("nova_group").cast("double"),
        col("nutriscore_grade")
    ).dropna()

    # ----------------------------
    # LABEL ENCODING
    # ----------------------------
    label_map = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4}

    pdf = df.toPandas()
    pdf = pdf[pdf["nutriscore_grade"].isin(label_map.keys())]

    pdf["label"] = pdf["nutriscore_grade"].map(label_map)

    features = ["fat", "sugars", "salt", "additives_count", "nova_group"]

    X = pdf[features].values
    y = pdf["label"].values

    return X, y, features