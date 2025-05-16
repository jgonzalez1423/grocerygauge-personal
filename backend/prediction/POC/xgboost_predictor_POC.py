import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from xgboost import XGBRegressor

# Generate synthetic grocery price data (100 days)
np.random.seed(42)
days = np.arange(1, 101)
prices = 10 + np.sin(days / 10) * 5 + np.random.normal(0, 1, 100)  # Sinusoidal price pattern + noise

df = pd.DataFrame({'Day': days, 'Price': prices})

# Create lag features (previous prices as predictors)
df['Lag_1'] = df['Price'].shift(1)
df['Lag_2'] = df['Price'].shift(2)
df['Lag_3'] = df['Price'].shift(3)
df.dropna(inplace=True)  # Remove NaN values caused by shifting

# Training data (Only use last 100 days)
X_train = df[['Lag_1', 'Lag_2', 'Lag_3']]
y_train = df['Price']

# Train XGBoost model
model = XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.2)
model.fit(X_train, y_train)

# Predictor Future Prices for Next 10 Days
future_days = 10
last_known_data = X_train.iloc[-1].values  # Last known 3 prices
future_predictions = []

for i in range(future_days):
    next_price = model.predict([last_known_data])[0]  # Predict next price
    future_predictions.append(next_price)
    
    # Shift data: Move forward in time
    last_known_data = np.roll(last_known_data, -1)
    last_known_data[-1] = next_price  # Add new prediction

# Extend DataFrame with Future Predictions
future_df = pd.DataFrame({
    'Day': np.arange(df['Day'].iloc[-1] + 1, df['Day'].iloc[-1] + future_days + 1),
    'Predicted_Price': future_predictions
})

# Plot Actual and Future Prices
plt.figure(figsize=(10,5))

# Plot actual prices (first 100 days)
plt.plot(df['Day'], df['Price'], label="Actual Price", color='black')

# Plot only future predictions (after day 100)
plt.plot(future_df['Day'], future_df['Predicted_Price'], label="XGBoost Future Prediction", linestyle="dotted", color='blue')

plt.legend()
plt.xlabel("Days")
plt.ylabel("Price")
plt.title("Price Trend & Future Predictions")
plt.show()
