import httpx
try:
    r = httpx.get("http://localhost:8080/actuator/health", timeout=5)
    print(f"Java is ALIVE: {r.status_code} → {r.json()}")
except Exception as e:
    print(f"Java is DOWN: {type(e).__name__}: {e}")