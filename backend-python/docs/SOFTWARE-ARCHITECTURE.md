# 🧠 SalesFlow-Lite — Backend Python Architecture

*(Final Academic & Defense-Ready Version)*

---

## 1️⃣ ARCHITECTURAL DECISIONS

### AD-01 — Separation of Responsibilities (Java vs Python)

**Decision**
Split responsibilities between two backends:

* Java = system of record
* Python = analytics, automation, ML, reporting

**Rationale**

* Java ensures transactional consistency and persistence
* Python enables fast iteration on analytics, ML, and automation

**Consequences**

* Clear ownership of data vs intelligence
* Python acts as a controlled processing proxy, not a data owner

---

### AD-02 — Pipeline-Oriented Backend Design

**Decision**
All major features are implemented as **explicit pipelines**.

**Identified Pipelines**

* Analytics Pipeline (**Sales Analytics**, **Stock Analytics**)
* ML Pipeline (**Forecast**, **Anomalies**)
* Excel Import Pipeline
* Reports Pipeline (job / polling / download)
* Alerting Pipeline (anomalies → email)

**Consequences**

* Easy to reason about flows
* Strong alignment with data engineering practices

---

### AD-03 — Cache-Aside Strategy with Fallback

**Decision**
Use Redis as primary cache with in-memory fallback.

**Rationale**

* Performance for analytics & reports
* Resilience if Redis is unavailable

**Consequences**

* Graceful degradation
* Deterministic TTL-based behavior

---

### AD-04 — Job-Based Reporting

**Decision**
Reports are generated via job IDs with status polling.

**Rationale**

* Report generation can be heavy
* Avoid blocking frontend requests

**Consequences**

* Explicit lifecycle: `queued → generating → completed`
* Downloadable artifacts stored on filesystem

---

### AD-05 — DEV vs PROD Execution Mode

**Decision**
Two execution modes:

* **DEV**: fake data + bypass auth
* **PROD**: JWT validation + Java integration

**Rationale**

* Fast local iteration
* Secure production behavior

---

## 2️⃣ 4+1 VIEW MODEL (KRUTCHEN)

---

## 🧩 1. LOGICAL VIEW

### Purpose

Describe **what the system is made of** (conceptually).

### Main Components

* `src/api/routes/`

  * `analytics.py` (**sales analytics + stock analytics**)
  * `ml.py` (**forecast + anomalies**)
  * `reports.py`
  * `excel.py`
  * `health.py`
* `src/services/`

  * analytics services
  * ML services
  * report services
* `src/clients/`

  * Java REST clients
* `src/data/`

  * cache manager
  * file processing
* `src/integration/`

  * JWT validation
* `src/models/`

  * Pydantic schemas

### Relationships

Routes → Services → (Java Clients / Cache / File System / JWT Validator)

<img width="938" height="607" alt="image" src="https://github.com/user-attachments/assets/a3c0c4e0-1b1c-4e39-8f28-b8eeac7c9fc3" />


---

## ⚙️ 2. PROCESS VIEW

### Purpose

Describe **runtime behavior and concurrency**.

### Observed Runtime Processes

* Async HTTP calls to Java (httpx)
* Redis cache access with TTL
* Report jobs with polling
* APScheduler background jobs
* Excel row-by-row validation

### Key Runtime Characteristics

* Non-blocking API calls
* Cache-aside pattern
* Background automation via scheduler

<img width="1557" height="737" alt="image" src="https://github.com/user-attachments/assets/efd8a21a-8aeb-4c2e-8a2f-1c2cbc392212" />


<img width="402" height="1655" alt="image" src="https://github.com/user-attachments/assets/09680433-2ae4-41b8-8ef2-234370ed57b4" />


---

## 🧱 3. DEVELOPMENT VIEW

### Purpose

Describe **code organization and modularity**.

### Code Structure

* Clear separation:

  * API layer (routes)
  * Business logic (services)
  * Integration (clients)
  * Infrastructure (cache, files)
  * Models (schemas)

### Technologies Used

* FastAPI, Pydantic
* httpx
* Redis
* pandas / numpy
* scikit-learn
* ReportLab, OpenPyXL
* APScheduler

<img width="1711" height="434" alt="image" src="https://github.com/user-attachments/assets/79b3743a-93c5-4a94-8893-4c4d366cd4b0" />

<img width="914" height="402" alt="image" src="https://github.com/user-attachments/assets/aae62116-6995-42ae-89d4-e6ef04483408" />


---

## 🌍 4. PHYSICAL VIEW

### Purpose

Describe **deployment topology**.

### Observed Local Deployment

* Frontend React: `localhost:5173 / 5174`
* Java Spring Boot: `localhost:8080`
* Python FastAPI: `localhost:8081`
* Redis: `localhost:6379`

### Configuration

* `.env` driven:

  * `DEV_MODE`
  * `JAVA_API_URL`
  * `JAVA_JWT_SECRET`
  * `REDIS_URL`
  * `SYSTEM_JWT_TOKEN`
  * `EXPORT_DIR`

<img width="440" height="389" alt="image" src="https://github.com/user-attachments/assets/2a8a5119-e33d-49f8-8856-dbf38af8cd67" />


---
## Main Use Cases

* UC1 — Authenticate (Java → JWT)
* UC2 — View Sales Analytics
* UC3 — View Stock Analytics
* UC4 — View Stock Alerts
* UC5 — Import Excel data
* UC6 — Generate PDF/Excel report
* UC7 — Schedule reports
* UC8 — Forecast sales (ML)
* UC9 — Detect anomalies + send alerts

## 4️⃣ DESIGN PATTERNS IDENTIFIED

*(Only patterns that are **observable and defensible**)*

### 1. Dependency Injection

* FastAPI `Depends(...)`
* Auth, mode detection, guards

### 2. Repository Pattern (Implicit)

* DEV fake data vs PROD Java clients
* Services are data-source agnostic

### 3. Strategy Pattern

* ML forecasting strategies
* Anomaly detection strategies

### 4. Facade Pattern

* Java clients
* Cache manager abstraction

### 5. Observer / Pub-Sub (Implicit)

* Cache-based job status tracking
* Prefix invalidation

### 6. Factory Pattern

* Report format → PDF / Excel generator

### 7. Adapter Pattern

* JWT normalization
* DTO / payload adaptation (camelCase ↔ snake_case)

### 8. Proxy Pattern

* Python as processing proxy to Java
* Redis as read proxy (cache-aside)

### 9. Middleware Pattern

* CORS
* Error handling
* Auth dependencies

### 10. Singleton (Implicit)

* Redis connection
* Settings object
* HTTP clients

---

## ✅ FINAL CONCLUSION

The **SalesFlow-Lite Python backend** is a:

* Modular
* Pipeline-oriented
* Cache-optimized
* Automation-driven architecture

It provides:

* **2 Analytics pipelines** (Sales + Stock)
* **1 ML pipeline** (Forecast + Anomalies)
* **1 Excel pipeline**
* **1 Reports pipeline** (job + polling + scheduler)
* **Robust integration** with Java as system of record

This architecture is **technically solid**, **academically defensible**, and **professionally credible**.
