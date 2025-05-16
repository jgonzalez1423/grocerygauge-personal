import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from xgboost import XGBRegressor

# Generate synthetic grocery price data (100 days)
np.random.seed(47)
days = np.arange(1, 101)
prices = 10 + np.sin(days / 10) * 5 + np.random.normal(0, 1, 100)  # Sinusoidal price pattern + noise

# Generate synthetic inflation data (e.g., 2% inflation per year with noise)
inflation_rate = 0.02  # 2% yearly inflation
inflation = 1 + inflation_rate * (days / 365)  # Gradual inflation increase

# Generate synthetic holiday sales impact (e.g., 5% price drop on holidays)
holiday_sales = np.where((days % 30 == 0), 0.95, 1)  # 5% discount on every 30th day

# Generate synthetic competitor pricing (some fluctuation around base price)
competitor_pricing = 10 + np.sin(days / 5) * 3

# Create DataFrame with additional features
df = pd.DataFrame({'Day': days, 'Price': prices, 'Inflation': inflation, 'Holiday_Sales': holiday_sales, 'Competitor_Pricing': competitor_pricing})

# Create lag features (previous prices as predictors)
df['Lag_1'] = df['Price'].shift(1)
df['Lag_2'] = df['Price'].shift(2)
df['Lag_3'] = df['Price'].shift(3)
df.dropna(inplace=True)  # Remove NaN values caused by shifting

# Training data (Only use last 100 days)
X_train = df[['Lag_1', 'Lag_2', 'Lag_3', 'Inflation', 'Holiday_Sales', 'Competitor_Pricing']]
y_train = df['Price']

# Train XGBoost model
model = XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.2)
model.fit(X_train, y_train)

# Predictor Future Prices for Next 10 Days (including external factors)
future_days = 10
last_known_data = X_train.iloc[-1].values  # Last known 3 prices + external factors
future_predictions = []

for i in range(future_days):
    # Simulate future inflation, holiday, and competitor pricing (this can be adjusted based on your data sources)
    future_inflation = inflation[-1] + inflation_rate * (i / 365)  # Incremental inflation
    future_holiday_sales = 1  # Assume no holiday sales for future predictions (or create your own model for this)
    future_competitor_pricing = competitor_pricing[-1] + np.random.normal(0, 1)  # Random competitor fluctuation

    # Append external factors to the input data for prediction
    future_data = np.array([last_known_data[0], last_known_data[1], last_known_data[2], future_inflation, future_holiday_sales, future_competitor_pricing])
    next_price = model.predict([future_data])[0]  # Predict next price
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
plt.title("Price Trend & Future Predictions with External Factors")
plt.show()
