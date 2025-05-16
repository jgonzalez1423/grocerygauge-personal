import mysql.connector
import random
from datetime import datetime, timedelta

# MySQL connection
conn = mysql.connector.connect(
    host="localhost",           # Change if needed
    user="django_user",
    password="Anaboeing787",
    database="kroger_db"
)
cursor = conn.cursor()

today = datetime.now()

# Loop over product IDs 998 down to 990
for product_id in range(998, 989, -1):
    product_code = f"test-prod-{product_id}"
    cursor.execute("""
        INSERT INTO products_product (id, product_id, name, brand, upc, current_price, last_updated)
        VALUES (%s, %s, %s, %s, %s, %s, NOW())
        ON DUPLICATE KEY UPDATE name = VALUES(name)  -- so it doesn't error if rerun
    """, (
        product_id,
        product_code,
        f"Test Product {product_id}",
        "Test Brand",
        f"00000000{product_id}",
        round(random.uniform(1.99, 6.99), 2)
    ))
    # Base price varies per product to make them unique
    base_price = round(random.uniform(1.99, 6.99), 2)

    for i in range(30):
        date = today - timedelta(days=29 - i)
        # Simulate small random fluctuation
        price = round(base_price + random.uniform(-0.20, 0.20), 2)

        cursor.execute("""
            INSERT INTO products_pricehistory (price, timestamp, product_id)
            VALUES (%s, %s, %s)
        """, (price, date, product_id))

    print(f"Inserted 30 price entries for product_id {product_id}")

conn.commit()
cursor.close()
conn.close()
print("Inserted synthetic price history for all product_ids")
