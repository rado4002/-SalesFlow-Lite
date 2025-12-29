# SalesFlow Lite

**A user-centered sales & inventory tool for small merchants**  

SalesFlow Lite is a lightweight sales and inventory management tool designed for small businesses and merchants.  
It enables product tracking, sales recording, stock monitoring, and reporting — all in a simple, offline-friendly interface.  
The system supports multiple languages and is built with modularity for easy future extensions.

---
## 🧭 Software Process
Our project follows a **Hybrid Plan-Driven + Iterative** process.

### Phase 1: Plan-Driven Design

We followed a **Design Thinking** cycle to build this product:

- **Empathize**: Interviewed merchants and stakeholders to uncover real pain points in daily sales and inventory work  
- **Define**: Mapped personas, problems, and needs (e.g. “quick entry”, “stock ruptures”, offline use)  
- **Ideate**: Brainstormed features and prioritized them (MVP first, advanced later)  
- **Prototype & Test**: Built small increments, got user feedback, iterated  
- **Implement**: Now building in modular layers (frontend, backends) guided by real user needs
  
### Phase 2: Iterative Development

Once the design is validated, we move into **iterative development cycles**, guided by Agile principles:

- Build → Test → Review → Improve
- Short sprints focused on incremental delivery
- Continuous integration, testing, and feedback
- Adaptation based on real user data


---

## 🚀 Requirements (MVP + Advanced)

## 🚀 Requirements Breakdown

### 🧩 MVP (Minimum Viable Product)
| Feature | Description |
|----------|--------------|
| **Product Management** | CRUD operations + stock tracking |
| **Sales Entry** | Quick form, auto calculations |
| **Dashboard & Analytics** | Daily totals, top products, stock status |
| **Stock Alerts** | Notifies when inventory is low |
| **Data Export** | Export to CSV |

### 💡 Advanced Features
| Feature | Description |
|----------|--------------|
| **Offline Support** | Work without internet, sync when online |
| **Multilingual UI** | Languages: English, French, Lingala, Swahili |
| **External Data Analysis** | Import Excel documents (XLSX/CSV), merge with system data, run insights & comparative reports |
ML forecasting  | 7-day sales predictions & anomaly detection |
---
## 🛠️ Technology Stack

SalesFlow-Lite uses modern, lightweight technologies chosen for reliability, offline capability, mobile-first design, and easy maintenance.

| Component                  | Technology                              | Responsibility |
|----------------------------|-----------------------------------------|----------------|
| **Frontend**               | React + Vite + TypeScript + Tailwind CSS | Multilingual UI, offline mode, real-time dashboards, mobile-first design |
| **Core Backend (SoR)**     | Java 17 + Spring Boot 3                 | Business logic: CRUD, sales processing, stock management, authentication |
| **Analytics Backend (SoI)**| Python + FastAPI                        | Analytics, ML forecasting, Excel import/export, reporting |
| **Database**               | PostgreSQL                              | Persistent storage for products, sales, users, stock movements |
| **Optional Cache**         | Redis                                   | Performance optimization for frequent analytics queries |
---
## 🛠 Design Patterns
| Pattern              | Usage & Why It Matters                                                                 |
|----------------------|----------------------------------------------------------------------------------------|
| **Client–Server**    | React frontend as client, Java & Python as REST servers. Clear separation, stateless APIs, easy scaling. |
| **Layered Architecture** | Consistent layering in every part:<br>• Frontend: UI → API services → types<br>• Java: Controller → Service → Repository<br>• Python: Routes → Services → Integration/Infra |
| **DTO / Schema Pattern** | Explicit contracts: Java DTOs, Python Pydantic models, TypeScript interfaces. Prevents leakage, enforces validation, makes refactoring safe. |
| **Facade**           | Simplifies complex subsystems:<br>• Frontend API services (axios wrappers) hide backend details<br>• Python cache manager + Java clients hide infrastructure |
| **Adapter**          | Normalizes differences: camelCase ↔ snake_case mapping, JWT/payload normalization between layers. |
| **Proxy**            | Python acts as processing proxy to Java (System of Record).<br>Redis acts as read proxy (cache-aside pattern). |
| **Dependency Injection** | FastAPI `Depends()`, Spring `@Autowired`/constructor injection, React Context/Providers (soft DI). Promotes testability and loose coupling. |

## [Click here for more detail on the documentation](https://github.com/rado4002/-SalesFlow-Lite/tree/main/docs#-salesflow-lite---documentation-hub)

## 📊 TASK DISTRIBUTION - SALESFLOW-LITE PROJECT

| ID | Module/Component | Responsible | Status | Date |
|----|------------------|-------------|--------|------|
| **PHASE 1: SOFTWARE PROCESS** | **SOFTWARE PROCESS(entire process)** | **BILUGE MOISE 比路** | ✅ Completed | 2025-09-27 |
| **PHASE 2: REQUIREMENTS PROCESS** | **R.ELICITATION** | **VOLDI BOKANGA 少坎** | ✅ Completed  | 2025-10-02 |
| **PHASE 2: REQUIREMENTS PROCESS** | **R.ANALYSIS** | **BILUGE MOISE 比路** | ✅ Completed | 2025-10-02 |
| **PHASE 2: REQUIREMENTS PROCESS** | **R.VALIDATION** | **VOLDI BOKANGA 少坎** | ✅ Completed  | 2025-10-02 |
| **PHASE 3: REQUIREMENTS** | **REQUIREMENTS** | **BILUGE MOISE 比路** | ✅ Completed  | 2025-10-02 |
| **PHASE 4: ARCHITECTURE** | **ARCHITECTURE** | **BOTH**| ✅ Completed | 2025-10-13 |
| **PHASE 4: ARCHITECTURE** | **ARCHITECTURE(4 view +1 and Design patterns)** | **BOTH**| ✅ Completed | 2025-12-01 |
| **PHASE 5: IMPLEMENTATION** | **PYTHON FAST API** | **VOLDI BOKANGA 少坎**| ✅ Completed | 2025-12-20 |
| **PHASE 5: IMPLEMENTATION** | **JAVA SPRINGBOOT** | **BILUGE MOISE 比路**| ✅ Completed | 2025-12-20 |
| **PHASE 5: IMPLEMENTATION** | **FRONTEND REACT** | **VOLDI BOKANGA 少坎**| ✅ Completed | 2025-12-20 |
| **PHASE 6: LOCAL DEPLOYEMENT** | **DOCKER** | **BOTH**| ✅ Completed | 2025-12-26 |


---

## 🛠️ Getting Started

## 📋 Prerequisites

### System Requirements
- **Node.js** v18+ 
- **npm** v9+ 
- **Docker** v24+ & **Docker Compose**
  
### Optional (for local development without Docker)
- **Java JDK 17+** (for Spring Boot backend)
- **Python 3.9+** (for ML services)
- **Maven** 3.8+ (for Java builds)

---

## 🐳 Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/rado4002/SalesFlow-Lite.git
cd SalesFlow-Lite/Shared

# Start all services (Frontend + Backends)
docker-compose up --build

# For detached mode (run in background)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```
## [Click here above to watch the full demo](https://www.bilibili.com/video/BV1ueBCBYEFY/?vd_source=85ee87274d95cc5e411f072f2f79f19d)
## [Click here above to watch the full demo 2](https://www.bilibili.com/video/BV1QtvpBKEP6/?vd_source=85ee87274d95cc5e411f072f2f79f19d)
