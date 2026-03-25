# VitalsGuard 🏥🤖

**Track 5: VIT Internship Special Track**  
**AI-Based Vital Analysis & Health Prediction System**

---

## 📖 Problem Statement (Exclusive for Vitians)
Design and develop an intelligent application that collects and analyzes human vital parameters such as heart rate, SpO₂, ECG, and temperature using machine learning.

**Key Requirements Addressed:**
*   ✅ Accept real-time or sample dataset inputs of vitals.
*   ✅ Apply ML models to analyze and predict potential health conditions.
*   ✅ Compare predictions with provided medical reports.
*   ✅ Display results through an interactive, visually rich dashboard.
*   ✅ Include real-time data visualization (graphs, alerts, trends).

---

## ✨ Features

VitalsGuard is a comprehensive, multi-role (Patient, Doctor, Admin) clinical intelligence platform that bridges the gap between raw medical data and actionable insights using advanced AI.

### 🧑‍⚕️ Patient Dashboard (Digital Twin & Self-Monitoring)
*   **Interactive What-If Vitals Simulator:** Users can manipulate sliders for Heart Rate, SpO₂, Temperature, and Blood Pressure to simulate health scenarios.
*   **Real-Time AI Diagnosis:** Instantly predicts conditions (e.g., Tachycardia, Hypoxemia) using Machine Learning, providing a confidence score and plain-English risk assessment.
*   **24-Hour Risk Forecasting:** Visualizes disease probabilities and projected health risks using dynamic area charts.
*   **AI Agent Debate:** Utilizes a Phidata-powered Multi-Agent system to cross-reference vitals against clinical knowledge bases for deeper insights.
*   **Report vs AI Analysis:** Upload medical reports (images) and automatically extract text using Gemini Vision, comparing the report's conclusions with the AI's independent vitals assessment.
*   **Appointment Scheduler:** A seamless booking interface that respects patient discharge status and prevents double-booking.

### 👨‍⚕️ Doctor Command Center (Triage & Monitoring)
*   **High-Capacity Ward Monitoring:** View a roster of up to 20 dynamically simulated patients.
*   **Intelligent Triage Sorting:** Patients are automatically prioritized; critical patients (Red) are pinned to the top, followed by warnings (Orange) and stable (Green) statuses.
*   **Real-Time Vitals Tracking:** View historical vital charts and current metrics for any selected patient.
*   **Simultaneous Multi-Patient Alerting:** Trigger emergency clinical dispatches for multiple patients independently.
*   **Custom Infrastructure Requests:** The system intelligently auto-suggests required medical hardware (e.g., High-Flow Oxygen for low SpO₂, Ventilators, ICU Beds) based on real-time vitals, while allowing doctors to append custom text requirements.

### 🛡️ Admin Command Center (Hospital Logistics)
*   **Live Key Performance Indicators (KPIs):** Monitor hospital capacity, patient status distributions, and active personnel in real-time.
*   **Emergency Dispatch Hub:** Receive live alerts from the Doctor dashboard, complete with patient names and the exact medical infrastructure required.
*   **Rapid Response:** Acknowledge emergency alerts directly, instantly reflecting the "Resolved" status back to the Doctor's dashboard.

---

## 🛠️ Technology Stack

*   **Frontend:** React.js, Vite, Tailwind CSS (Custom Premium UI via inline styles), Recharts (Data Visualization), Framer Motion (Animations).
*   **Node.js Backend (Auth, Appointments, Alerts):** Express.js, Supabase (PostgreSQL Auth & Records).
*   **Python AI Backend (Machine Learning):** FastAPI, Scikit-Learn (Predictive Modeling, Random Forest/Isolation Forest), Phidata (Multi-Agent framework), Google Gemini (Vision & LLM capabilities).

---

## 🚀 How to Run the Project Locally

The application consists of four main components that need to run concurrently:

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   API Keys for Mistral API(for the Python Agent backend) and Supabase (for the Node backend).


### 1. Start the React Frontend
Open a terminal and navigate to the project root:
```bash
cd vitalsgaurd
npm install
npm run dev
```
*(Runs by default on port 5173)*

### 2. Start the Node.js Server (Auth & Logistics)
Open a new terminal and navigate to the `server` directory:
```bash
cd vitalsgaurd/server
npm install
# Ensure you have a .env file here with SUPABASE_URL and SUPABASE_ANON_KEY
npm run dev
```
*(Runs by default on port 5003)*

### 3. Start the Python AI Agents API
Open a new terminal and navigate to the `backend` directory:
```bash
cd vitalsgaurd/backend
pip install -r requirements.txt
# Ensure you have your GEMINI_API_KEY exported or in a .env file
uvicorn main:app --reload --port 8000
```
*(Runs by default on port 8000)*

### 4. Start the Python LLM Server (Machine Learning)
Open a new terminal and navigate to the `base_models` directory:
```bash
cd base_models
python app.py
```
*(Runs by default on port 8000)*
---

## 📊 Evaluation Criteria Met
*   **Originality & ML Focus:** Custom predictive models and an innovative Agent-Debate system specifically tailored for vitals.
*   **Design:** Premium glassmorphism UI with smooth, interactive data visualizations.
*   **Functionality:** End-to-end working system from patient mock data entry to administrative emergency response.
