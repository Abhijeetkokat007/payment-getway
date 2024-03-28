import requests

# Define your API credentials or tokens
API_KEY = 'your_api_key'
API_SECRET = 'your_api_secret'

# Define endpoint URLs
BASE_URL = 'https://api.rozopay.com'
PAYMENT_ENDPOINT = '/payment'
TOKEN_ENDPOINT = '/token'

# Function to generate an authentication token
def generate_token(api_key, api_secret):
    url = BASE_URL + TOKEN_ENDPOINT
    headers = {'Content-Type': 'application/json'}
    data = {
        'api_key': api_key,
        'api_secret': api_secret
    }

    response = requests.post(url, headers=headers, json=data)
    token = response.json().get('token')
    return token

# Function to process payment
def process_payment(token, amount, currency, description):
    url = BASE_URL + PAYMENT_ENDPOINT
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    data = {
        'amount': amount,
        'currency': currency,
        'description': description
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Main function to initiate payment
def initiate_payment(api_key, api_secret, amount, currency, description):
    token = generate_token(api_key, api_secret)
    if token:
        payment_response = process_payment(token, amount, currency, description)
        print(payment_response)
    else:
        print("Failed to generate token.")

# Example usage
if __name__ == "__main__":
    # Replace these with your actual API credentials and payment details
    API_KEY = 'your_api_key'
    API_SECRET = 'your_api_secret'
    AMOUNT = 100
    CURRENCY = 'USD'
    DESCRIPTION = 'Payment for XYZ'

    initiate_payment(API_KEY, API_SECRET, AMOUNT, CURRENCY, DESCRIPTION)
