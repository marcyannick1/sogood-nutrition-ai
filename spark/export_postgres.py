from pyspark.sql import SparkSession

INPUT_PATH = "/opt/project/data/processed/products_parquet"

POSTGRES_URL = "jdbc:postgresql://postgres:5432/sogood_db"

POSTGRES_PROPERTIES = {
    "user": "sogood",
    "password": "sogood",
    "driver": "org.postgresql.Driver"
}


def create_spark():

    spark = (
        SparkSession.builder
        .appName("SoGoodExport")
        .master("spark://spark-master:7077")
        .getOrCreate()
    )

    return spark


def main():

    spark = create_spark()

    df = spark.read.parquet(INPUT_PATH)

    # -------------------
    # PRODUCTS
    # -------------------

    df.write.jdbc(
        url=POSTGRES_URL,
        table="products",
        mode="overwrite",
        properties=POSTGRES_PROPERTIES
    )

    # -------------------
    # BRANDS
    # -------------------

    brands_df = df.select("brands").distinct()

    brands_df.write.jdbc(
        url=POSTGRES_URL,
        table="brands",
        mode="overwrite",
        properties=POSTGRES_PROPERTIES
    )

    # -------------------
    # CATEGORIES
    # -------------------

    categories_df = df.select("categories").distinct()

    categories_df.write.jdbc(
        url=POSTGRES_URL,
        table="categories",
        mode="overwrite",
        properties=POSTGRES_PROPERTIES
    )

    # -------------------
    # STATS
    # -------------------

    stats_df = df.groupBy("nutriscore_grade").count()

    stats_df.write.jdbc(
        url=POSTGRES_URL,
        table="stats",
        mode="overwrite",
        properties=POSTGRES_PROPERTIES
    )

    print("All tables exported")

    spark.stop()


if __name__ == "__main__":
    main()