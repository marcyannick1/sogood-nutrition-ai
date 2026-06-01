from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from pytorch_tabnet.tab_model import TabNetClassifier

app = FastAPI()

# -------------------------
# LOAD MODEL
# -------------------------
model = TabNetClassifier()
model.load_model("../model/tabnet_model.zip")

scaler = joblib.load("../model/scaler.pkl")

# -------------------------
# INPUT SCHEMA
# -------------------------
class ProductInput(BaseModel):
    fat: float
    sugars: float
    salt: float
    additives_count: float
    nova_group: float


# -------------------------
# PREDICT ROUTE
# -------------------------
@app.post("/predict")
def predict(data: ProductInput):

    X = np.array([[
        data.fat,
        data.sugars,
        data.salt,
        data.additives_count,
        data.nova_group
    ]])

    X = scaler.transform(X)

    pred = model.predict(X)[0]

    label_map = {0:"a",1:"b",2:"c",3:"d",4:"e"}

    return {
        "prediction": label_map[int(pred)]
    }