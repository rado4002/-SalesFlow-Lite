# import httpx

# token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIrMjQzIDgxIDIzNCA1Njc4IiwiaXNzIjoic2FsZXNmbG93LWFwcCIsInJvbGUiOiJVU0VSIiwidXNlcm5hbWUiOiJqZWFubmVfZHJjIiwiaWF0IjoxNzY1MDE5MzY1LCJleHAiOjE3NjUwMjI5NjV9.O4FhFFcmqn-e5iedhcAsbfEHZRMUq6q2rneLrGP0YcU"

# res = httpx.get(
#     "http://localhost:8080/api/v1/sales/history?days=90",
#     headers={"Authorization": f"Bearer {token}"}
# )

# print(res.status_code)
# print(res.text)
# test_health.py
import httpx
try:
    r = httpx.get("http://localhost:8080/actuator/health", timeout=5)
    print(f"Java is ALIVE: {r.status_code} → {r.json()}")
except Exception as e:
    print(f"Java is DOWN: {type(e).__name__}: {e}")
