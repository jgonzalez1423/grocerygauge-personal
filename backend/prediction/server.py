from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import base64
from io import BytesIO
import mysql.connector
from datetime import datetime, timedelta
import numpy as np
from xgboost import XGBRegressor
import seaborn as sns

matplotlib.use('Agg')
app = Flask(__name__)
CORS(app)  # allow frontend requests

# MySQL connection
db = mysql.connector.connect(
    host='localhost', # Change to whereever MySQL DB server instance is running
    user='django_user',
    password='Anaboeing787',
    database='kroger_db'
)

def fetch_price_history(product_id):
    cursor = db.cursor()
    # Change interval as needed to fetch more or less data
    query = """
        SELECT price, timestamp
        FROM products_pricehistory
        WHERE product_id = %s AND timestamp >= NOW() - INTERVAL 30 DAY
        ORDER BY timestamp ASC
    """
    cursor.execute(query, (product_id,))
    rows = cursor.fetchall()
    cursor.close()
    return pd.DataFrame(rows, columns=['price', 'timestamp'])

@app.route('/generate-plot')
def generate_plot():
    product_id = request.args.get('product_id')
    if not product_id:
        return jsonify({"error": "Missing product_id"}), 400

    df = fetch_price_history(product_id)
    if df.empty or len(df) < 2:
        print("Not enough data to generate plot")
        return jsonify({"image": None})  # Not enough data

    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')

    # Preserve full data for actual trend
    full_actual_dates = df['timestamp'].copy()
    full_actual_prices = df['price'].copy()

    # Create lag features
    df['Lag_1'] = df['price'].shift(1)
    df['Lag_2'] = df['price'].shift(2)
    df.dropna(inplace=True)

    X = df[['Lag_1', 'Lag_2']]
    y = df['price']

    model = XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.2)
    model.fit(X, y)

    # Predict next 2 days
    last_known = X.iloc[-1].values
    future_predictions = []
    future_dates = []

    for i in range(2):
        pred = model.predict([last_known])[0]
        future_predictions.append(pred)

        next_date = full_actual_dates.iloc[-1] + pd.Timedelta(days=i + 1)
        future_dates.append(next_date)

        last_known = np.roll(last_known, -1)
        last_known[-1] = pred

    # --- Plot ---
    sns.set_style("whitegrid")
    plt.figure(figsize=(10, 5))

    # Actual prices
    plt.plot(full_actual_dates, full_actual_prices, label='Actual Price', marker='o', color='black')

    # Gradient fill under the actual line
    plt.fill_between(full_actual_dates, full_actual_prices, color='lightgrey', alpha=0.5)

    # Forecast line
    last_actual_date = full_actual_dates.iloc[-1]
    last_actual_price = full_actual_prices.iloc[-1]

    prediction_dates_full = [last_actual_date] + future_dates
    prediction_prices_full = [last_actual_price] + future_predictions

    plt.plot(prediction_dates_full, prediction_prices_full, linestyle='dotted', color='blue', label='Predicted Price')
    plt.scatter(future_dates, future_predictions, color='blue', marker='o')

    # Annotate the last predicted point
    final_pred_date = future_dates[-1]
    final_pred_price = future_predictions[-1]
    plt.annotate(f"${final_pred_price:.2f}\n{final_pred_date.strftime('%b %d')}",
                 xy=(final_pred_date, final_pred_price),
                 xytext=(10, -20),
                 textcoords='offset points',
                 arrowprops=dict(arrowstyle='->', color='blue'),
                 fontsize=9,
                 color='blue')

    # Dynamic y-axis
    mean_price = full_actual_prices.mean()
    plt.ylim(mean_price - 0.20, mean_price + 0.20)

    plt.title("Price Trend & 2-Day Forecast", fontsize=16)
    plt.xlabel("Date")
    plt.ylabel("Price ($)")
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()
    plt.grid(axis='x')

    # Save as base64
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    return jsonify({"image": img_base64})

if __name__ == '__main__':
    app.run(debug=True, port=5001)