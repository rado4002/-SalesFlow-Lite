# 💻 SalesFlow-Lite Backend

SalesFlow-Lite is a powerful, lightweight Java backend built on Spring Boot, designed to provide a secure and efficient RESTful API for inventory, sales, and user management systems.

## ✨ Key Features

This application exposes a RESTful API with the following core functionalities:

### Authentication & Security
* **Secure User Authentication:** User Registration and Login endpoints.
* **Role-Based Access Control (RBAC):** Manages user permissions via roles.
* **JWT (JSON Web Token) Implementation:** Secure token-based session management.
* **Refresh Token Mechanism:** Provides extended session validity without frequent re-login.

### Inventory & Sales
* **Product Management:** Full CRUD (Create, Read, Update, Delete) operations for managing products.
* **Inventory Tracking:** Dedicated service for managing and tracking stock levels.
* **Sales Transactions:** API for creating new sales and tracking associated sale items.
* **Automated Stock Control:** Automatic deduction of stock upon sale creation.

### Architecture & Quality of Life
* **Clean Layered Architecture:** Clear separation of concerns (Controller → Service → Repository).
* **Robust Error Handling:** Utilizes a global exception handler for clean, consistent API error responses.
* **API Documentation:** Integrated Swagger/OpenAPI for easy testing and documentation.
* **Asynchronous Processing:** Configured for handling non-critical tasks efficiently.
* **Database Migrations:** Version-controlled schema evolution using Flyway.
* **CORS Configuration:** Configured for frontend integration.

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | Java 17+ | Core programming language |
| **Web Framework** | Spring Boot 3.x | Rapid development of RESTful services |
| **API Documentation** | Springdoc-OpenAPI / Swagger UI | Automatic API documentation generation |
| **Security** | Spring Security & JWT | Authentication and Authorization |
| **Database** | Spring Data JPA / Hibernate | Object-Relational Mapping (ORM) |
| **Database Migrations** | Flyway | Managing database schema evolution |
| **Build Tool** | Apache Maven | Project build automation and dependency management |
| **Testing** | JUnit 5 & Mockito | Unit and integration testing |
| **Database (Development)** | H2 Database | In-memory database for development |
| **Database (Production)** | PostgreSQL | Production-grade relational database |

## 🚀 Getting Started

### Prerequisites
* Java Development Kit (JDK) 17 or higher.
* Apache Maven.
* A relational database (H2 is used by default for development).

### Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/rado4002/-SalesFlow-Lite.git](https://github.com/rado4002/-SalesFlow-Lite.git)
   cd -SalesFlow-Lite/codebase/backend-java
