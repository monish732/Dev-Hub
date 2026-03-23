from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import numpy as np
import sys
import importlib

# Ensure models are in path
sys.path.append(os.getcwd())
try:
    whatif = importlib.import_module("07_whatif_simulator.predict")
    simulate_whatif = whatif.simulate_whatif
    what_if_loaded = True
except Exception as e:
    print(f"❌ Error loading What-If module: {e}")
    what_if_loaded = False

app = Flask(__name__)
# Enable CORS so the React frontend can communicate with this API
CORS(app)

# Load Model 01
MODEL_DIR = "01_health_predictor/model"
try:
    model1 = joblib.load(os.path.join(MODEL_DIR, "health_predictor_xgb.pkl"))
    le1 = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    feature_cols1 = joblib.load(os.path.join(MODEL_DIR, "feature_columns.pkl"))
    print("✅ Model 01 loaded successfully!")
except Exception as e:
    print(f"❌ Error loading Model 01: {e}")
    model1, le1, feature_cols1 = None, None, None

@app.route("/api/predict/disease", methods=["POST"])
def predict_disease():
    if model1 is None:
        return jsonify({"error": "Model 01 not loaded on server."}), 500

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON payload provided."}), 400

        features = []
        defaults = {
            "heart_rate": 75, "spo2": 97, "temperature": 36.6,
            "respiratory_rate": 16, "systolic_bp": 120,
            "diastolic_bp": 75, "hr_variability": 8,
        }

        for col in feature_cols1:
            val = data.get(col, defaults.get(col, 0))
            features.append(float(val))

        X = np.array([features])
        
        probabilities = model1.predict_proba(X)[0]
        predicted_idx = np.argmax(probabilities)
        predicted_condition = le1.inverse_transform([predicted_idx])[0]

        all_probs = {
            le1.inverse_transform([i])[0]: round(float(p), 4)
            for i, p in enumerate(probabilities)
        }

        response = {
            "predicted_condition": predicted_condition,
            "confidence": round(float(probabilities[predicted_idx]), 4),
            "all_probabilities": all_probs
        }

        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/predict/whatif", methods=["POST"])
def predict_whatif():
    if not what_if_loaded:
        return jsonify({"error": "Model 07 What-If not loaded."}), 500
        
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON payload provided."}), 400
            
        # The simulate_whatif function handles defaults if keys are missing
        result = simulate_whatif(data)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
