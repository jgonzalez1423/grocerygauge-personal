# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import matplotlib
# matplotlib.use('Agg')
# import matplotlib.pyplot as plt
# import pandas as pd
# import base64
# from io import BytesIO
# import mysql.connector
# from datetime import datetime

# app = Flask(__name__)
# CORS(app)

# # MySQL connection
# db = mysql.connector.connect(
#     host='localhost',
#     user='django_user',
#     password='Anaboeing787',
#     database='kroger_db'
# )

# def fetch_price_history(product_id):
#     cursor = db.cursor()
#     query = """
#         SELECT price, timestamp
#         FROM products_pricehistory
#         WHERE product_id = %s
#         ORDER BY timestamp ASC
#     """
#     cursor.execute(query, (product_id,))
#     rows = cursor.fetchall()
#     cursor.close()
#     return pd.DataFrame(rows, columns=['price', 'timestamp'])

# @app.route('/generate-plot')
# def generate_plot():
#     product_id = request.args.get('product_id')
#     if not product_id:
#         return jsonify({"error": "Missing product_id"}), 400

#     df = fetch_price_history(product_id)
#     if df.empty:
#         return jsonify({"image": None})  # No data to plot

#     df['timestamp'] = pd.to_datetime(df['timestamp'])

#     plt.figure(figsize=(8, 4))
#     plt.plot(df['timestamp'], df['price'], marker='o', color='black', label='Actual Price')
#     plt.fill_between(df['timestamp'], df['price'], color='lightgray', alpha=0.5)

#     plt.title("Price Trend")
#     plt.xlabel("Date")
#     plt.ylabel("Price ($)")
#     plt.xticks(rotation=45)
#     plt.grid(axis='y')
#     plt.legend()
#     plt.tight_layout()

#     buf = BytesIO()
#     plt.savefig(buf, format='png')
#     buf.seek(0)
#     img_base64 = base64.b64encode(buf.read()).decode('utf-8')
#     plt.close()

#     return jsonify({"image": img_base64})

# if __name__ == '__main__':
#     app.run(debug=True,port=5001)