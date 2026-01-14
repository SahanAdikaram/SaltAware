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

This project utilizes a **GitHub Actions** pipeline for automated testing and deployment to **Render**.

1.  **Trigger:** Pushing code to the `main` branch initiates the pipeline.
2.  **Build & Test:**
    * Installs dependencies for both Server and Client.
    * Builds the React Client to ensure there are no syntax errors.
3.  **Deployment:**
    * If the build succeeds, the pipeline triggers a deployment on Render.
    * It waits for the deployment to go **"Live"** before marking the job as successful.
