# SalesFlow-Lite Java Backend

Lightweight Spring Boot backend providing secure RESTful APIs for product management, sales transactions, inventory tracking, and authentication. Built for small merchants with offline-first frontend integration in mind.

## ✨ Key Features

- **Authentication & Security**
  - User registration/login with JWT tokens
  - Refresh token support
  - Role-based access control (RBAC)

- **Core Business Logic**
  - Full CRUD for products
  - Sales creation with automatic stock deduction
  - Real-time inventory tracking and low-stock alerts

- **Quality & DevEx**
  - Global error handling for consistent API responses
  - Swagger/OpenAPI documentation at `/swagger-ui.html`
  - CORS enabled for React frontend
  - Flyway database migrations
  - Asynchronous task support

For detailed architecture (layered design, package structure, security flow), see [`docs/` folder](./docs).

## 🛠️ Technology Stack

| Category              | Technology                  | Purpose                          |
|-----------------------|-----------------------------|----------------------------------|
| Language              | Java 17+                    | Core runtime                     |
| Framework             | Spring Boot 3.x             | REST API & rapid development     |
| Security              | Spring Security + JJWT      | JWT auth & authorization         |
| ORM                   | Spring Data JPA / Hibernate | Database access                  |
| Documentation         | springdoc-openapi           | Swagger UI                       |
| Migrations            | Flyway                      | Schema versioning                |
| Build Tool            | Maven                       | Dependencies & packaging         |
| Dev Database          | H2 (in-memory)              | Local testing                    |
| Prod Database         | PostgreSQL                  | Production persistence           |

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven (or use included wrapper: `./mvnw`)
- PostgreSQL (production) or H2 (default for dev)

### Run Locally
```bash
# From backend-java folder
./mvnw spring-boot:run
