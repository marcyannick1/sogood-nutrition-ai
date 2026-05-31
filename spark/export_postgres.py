from pyspark.sql import SparkSession
from pyspark.sql.functions import col, regexp_replace

INPUT_PATH = "/opt/project/data/processed/products_clean.parquet"

POSTGRES_URL = "jdbc:postgresql://postgres:5432/sogood_db"

POSTGRES_PROPERTIES = {
    "user": "sogood",
    "password": "sogood",
    "driver": "org.postgresql.Driver",
    "batchsize": "10000",
    "numPartitions": "8"
}


def create_spark():

    spark = (
        SparkSession.builder
        .appName("SoGoodExport")
        .master("spark://spark-master:7077")
        .config("spark.executor.instances", "3")
        .config("spark.executor.cores", "2")
        .config("spark.executor.memory", "4g")
        .config("spark.driver.memory", "2g")
        .config("spark.sql.shuffle.partitions", "100")
        .getOrCreate()
    )

    return spark


def main():

    spark = create_spark()

    df = spark.read.parquet(INPUT_PATH)

    # Remove null bytes from string columns
    string_cols = ["product_name", "brands", "categories", "ingredients_text", "nutriscore_grade", "nova_group"]
    for col_name in string_cols:
        if col_name in df.columns:
            df = df.withColumn(col_name, regexp_replace(col(col_name), "\x00", ""))

    # -------------------
    # PRODUCTS
    # -------------------

    df.repartition(8).write.jdbc(
        url=POSTGRES_URL,
        table="products",
        mode="overwrite",
        properties=POSTGRES_PROPERTIES
    )

    # -------------------
    # BRANDS
    # -------------------

    brands_df = df.select("brands").distinct()

    brands_df.coalesce(4).write.jdbc(
        url=POSTGRES_URL,
        table="brands",
        mode="overwrite",
        properties=POSTGRES_PROPERTIES
    )

    # -------------------
    # CATEGORIES
    # -------------------

    categories_df = df.select("categories").distinct()

    categories_df.coalesce(4).write.jdbc(
        url=POSTGRES_URL,
        table="categories",
        mode="overwrite",
        properties=POSTGRES_PROPERTIES
    )

    # -------------------
    # STATS
    # -------------------

    stats_df = df.groupBy("nutriscore_grade").count()

    stats_df.coalesce(2).write.jdbc(
        url=POSTGRES_URL,
        table="stats",
        mode="overwrite",
        properties=POSTGRES_PROPERTIES
    )

    print("All tables exported")

    spark.stop()


if __name__ == "__main__":
    main()