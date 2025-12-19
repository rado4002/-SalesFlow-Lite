```mermaid
graph TD
    %% ==================== OUR APPLICATION ====================
    subgraph OurApp[Our Analytics Application]
        PythonApp[Python Analytics Engine<br/>🧠 Intelligent Brain]
    end

    %% ==================== USERS ====================
    subgraph Users[Users]
        Manager[Business Manager<br/>📊 Makes decisions]
        Analyst[Data Analyst<br/>📈 Analyzes trends]
        Operator[Operator<br/>📥 Manages data]
    end

    %% ==================== CONNECTED SYSTEMS ====================
    subgraph ConnectedSystems[Connected Systems]
        BusinessSystem[Main Business System<br/>🏢 Manages products/sales]
        DataStorage[(Database<br/>💾 Permanent storage)]
        CacheSystem[Redis Cache<br/>⚡ Fast access]
        Notification[Notification System<br/>📧 Sends emails]
        FileSystem[File System<br/>📁 Excel/PDF/CSV]
    end

    %% ==================== INTERACTIONS ====================
    %% Users -> Our App
    Manager -->|Views dashboards| PythonApp
    Analyst -->|Requests forecasts| PythonApp
    Operator -->|Imports Excel files| PythonApp

    %% Our App -> Systems
    PythonApp -->|Gets business data| BusinessSystem
    PythonApp -->|Stores temporary results| CacheSystem
    PythonApp -->|Sends reports & alerts| Notification
    PythonApp -->|Reads/writes files| FileSystem

    %% Systems between themselves
    BusinessSystem -->|Saves data| DataStorage

    %% ==================== STYLES ====================
    style OurApp fill:#4caf50,color:black
    style Users fill:#2196f3,color:white
    style ConnectedSystems fill:#ff9800,color:black
    style PythonApp fill:#2e7d32,color:white
``` 
# relationships:

*  *🏢 Business System → For product/sales data*
*  *💾 Database → (via business system)*
*  *⚡ Redis Cache → For faster access*
*  *📧 Email System → To send alerts*
*  *📁 File System → To read/write Excel/PDF*
  
# **🏗️ SALES FLOW ARCHITECTURE**
```mermaid
graph TB
    F[Frontend React] --> P[Python FastAPI]
    F --> J[Java Spring Boot]
    P --> J
    J --> DB[(PostgreSQL)]
    
    style P fill:#4caf50
    style J fill:#2196f3
    style DB fill:#9c27b0
```
# *INTERACTION MODEL*

## **📊 SCÉNARIO 1: DASHBOARD TEMPS RÉEL**

### **🎯 Concept**
Dashboard qui montre les performances business en temps réel avec calculs analytics

### **🔄 Flux Réel**
```mermaid
sequenceDiagram
    participant F as Frontend
    participant P as Python FastAPI
    participant J as Java Spring Boot
    participant DB as PostgreSQL
    
    F->>P: GET /analytics/dashboard
    P->>J: GET /api/sales (ventes brutes)
    P->>J: GET /api/products (produits bruts)
    J->>DB: SELECT * FROM sales, products
    DB-->>J: Données brutes
    J-->>P: JSON des données
    P->>P: 🧠 CALCULS ANALYTICS
    Note over P: Total ventes, tendances, alertes stock
    P-->>F: DashboardDTO avec analytics
```

### **📦 Composants Python**
- **Package**: `src.services`
- **Module**: `analytics_service.py`
- **Classe**: `DashboardService`
- **Fonction**: `get_dashboard_data()`



---

## **🤖 SCÉNARIO 2: FORECASTING VENTES 7 JOURS**

### **🎯 Concept**
Prédire les ventes futures avec machine learning

### **🔄 Flux Réel**
```mermaid
sequenceDiagram
    participant F as Frontend
    participant P as Python FastAPI
    participant J as Java Spring Boot
    
    F->>P: POST /ml/forecast
    P->>J: GET /api/sales/history
    J-->>P: Historique ventes 90 jours
    P->>P: 🧠 ENTRAÎNEMENT MODÈLE ML
    P->>P: 🧠 PRÉDICTIONS 7 jours
    P-->>F: ForecastResultDTO
```

### **📦 Composants Python**
- **Package**: `src.services`
- **Module**: `ml_service.py`
- **Classe**: `ForecastingService`
- **Fonction**: `predict_sales()`



---

## **📁 SCÉNARIO 3: IMPORT/EXPORT EXCEL**

### **🎯 Concept**
Importer des données Excel, les valider et les envoyer à Java

### **🔄 Flux Réel**
```mermaid
sequenceDiagram
    participant F as Frontend
    participant P as Python FastAPI
    participant J as Java Spring Boot
    
    F->>P: POST /data/import (fichier Excel)
    P->>P: 📊 LECTURE FICHIER Excel
    P->>P: 🛡️ VALIDATION DONNÉES
    P->>P: 🔧 TRANSFORMATION
    P->>J: POST /api/products/bulk
    J-->>P: Confirmation création
    P-->>F: ImportResultDTO
```

### **📦 Composants Python**
- **Package**: `src.data`
- **Module**: `file_processor.py`
- **Classe**: `ExcelProcessor`
- **Fonction**: `process_import()`



---

## **📄 SCÉNARIO 4: RAPPORTS AUTOMATISÉS**

### **🎯 Concept**
Générer des rapports PDF/Excel avec analytics

### **🔄 Flux Réel**
```mermaid
sequenceDiagram
    participant S as Scheduler
    participant P as Python FastAPI
    participant J as Java Spring Boot
    
    S->>P: Générer rapport quotidien
    P->>J: GET /api/sales/daily
    P->>J: GET /api/products
    J-->>P: Données brutes
    P->>P: 📈 ANALYTICS AVANCÉES
    P->>P: 📊 CRÉATION PDF/Excel
    P->>P: 📧 ENVOI EMAIL
```

### **📦 Composants Python**
- **Package**: `src.services`
- **Module**: `report_service.py`
- **Classe**: `ReportGenerator`
- **Fonction**: `generate_daily_report()`



---

## **🚨 SCÉNARIO 5: SYSTÈME D'ALERTES INTELLIGENTES**

### **🎯 Concept**
Détecter automatiquement les anomalies business

### **🔄 Flux Réel**
```mermaid
sequenceDiagram
    participant S as Scheduler
    participant P as Python FastAPI
    participant J as Java Spring Boot
    
    S->>P: Vérifier alertes
    P->>J: GET /api/sales/recent
    P->>J: GET /api/stock/levels
    J-->>P: Données récentes
    P->>P: 🔍 DÉTECTION ANOMALIES
    P->>P: 📢 CRÉATION ALERTES
    P->>P: 📧 NOTIFICATIONS
```

### **📦 Composants Python**
- **Package**: `src.services`
- **Module**: `alert_service.py`
- **Classe**: `AlertSystem`
- **Fonction**: `check_business_alerts()`



---

## **✅ SUMMARY**

| Scénario | Java Spring Boot | Python FastAPI |
|----------|------------------|----------------|
| **Dashboard** | Données brutes | **Calculs analytics** |
| **Forecasting** | Historique ventes | **Machine Learning** |
| **Excel Import** | Sauvegarde données | **Validation + Transformation** |
| **Rapports** | Données brutes | **Analytics + Génération** |
| **Alertes** | Données récentes | **Détection anomalies** |

**Java = Source de vérité des données**  
**Python = Cerveau analytics/intelligence** 🧠

# *STRUCTURAL MODEL*
```mermaid
graph TD
    %% Relations principales entre composants
    Routes --> Services
    Services --> DataAccess
    Services --> Models
    DataAccess --> External[Java API]
    
    subgraph InternalStructure [Structure Interne]
        Routes[Routes FastAPI]
        Services[Services Métier]
        DataAccess[Accès Données]
        Models[Modèles DTO]
    end

    subgraph ExternalSystems [Systèmes Externes]
        External
        Redis[Cache Redis]
        Files[Système Fichiers]
    end

    DataAccess --> Redis
    DataAccess --> Files

    style InternalStructure fill:#e3f2fd,color:black
    style ExternalSystems fill:#f3e5f5,color:black
```

```mermaid
classDiagram
    %% ==================== COUCHE PRÉSENTATION ====================
    class AnalyticsRoute {
        - dashboard_service: DashboardService
        + get_dashboard_data() DashboardDTO
        + get_stock_alerts() List[StockAlert]
        + get_top_products() List[ProductPerformance]
    }

    class MLRoute {
        - forecasting_service: ForecastingService
        + predict_sales(product_id, days) ForecastResultDTO
        + detect_anomalies() List[Anomaly]
    }

    class DataRoute {
        - excel_processor: ExcelProcessor
        + import_excel_file(file) ImportResultDTO
        + export_csv_data() FileResponse
    }

    %% ==================== COUCHE MÉTIER ====================
    class DashboardService {
        - java_client: JavaClient
        - cache_manager: CacheManager
        + calculate_daily_revenue(sales_data) float
        + detect_low_stock_products(products) List[StockAlert]
        + analyze_sales_trends(sales_data) TrendAnalysis
        + get_top_performing_products() List[ProductPerformance]
    }

    class ForecastingService {
        - model: LinearRegression
        - java_client: JavaClient
        + train_model(historical_data) bool
        + predict_sales(product_id, days) List[float]
        + calculate_confidence() float
        + prepare_ml_data(raw_data) ProcessedData
    }

    class ReportService {
        - pdf_generator: PDFGenerator
        - email_service: EmailService
        + generate_daily_report() ReportDTO
        + create_pdf_report(analytics_data) bytes
        + send_report_to_managers(report) bool
    }

    class AlertService {
        - notification_service: NotificationService
        + check_business_alerts() List[Alert]
        + detect_sales_drop(sales_data) SalesDropAlert
        + find_critical_stock(stock_data) List[StockAlert]
        + send_notifications(alerts) bool
    }

    %% ==================== COUCHE DONNÉES ====================
    class JavaClient {
        - base_url: str
        - http_client: AsyncClient
        + get_sales_today() List[Sale]
        + get_products() List[Product]
        + get_sales_history(days) List[Sale]
        + get_stock_levels() List[Stock]
        + bulk_create_products(products) bool
    }

    class CacheManager {
        - redis_client: Redis
        + get_cached_data(key) Optional[dict]
        + set_cached_data(key, data, expiry) bool
        + invalidate_cache(key) bool
    }

    class ExcelProcessor {
        + read_excel_file(file) DataFrame
        + validate_business_data(df) ValidationResult
        + transform_data(raw_data) List[Product]
        + export_to_csv(data) bytes
    }

    %% ==================== COUCHE MODÈLES ====================
    class DashboardDTO {
        - total_revenue: float
        - low_stock_alerts: List[StockAlert]
        - sales_trend: TrendAnalysis
        - top_products: List[ProductPerformance]
        + to_dict() dict
    }

    class ForecastResultDTO {
        - product_id: str
        - predictions: List[float]
        - confidence: float
        - model_version: str
        + get_formatted_predictions() dict
    }

    class Product {
        - id: str
        - name: str
        - price: float
        - stock: int
        - min_threshold: int
        + is_low_stock() bool
    }

    class Sale {
        - id: str
        - product_id: str
        - amount: float
        - quantity: int
        - timestamp: datetime
        + get_formatted_date() str
    }

    %% ==================== RELATIONS ====================
    AnalyticsRoute --> DashboardService
    MLRoute --> ForecastingService
    DataRoute --> ExcelProcessor
    
    DashboardService --> JavaClient
    DashboardService --> CacheManager
    ForecastingService --> JavaClient
    
    DashboardService --> DashboardDTO
    ForecastingService --> ForecastResultDTO
    JavaClient --> Product
    JavaClient --> Sale
```

## *SUMMARY*
| Layer       | Responsibilities                  | Technologies                  |
|-------------|-----------------------------------|-------------------------------|
| Presentation | API Endpoints, Validation, Security | FastAPI, Pydantic, JWT       |
| Business    | Business Logic, Calculations, Analytics | Python, Pandas, Scikit-learn |
| Data        | Data Access, Cache, Integration   | HTTPX, Redis, Pandas         |
| Models      | Data Structures, Validation       | Pydantic, Python classes     |
| Utilities   | Reusable Functions, Helpers       | Python standard library      |

# *BEHAVIOR MODEL*
## *REAL-TIME DASHBOARD BEHAVIOR*
```mermaid
sequenceDiagram
    title REAL-TIME DASHBOARD BEHAVIOR

    participant User as Business User
    participant Front as Frontend
    participant API as FastAPI Analytics
    participant Cache as Redis Cache
    participant Java as Java API
    participant DB as PostgreSQL

    User->>Front: Opens dashboard
    Front->>API: GET /analytics/dashboard
    API->>Cache: Check cached dashboard
    alt Cached data exists
        Cache-->>API: Return cached analytics
    else No cache
        API->>Java: GET /api/sales/today
        API->>Java: GET /api/products
        Java->>DB: Query sales & products
        DB-->>Java: Raw business data
        Java-->>API: JSON response
        API->>API: Calculate total revenue
        API->>API: Detect low stock alerts
        API->>API: Analyze sales trends
        API->>Cache: Store results (30min expiry)
    end
    API-->>Front: DashboardDTO with analytics
    Front-->>User: Display interactive dashboard
```
Key Behaviors:

    Cache-first strategy for performance
    Parallel data fetching from Java API
    Real-time business calculations
    Automatic cache invalidation
    
## **ML FORECASTINF BEHAVIOR**
```mermaid
sequenceDiagram
    title ML SALES FORECASTING BEHAVIOR

    participant Analyst as Data Analyst
    participant Front as Frontend
    participant API as FastAPI ML
    participant Java as Java API
    participant ML as ML Engine

    Analyst->>Front: Request sales forecast
    Front->>API: POST /ml/forecast
    API->>Java: GET /api/sales/history?days=90
    Java-->>API: 90 days historical data
    API->>ML: Prepare training data
    API->>ML: Train LinearRegression model
    ML-->>API: Model trained (accuracy score)
    API->>ML: Predict next 7 days
    ML-->>API: Future predictions + confidence
    API-->>Front: ForecastResultDTO
    Front-->>Analyst: Show prediction chart
```
Key Behaviors:

    Automated model training on demand
    Confidence scoring for predictions
    Historical data preparation
    Real-time inference
## *EXCEL IMPORT BEHAVIOR*
```mermaid
sequenceDiagram
    title EXCEL DATA IMPORT BEHAVIOR

    participant Operator as Operations
    participant Front as Frontend
    participant API as FastAPI Data
    participant Valid as Validator
    participant Java as Java API

    Operator->>Front: Upload Excel file
    Front->>API: POST /data/import-excel
    API->>API: Parse Excel with Pandas
    loop For each row in Excel
        API->>Valid: Validate business rules
        alt Validation passed
            API->>API: Transform to product format
            API->>API: Add to valid batch
        else Validation failed
            API->>API: Log error with context
            API->>API: Add to errors list
        end
    end
    API->>Java: POST /api/products/bulk
    Java-->>API: Bulk creation result
    API-->>Front: ImportResultDTO
    Front-->>Operator: Show import summary
```
Key Behaviors:

    Row-by-row validation pipeline
    Batch processing for efficiency
    Comprehensive error tracking    
    Atomic bulk operations

## *AUTOMATED REPORTING BEHAVIOR*
  ``` mermaid
  sequenceDiagram
    title AUTOMATED REPORT GENERATION BEHAVIOR

    participant Scheduler as Cron Scheduler
    participant API as FastAPI Reports
    participant Java as Java API
    participant Analytics as Analytics Engine
    participant PDF as PDF Generator
    participant Email as Email Service

    Note over Scheduler: Daily at 8:00 AM
    Scheduler->>API: Trigger report generation
    API->>Java: GET /api/sales/daily
    API->>Java: GET /api/products
    Java-->>API: Complete business data
    API->>Analytics: Calculate advanced KPIs
    Analytics-->>API: Business insights
    API->>PDF: Generate professional PDF
    PDF-->>API: PDF file buffer
    API->>Email: Send to managers list
    Email-->>API: Delivery confirmation
    API-->>Scheduler: Generation complete
```
Key Behaviors:

    Time-based automation
    Sequential workflow execution
    Professional document generation
    Email distribution system

## *INTELLIGENT ALERTING BEHAVIOR*
``` mermaid
sequenceDiagram
    title INTELLIGENT ALERT SYSTEM BEHAVIOR

    participant Monitor as Monitoring Service
    participant API as FastAPI Alerts
    participant Java as Java API
    participant Detect as Anomaly Detection
    participant Notify as Notification Service

    Note over Monitor: Runs every 5 minutes
    Monitor->>API: Check business alerts
    API->>Java: GET /api/sales/recent
    API->>Java: GET /api/stock/levels
    Java-->>API: Recent business data
    API->>Detect: Analyze sales patterns
    Detect-->>API: Sales drop detected
    API->>Detect: Check stock levels
    Detect-->>API: Critical stock found
    alt Alerts detected
        API->>API: Create alert objects
        API->>Notify: Send push notifications
        Notify-->>API: Notifications sent
    else No alerts
        API->>API: Log healthy status
    end
    API-->>Monitor: Alert check complete
```
Key Behaviors:

    Continuous monitoring
    Multi-condition alert detection
    Proactive notification system
    Health status logging

## * PERFORMANCE CACHING BEHAVIOR*
```mermaid
sequenceDiagram
    title CACHE MANAGEMENT BEHAVIOR

    participant User as End User
    participant API as FastAPI
    participant Cache as Redis
    participant Java as Java API
    participant Analytics as Analytics Service

    User->>API: Request heavy analytics
    API->>Cache: Check cache key
    alt Cache HIT - Fast path
        Cache-->>API: Return cached data
        API-->>User: Immediate response
    else Cache MISS - Slow path
        API->>Java: Fetch raw data
        Java-->>API: Business data
        API->>Analytics: Complex calculations
        Analytics-->>API: Processed results
        API->>Cache: Store results
        Cache-->>API: Cache updated
        API-->>User: Final response
    end
```
Key Behaviors:

Cache-aside pattern,
Performance optimization,
Graceful degradation,
Automatic cache warming.
### *SUMMARY*
| Feature          | Behavior Type              | Key Dynamics                          |
|------------------|----------------------------|---------------------------------------|
| Dashboard        | Real-time + Cache          | Fast response, parallel processing    |
| ML Forecasting   | Predictive + Training      | Model lifecycle, confidence scoring   |
| Excel Import     | Batch + Validation         | Row processing, error handling        |
| Automated Reports| Scheduled + Sequential     | Time-based triggers, workflow         |
| Alert System     | Reactive + Monitoring      | Event detection, notification         |
| Caching          | Performance + Optimization | Cache strategies, fallback            |
