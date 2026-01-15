<h1>Currently developing a prototype for a coursework</h1>
# SaltAware

**Smart Recipe Recommendations for Hypertension Management**

SaltAware is a web application designed to help users manage hypertension by discovering recipes tailored to their specific health needs. By focusing on low-sodium options and nutritional transparency, it empowers users to make healthier dietary choices using ingredients they already have.

## 🚀 Features

* **Health Profile:** Customize dietary goals and restrictions.
* **Ingredient Selector:** Select available ingredients to find matching recipes.
* **Smart Recommendations:** AI-driven or logic-based recipe suggestions tailored to hypertension management.
* **Responsive Design:** Built with Material UI for a seamless experience on desktop and mobile.

## 🛠️ Tech Stack

* **Frontend:** React.js, Material UI (MUI), Axios
* **Backend:** Node.js, Express.js
* **Deployment:** Render (Static Site + Web Service)
* **CI/CD:** GitHub Actions

### Prerequisites
* Node.js (v18 or higher)
* npm (Node Package Manager)

## 🚀 Live Demo & Deployment

The application is fully deployed and live on Render.

* **Frontend (Client):** [https://saltaware-client.onrender.com](https://saltaware-client.onrender.com)
* **Backend (API):** [https://saltaware-server.onrender.com](https://saltaware-server.onrender.com)

## 🔄 CI/CD Pipeline

This project utilizes an advanced **Stepped GitHub Actions Pipeline** that executes Server and Client workflows in parallel for maximum efficiency and safety.

### 1. Trigger
* Pushing code to the `main` branch automatically initiates the workflow.

### 2. Stage I: Continuous Integration (Parallel Execution)
The pipeline splits into two independent tracks to validate code integrity before deployment.

**🛡️ Server Track (`server-ci`)**
   * **Dependency Check:** Installs Node.js dependencies.
   * **Unit Testing:** Validates data integrity of the local recipe database (`recipes.test.js`).
   * **Integration Testing:** Uses **Supertest** to verify API endpoints (`GET /api/recipes`, `POST /api/recommend`) with mocked external calls.

**🛡️ Client Track (`client-ci`)**
   * **Component Testing:** Uses **React Testing Library** to verify UI logic (e.g., `IngredientSelector` interaction).
   * **Static Analysis:** Runs **ESLint** to catch syntax errors and code quality issues.
   * **Build Verification:** Compiles the React application (`npm run build`) to ensure the production bundle is error-free.

### 3. Stage II: Continuous Deployment (CD)
Deployment jobs are conditional—they only run if their respective CI stage passes.

   * **Automated Deployment:** Triggers a deployment to **Render** via API.
   * **Live Verification:** The pipeline actively polls the Render API and waits for the service to report a **"Live"** status.
   * **Failure Protection:** If the deployment crashes or fails to go live, the GitHub Action marks the job as failed, preventing silent errors.
