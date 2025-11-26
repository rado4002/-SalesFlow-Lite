# SalesFlow Lite  

*A lightweight, modular sales management tool designed for small businesses.*  

SalesFlow Lite helps small businesses track **products, sales, and stock** while providing **dashboards, exports, and predictive insights**.  
It is built with a **Java–Python–React modular architecture** and follows **agile methods** with simple, scalable technical solutions.  

---

## Project Roadmap  

- **Phase 1 (16/09/2025 – 20/09/2025):** Empathy in the Design Thinking process  
  - User interviews and observations  
  - Identification of pain points in sales and stock management  
  - Creation of personas and problem definition
  - RESULT :
  - ✅ Conducted user interviews with 10 stakeholders
  - ✅ Identified key pain points and requirements
  - ✅ Created user personas (e.g., "Papa Marcel")
  - ✅ Gathered feedback from merchants, experts, and community leaders

### Key Insights from User Research
1. **Core Needs:**
   - Simple, quick sales entry
   - Stock alerts to prevent ruptures
   - Basic dashboard for daily decisions
   - Offline-first functionality
   - Multilingual support (English,French, Lingala, Swahili)

2. **Technical Requirements:**
   - Mobile-friendly interface
   - Maximum 3 clicks for common tasks
   - Works without constant internet
   - Affordable for small merchants

## Project Structure 

## MVP Features (Prioritized)
- [ ] Product management (CRUD)
- [ ] Sales entry with calculations
- [ ] Stock tracking with alerts
- [ ] Basic dashboard (sales, top products)
- [ ] CSV export functionality
- [ ] Multilingual interface

## Documentation
- [Design Thinking Process](docs/DESIGN-THINKING.md)
- [Collaboration Guide](docs/COPILOT-SPACE-INSTRUCTIONS.md)

### Phase 2 (21/09/2025 – 27/09/2025): Architecture & MVP Deep Dive

- **Goal**: Design the technical foundation for the project and plan the structure, data flows, and algorithms for the MVP features.

#### Key Deliverables:
1. **System Architecture**:
   - Define the overall architecture: modular microservices with Java, Python, and React.
   - Create an architecture diagram to illustrate communication between components:
     - **Frontend (React)**: User interface for product management, sales entry, and dashboard.
     - **Backend (Java)**: Spring Boot for core product and sales APIs.
     - **Backend (Python)**: FastAPI for analytics and export functionalities.
     - **Database**: PostgreSQL for centralized and reliable data storage.
     - **Offline Support**: IndexedDB in the frontend for offline-first functionality.

2. **MVP Feature Analysis**:
   - Break down each MVP feature into:
     - Functional requirements
     - Data models and flows
     - Key algorithms
   - Define specific goals for:
     - **Product Management**: CRUD operations for products and stock levels.
     - **Sales Entry**: Auto-calculation of totals, offline support.
     - **Stock Alerts**: Notifications when stock is low.
     - **Dashboard**: Display sales metrics, top products, and stock statuses.
     - **CSV Export**: Simple data export functionality.

3. **Code Structure**:
   - Plan folder structures for all components:
     - **Frontend**: `/components`, `/services`, `/hooks`, `/pages`
     - **Backend (Java)**: `/controllers`, `/services`, `/repositories`, `/models`
     - **Backend (Python)**: `/routes`, `/services`, `/models`
   - Create shared contracts for APIs and data models.

4. **Scalability Planning**:
   - Identify how the architecture can support future features:
     - Predictive analytics
     - Multi-user support
     - PDF export

#### Outcome:
By the end of Phase 2, the project will have:
- A finalized architecture diagram.
- Defined data models for the MVP.
- Planned API endpoints and data flows.
- A clear folder structure for all components.
- Basic algorithms outlined for MVP features.

---

**Next Steps for Phase 3**:
- Start implementing the Product Management API (Java backend).
- Develop the Sales Entry UI in React.
- Build the Stock Alerts feature with backend integration.

## Getting Started
⚙️ Installation and setup instructions will be added once MVP development begins.

## Contributing
This is a learning project focused on building a practical solution for small merchants in Kinshasa. Feedback and suggestions are welcome!

 
