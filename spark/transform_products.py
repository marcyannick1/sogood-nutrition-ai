from pyspark.sql.functions import col, size
from spark_session import create_spark_session

INPUT_PATH = "/opt/project/data/raw/openfoodfacts-products.jsonl.gz"

OUTPUT_PATH = "/opt/project/data/processed/products_clean.parquet"


def transform_products():
    spark = create_spark_session()

    print("Lecture dataset OpenFoodFacts...")

    df = spark.read.json(INPUT_PATH)

    df = df.repartition(8)

    print("Dataset chargé")

    # Colonnes utiles
    selected_df = df.select(
        col("product_name"),
        col("brands"),
        col("categories"),
        col("ingredients_text"),
        col("nutriscore_grade"),
        col("nova_group"),
        col("nutriments.sugars_100g").alias("sugars"),
        col("nutriments.salt_100g").alias("salt"),
        col("nutriments.fat_100g").alias("fat"),
        size(col("additives_tags")).alias("additives_count")
    )

    # Nettoyage
    clean_df = selected_df.filter(
        col("product_name").isNotNull()
    )

    print("Sauvegarde parquet...")

    clean_df.write.mode("overwrite").parquet(OUTPUT_PATH)

    print("Transformation terminée")


if __name__ == "__main__":
    transform_products()
