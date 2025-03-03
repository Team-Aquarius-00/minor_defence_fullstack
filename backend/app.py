
import os
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error

app = Flask(__name__)
# CORS(app)  # Allow frontend to talk to backend
CORS(app, origins="http://localhost:8080", supports_credentials=True)

UPLOAD_FOLDER = 'uploads'
MODEL_PATH = 'model/final_model_60_noEps.keras'
n_steps = 60
future_days = 50

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

model = load_model(MODEL_PATH)


def create_sequences_multivariate(data, n_steps):
    X, y = [], []
    for i in range(len(data) - n_steps):
        X.append(data[i:i + n_steps])
        y.append(data[i + n_steps])
    return np.array(X), np.array(y)


def predict_future_multivariate(model, data, scaler, n_steps, future_days):
    predicted = []
    current_sequence = data[-n_steps:]

    for _ in range(future_days):
        prediction = model.predict(
            current_sequence.reshape(1, n_steps, 6), verbose=0)
        predicted.append(prediction[0])
        current_sequence = np.vstack([current_sequence[1:], prediction])

    predicted_array = np.array(predicted)
    predicted_prices = scaler.inverse_transform(predicted_array)
    return predicted_prices


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file and file.filename.endswith('.csv'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        df = pd.read_csv(filepath)

        feature_columns = ['Open', 'High', 'Low', 'Ltp', '% Change', 'Qty']
        data = df[feature_columns].values

        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data)

        X_test, y_test = create_sequences_multivariate(scaled_data, n_steps)

        predictions = model.predict(X_test)
        test_result_inverse = scaler.inverse_transform(predictions)
        test_result_close = test_result_inverse[:, 3]

        future_prices = predict_future_multivariate(
            model, scaled_data, scaler, n_steps, future_days)
        
        # Convert future prices to DataFrame
        future_df = pd.DataFrame(future_prices, columns=feature_columns)

        # Convert DataFrame to JSON format
        future_prices_json = future_df.to_dict(orient='records')
        
        #convert data to DataFrame
        data_df=pd.DataFrame(data, columns=feature_columns)
        
        #Convert DataFrame to JSON format
        data_df_json=data_df.to_dict(orient='records')

        metrics = {
            'mae_close': mean_absolute_error(y_test[:, 3], predictions[:, 3]),
            'r2_close': r2_score(y_test[:, 3], predictions[:, 3]),
            'mse_close': mean_squared_error(y_test[:, 3], predictions[:, 3]),
            'mae_all': mean_absolute_error(y_test, predictions),
            'r2_all': r2_score(y_test, predictions),
            'mse_all': mean_squared_error(y_test, predictions)
        }

        return jsonify({
            'metrics': metrics,
            'actual_prices': df['Ltp'].tolist(),
            'predicted_prices': test_result_close.tolist(),
            'future_prices': future_prices.tolist(),
            'future_days': future_days,
            'columns': feature_columns,
            # 'test_result_inverse':test_result_inverse,
            'future_prices_json':future_prices_json,
            'data_df_json':data_df_json
            
        })

    return jsonify({'error': 'Invalid file format'}), 400


if __name__ == '__main__':
    app.run(debug=True)
