import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from pytorch_tabnet.tab_model import TabNetClassifier
import joblib
from preprocess import load_data


def main():

    X, y, features = load_data()

    # ----------------------------
    # SPLIT
    # ----------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # ----------------------------
    # SCALING (IMPORTANT pour TabNet)
    # ----------------------------
    scaler = StandardScaler()

    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    joblib.dump(scaler, "model/scaler.pkl")

    # ----------------------------
    # MODEL TABNET
    # ----------------------------
    model = TabNetClassifier(
        n_d=32,
        n_a=32,
        n_steps=5,
        gamma=1.5,
        lambda_sparse=1e-4,
        optimizer_params=dict(lr=2e-2),
        mask_type="entmax"
    )

    print("Training TabNet...")

    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        eval_metric=["accuracy"],
        max_epochs=100,
        patience=15,
        batch_size=1024,
        virtual_batch_size=128
    )

    model.save_model("model/tabnet_model")

    # ----------------------------
    # EVAL
    # ----------------------------
    preds = model.predict(X_test)

    acc = (preds == y_test).mean()
    print(f"Accuracy: {acc:.4f}")


if __name__ == "__main__":
    main()