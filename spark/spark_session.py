from pyspark.sql import SparkSession


def create_spark_session():
    spark = (
        SparkSession.builder
        .appName("SoGoodFoodAnalytics")
        .master("spark://spark-master:7077")
        .config("spark.executor.instances", "3")
        .config("spark.executor.cores", "1")
        .config("spark.sql.shuffle.partitions", "8")
        .getOrCreate()
    )

    return spark
