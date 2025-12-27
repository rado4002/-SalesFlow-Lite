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

| Category              | Technology                          | Purpose                                                                 |
|-----------------------|-------------------------------------|-------------------------------------------------------------------------|
| **Frontend**          | React + Vite + TypeScript           | Fast, component-based UI with type safety                              |
| **Styling**           | Tailwind CSS                        | Responsive, mobile-first design with utility classes                    |
| **Data Fetching**     | TanStack Query (React Query)        | Caching, loading states, and optimistic updates for spotty connections  |
| **Forms & Validation**| React Hook Form + Zod               | Simple, performant forms with schema validation                         |
| **Offline Support**   | IndexedDB / localForage + PWA       | Offline sales entry and sync on reconnect                               |
| **Internationalization** | react-i18next                    | Multilingual UI (English, French, Lingala, Swahili)                     |
| **Core Backend**      | Java 17 + Spring Boot 3             | Transactional System of Record (sales, stock, auth)                     |
| **Security**          | Spring Security + JJWT              | JWT authentication and role-based access                                |
| **Persistence**       | Spring Data JPA + Hibernate         | Clean database access with entities                                     |
| **Database**          | PostgreSQL (prod) / H2 (dev)         | Reliable production storage + fast local testing                        |
| **Migrations**        | Flyway                              | Version-controlled schema changes                                       |
| **API Docs**          | springdoc-openapi                   | Automatic Swagger UI for endpoints                                      |
| **Analytics Backend** | Python + FastAPI                    | Fast analytics, ML, Excel import, and reporting pipelines               |
| **Data Processing**   | Pandas + Scikit-learn               | Analytics computations and forecasting                                   |
| **Caching**           | Redis                     | Cache-aside for dashboard performance                                   |
| **Deployment**        | Docker + docker-compose             | Consistent local/prod environments                                      |
| **Build Tools**       | Maven (Java) / npm (Frontend)       | Dependency management and packaging                                     |
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


## 📊 TASK DISTRIBUTION - SALESFLOW-LITE PROJECT

| ID | Module/Component | Responsible | Status | Date |
|----|------------------|-------------|--------|------|
| **PHASE 1: SOFTWARE PROCESS** | **SOFTWARE PROCESS(entire process)** | **BILUGE MOISE 比路** | ✅ Completed | 2025-09-27 |
| **PHASE 2: REQUIREMENTS PROCESS** | **R.ELICITATION** | **VOLDI BOKANGA 少坎** | ✅ Completed  | 2025-10-02 |
| **PHASE 2: REQUIREMENTS PROCESS** | **R.ANALYSIS** | **BILUGE MOISE 比路** | ✅ Completed | 2025-10-02 |
| **PHASE 2: REQUIREMENTS PROCESS** | **R.VALIDATION** | **VOLDI BOKANGA 少坎** | ✅ Completed  | 2025-10-02 |
| **PHASE 3: REQUIREMENTS** | **REQUIREMENTS** | **BILUGE MOISE 比路** | ✅ Completed  | 2025-10-02 |
| **PHASE 4: ARCHITECTURE** | **ARCHITECTURE** | **BOTH**| ✅ Completed | 2025-10-13 |

---

## 🛠️ Getting Started

```bash
git clone https://github.com/rado4002/-SalesFlow-Lite.git
cd -SalesFlow-Lite
npm install     # frontend dependencies (React)
# backend setup (Java / Python) instructions to come
npm start       # launch dev frontend
