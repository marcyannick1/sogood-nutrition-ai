from pyspark.sql.functions import col, size, regexp_replace
from pyspark.sql.types import StructType, StructField, StringType, ArrayType, DoubleType
from spark_session import create_spark_session

INPUT_PATH = "/opt/project/data/raw/products.json"

OUTPUT_PATH = "/opt/project/data/processed/products_clean.parquet"


def transform_products():
    spark = create_spark_session()

    print("Lecture dataset OpenFoodFacts...")

    # Schéma minimal pour éviter l'inférence qui cause OutOfMemory
    schema = StructType([
        StructField("product_name_fr", StringType(), True),
        StructField("brands", StringType(), True),
        StructField("categories", StringType(), True),
        StructField("ingredients_text_fr", StringType(), True),
        StructField("nutriscore_grade", StringType(), True),
        StructField("nova_group", StringType(), True),
        StructField("image_url", StringType(), True),

        StructField("nutriments", StructType([
            StructField("sugars_100g", DoubleType(), True),
            StructField("salt_100g", DoubleType(), True),
            StructField("fat_100g", DoubleType(), True)
        ]), True),
        StructField("additives_tags", ArrayType(StringType()), True)
    ])

    df = (spark.read
          .schema(schema)
          .option("mode", "PERMISSIVE")
          .json(INPUT_PATH))

    # 👉 filtre FR uniquement
    df = df.filter(col("product_name_fr").isNotNull())

    df = df.repartition(100)

    print("Dataset chargé")

    # Colonnes utiles
    selected_df = df.select(
        col("product_name_fr").alias("product_name"),
        col("brands"),
        col("categories"),
        col("ingredients_text_fr").alias("ingredients_text"),
        col("nutriscore_grade"),
        col("nova_group"),
        col("image_url"),

        col("nutriments.sugars_100g").alias("sugars"),
        col("nutriments.salt_100g").alias("salt"),
        col("nutriments.fat_100g").alias("fat"),
        size(col("additives_tags")).alias("additives_count")
    )

    # Nettoyage
    clean_df = selected_df.filter(
        col("product_name").isNotNull()
    )

    # Suppression des null bytes (\0)
    string_cols = [
        "product_name",
        "brands",
        "categories",
        "ingredients_text",
        "nutriscore_grade",
        "nova_group",
        "image_url",
    ]

    for col_name in string_cols:
        clean_df = clean_df.withColumn(
            col_name,
            regexp_replace(col(col_name), "\x00", "")
        )

    print("Sauvegarde parquet...")

    clean_df.write.mode("overwrite").parquet(OUTPUT_PATH)

    print("Transformation terminée")


if __name__ == "__main__":
    transform_products()