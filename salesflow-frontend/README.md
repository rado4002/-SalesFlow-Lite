# 🖥️ SalesFlow-Lite — Frontend

Frontend web application for **SalesFlow-Lite**, a commercial management and analytics platform built with **React 18**, **TypeScript**, and **Vite**, and connected to a **microservices backend architecture (Java + Python)**.

---

## 🎯 Frontend Purpose

The frontend provides a **modern, responsive, and secure user interface** that enables users to:

* Visualize **sales performance and key business KPIs**
* Monitor **inventory levels and stock alerts**
* Access **advanced analytics dashboards**
* Run and visualize **machine learning forecasts**
* Import business data via **Excel files**
* Generate and download **PDF / Excel reports**

---

## 🧱 Technology Stack

### ⚛️ Core Technologies

* **React 18**
* **TypeScript**
* **Vite** (fast dev server, HMR, optimized builds)
* **React Router v6**
* **Axios**
* **React Context API**

### 🎨 UI / UX

* **Tailwind CSS**
* Reusable UI components
* SaaS-style dashboard layout
* Responsive design (desktop & tablet)

### 📊 Data Visualization

* **Recharts**
* Interactive charts and KPI cards
* Dynamic data tables

---

## 🧠 Application Architecture

The frontend is implemented as a **Single Page Application (SPA)** that acts as the **presentation and orchestration layer**, consuming multiple backend services:

* **Java Backend (Spring Boot)**

  * Authentication (JWT)
  * Products, sales, inventory

* **Python Backend (FastAPI)**

  * Analytics
  * Machine learning pipelines
  * Excel import
  * Report generation

The frontend remains **stateless**, handling only UI logic and delegating all business logic to backend services.

---

## 🔐 Authentication & Security

* JWT-based authentication
* Centralized session management using **React Context**
* Protected routes with authorization checks
* Axios interceptors for:

  * automatic token injection
  * centralized 401 / 403 handling
* No sensitive secrets stored on the client side

---

## 🚀 Getting Started

### Prerequisites

* Node.js ≥ 18
* npm or yarn
* Java and Python backends running locally or remotely

### Installation

```bash
npm install
```

### Environment Configuration

Create a `.env` file at the project root:

```env
VITE_JAVA_API_URL=http://localhost:8080
VITE_PYTHON_API_URL=http://localhost:8081
```

### Development Server

```bash
npm run dev
```

---

## 🧪 Code Quality & Tooling

* ESLint with TypeScript support
* Strict typing for safer refactoring
* Consistent code style across components
* Clear separation between UI, services, and types

### Recommended Enhancements

* Unit tests with Jest / React Testing Library
* End-to-end testing (Playwright or Cypress)
* Server-state caching with React Query
* Accessibility improvements (WCAG / ARIA)

---

## 🧩 Design Patterns Used

* **Component Pattern** — reusable UI building blocks
* **Composite Pattern** — layout composed of nested components
* **Context Pattern** — global authentication state
* **Facade Pattern** — API service abstraction
* **Observer Pattern** — reactive UI updates via state
* **Adapter Pattern** — backend DTO to frontend models
* **Client–Server Architecture**

---

## 📌 Project Status

* ✅ Functional MVP
* ✅ Fully integrated with backend services
* 🔄 Designed for scalability and extension
* 🎓 Suitable for engineering portfolio and academic evaluation


