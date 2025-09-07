import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

def healthCheck():
    response = requests.get(f"{BASE_URL}/healthCheck")
    return response.json()
