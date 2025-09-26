# Team Organization & Workflow

This document describes the team setup and workflow for **SalesFlow Lite**.  
We are **two developers and project owners** working together on all aspects of the project.

---

## 👥 Team Roles

### Java Developer (JD)
- Backend in **Java Spring Boot** (products, sales, authentication, stock management).
- React UI for **CRUD forms, sales entry, stock tables, low-stock alerts**.
- Maintains API integration file: `javaApi.js`.

### Python Developer (PD)
- Backend in **Python FastAPI** (analytics, Excel import/analysis, insights).
- React UI for **analytics dashboards, charts, Excel upload & parsing**.
- Maintains API integration file: `pythonApi.js`.

### Shared Responsibilities
- React **layout, navigation, shared components, styling** (Tailwind + shadcn/ui).
- **State management** (Redux/Zustand).
- **Testing** (unit + end-to-end).
- Documentation and deployment.

---

## 🔄 Workflow

1. **Plan**  
   - Define upcoming features together.  
   - Agree on React components needed and backend endpoints.  

2. **Develop**  
   - Each dev implements their **backend endpoints** and connects them to React via their API file.  
   - UI components are built based on API ownership (JD = CRUD, PD = analytics).  

3. **Integrate**  
   - Combine components in the shared **Dashboard**.  
   - Ensure data flows correctly across Java + Python services.  

4. **Review & Test**  
   - Both review each other’s pull requests.  
   - Write tests for shared and individual features.  

5. **Deploy**  
   - Continuous integration for both Java and Python backends.  
   - React frontend deployed with both APIs connected.

---

## 🗂 Weekly Focus Example

- **Week 1–2:** Core React layout, Java CRUD backend + UI, Python API skeleton.  
- **Week 3–4:** Dashboard integration, analytics features, Excel import.  
- **Week 5+:** Refinement, testing, documentation, advanced features.

---

✅ This organization ensures **clear ownership**, while keeping **collaboration strong** on shared parts like React and testing.
