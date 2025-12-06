# import httpx

# token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIrMjQzIDgxIDIzNCA1Njc4IiwiaXNzIjoic2FsZXNmbG93LWFwcCIsInJvbGUiOiJVU0VSIiwidXNlcm5hbWUiOiJqZWFubmVfZHJjIiwiaWF0IjoxNzY1MDE5MzY1LCJleHAiOjE3NjUwMjI5NjV9.O4FhFFcmqn-e5iedhcAsbfEHZRMUq6q2rneLrGP0YcU"

# res = httpx.get(
#     "http://localhost:8080/api/v1/sales/history?days=90",
#     headers={"Authorization": f"Bearer {token}"}
# )

# print(res.status_code)
# print(res.text)
import httpx

try:
    r = httpx.get("http://localhost:8080/api/v1", timeout=5)
    print(r.status_code, r.text)
except Exception as e:
    print("ERROR:", e)

