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
* **Robust Error Handling:** Utilizes a global exception handler for clean, consistent API error responses.
* **API Documentation:** Integrated Swagger/OpenAPI for easy testing and documentation.
* **Asynchronous Processing:** Configured for handling non-critical tasks efficiently.

## 🛠️ Technologies Used

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | Java 17+ | Core programming language. |
| **Web Framework** | Spring Boot | Rapid development of RESTful services. |
| **API Docs** | Springdoc-OpenAPI / Swagger | Automatic API documentation generation. |
| **Security** | Spring Security & JWT | Authentication and Authorization. |
| **Database** | Spring Data JPA / Hibernate | Object-Relational Mapping (ORM). |
| **Database Migrations** | Flyway | Managing database schema evolution. |
| **Build Tool** | Apache Maven | Project build automation and dependency management. |

## 🚀 Getting Started

### Prerequisites
* Java Development Kit (JDK) 17 or higher.
* Apache Maven.
* A relational database (e.g., H2, PostgreSQL or MySQL).

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/rado4002/-SalesFlow-Lite.git](https://github.com/rado4002/-SalesFlow-Lite.git)
    cd -SalesFlow-Lite/backend-java
    ```
2.  **Configure Database:** Edit the `src/main/resources/application.properties` file to configure your database connection settings.
3.  **Run the application:**
    ```bash
    ./mvnw spring-boot:run
    ```

The application will start on **[http://localhost:8080](http://localhost:8080)** (default port). You can access the API documentation at **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**.
