import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Simulate 100 days of grocery prices
np.random.seed(42)
days = np.arange(1, 101)
prices = 10 + np.sin(days / 10) * 5 + np.random.normal(0, 1, 100)  # Sinusoidal price pattern + noise

# Convert to DataFrame
df = pd.DataFrame({'Day': days, 'Price': prices})
df['Day'] = df.index + 1  # Ensure sequential days

# print(df.to_string())  # View sample data

def compute_ema(prices, span=10):
    return prices.ewm(span=span, adjust=False).mean()

df['EMA_10'] = compute_ema(df['Price'], span=10)

# Plot price vs. EMA
plt.figure(figsize=(10,5))
plt.plot(df['Day'], df['Price'], label="Actual Price", alpha=0.5)
plt.plot(df['Day'], df['EMA_10'], label="EMA (10 Days)", linestyle="dashed", color='red')
plt.legend()
plt.xlabel("Days")
plt.ylabel("Price")
plt.title("Price Trend with Exponential Moving Average")
plt.show()
