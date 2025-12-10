import httpx

# Test avec des endpoints qui existent
endpoints = [
    "http://10.131.175.145:8080/api/v1/products",
    "http://10.131.175.145:8080/api/v1/inventory",
    "http://10.131.175.145:8080/api/v1/sales",
    "http://10.131.175.145:8080/api/v1/auth/login"
    "http://10.131.175.145:8080/actuator/health"
]

for url in endpoints:
    try:
        print(f"\nTesting: {url}")
        r = httpx.get(url, timeout=3)
        print(f"✅ Response: {r.status_code}")
        if r.status_code == 401:
            print("   (401 is OK - needs authentication)")
    except Exception as e:
        print(f"❌ Error: {type(e).__name__}")