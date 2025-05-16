import requests

# Replace these with your actual credentials from Kroger Developer Portal
CLIENT_ID = "grocerygauge-243261243034242f6863354a64535762396c68434f74357059664b714f58515633327a2f4a734c657243516864345865724a79396462476c444676759164103456257333400"
CLIENT_SECRET = "dfumzU6kRGFuQnUzyskG89AEW1biXGKScXPVO8fs"

# API endpoint for getting an access token
TOKEN_URL = "https://api.kroger.com/v1/connect/oauth2/token"

# Step 1: Get an Access Token
def get_access_token():
    payload = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "scope": "product.compact"
    }

    response = requests.post(TOKEN_URL, data=payload)

    if response.status_code == 200:
        access_token = response.json()["access_token"]
        print("✅ Access Token:", access_token)
        return access_token
    else:
        print("❌ Error Getting Token:", response.json())
        return None

# Step 2: Search for a Product
def search_product(access_token, search_term="milk", limit=2):
    url = f"https://api.kroger.com/v1/products?filter.term={search_term}&filter.limit={limit}"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print("✅ Product Data:", response.json())
    else:
        print("❌ Error Fetching Product Data:", response.json())

# Run the test
if __name__ == "__main__":
    token = get_access_token()
    if token:
        search_product(token, search_term="milk", limit=10)