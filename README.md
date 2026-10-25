# QueueCare AI — Hospital Waiting-Time & Patient Flow Predictor

An AIML academic mini project frontend providing real-time hospital outpatient turnaround estimations, department queue analytics, and machine-learning regression model comparisons.

> **Academic Prototype Notice:** This system is an academic research demonstration trained on a synthetic dataset of 1,200 patient visit records. Predictions are non-clinical estimates and are **not** suitable for medical diagnosis or emergency triage.

---

## 🏥 Features & Pages

### 1. Home (`/`)
- Professional healthcare landing page with modern medical aesthetic.
- Key highlights: 1,200 synthetic records, 8 hospital departments, and 4 evaluated regression architectures.
- Interactive system architecture breakdown (User Input &rarr; Feature Mapping &rarr; Gradient Boosting Regression &rarr; Triage Insights).
- Prominent call-to-action buttons to jump directly to prediction or analytics.

### 2. Waiting-Time Prediction Form (`/predict`)
- **Hospital Department Selector**: Configurable dropdown supporting 8 clinical departments (*Emergency & Trauma, General Medicine, Cardiology, Orthopedics, Pediatrics, Dermatology, ENT, Radiology*).
- **Patient Arrival Hour**: 24-hour hour selector with visual tags for diurnal surge peaks (*09:00 - 11:00 AM* and *04:00 - 06:00 PM*).
- **Patients Ahead in Queue**: Non-negative integer counter with quick increment/decrement controls.
- **Staff Availability on Duty**: Integer count of on-duty clinical staff with dynamic capacity classification (*Low: 1-2, Moderate: 3-5, Optimal: 6+*).
- **One-Click Scenario Presets**: Pre-configured real-world scenarios (*Morning Emergency Rush, OPD Calm Afternoon, Cardiology Peak, Pediatrics Evening Influx*).
- Comprehensive form validation, error handling, reset capability, and loading indicators.

### 3. Prediction Results (`/result`)
- Prominent estimated waiting-time card displaying predicted delay in minutes and hours.
- Visual wait severity indicator (*Short Wait < 20m, Moderate Wait 20-45m, Extended Wait > 45m*).
- RMSE-calibrated confidence intervals (±5.19 min bound).
- Breakdown of all submitted queue parameters.
- Contextual explanation of model-based estimation.
- "Predict Again" and "Explore Analytics Dashboard" shortcuts.
- Graceful empty state when no prediction is currently staged.

### 4. Analytics Dashboard (`/analytics`)
- **Average Waiting Time by Arrival Hour**: Responsive Recharts line chart illustrating 24-hour diurnal outpatient surge curves.
- **Average Waiting Time by Department**: Responsive bar chart comparing specialty turnaround times and staffing intensity.
- **Queue Depth vs. Waiting Time Correlation**: Scatter plot showing queue length progression.
- **Model Performance Comparison**: Grouped bar chart comparing *Mean Absolute Error (MAE)*, *Root Mean Squared Error (RMSE)*, and *R-squared (R²)*.
- **Reported Experimental Benchmarks Table**:
  - **Gradient Boosting Regressor (Reported Best)**:
    - **MAE**: `4.137 minutes`
    - **RMSE**: `5.190 minutes`
    - **R² Score**: `0.708`
  - Explicitly labeled as reported experimental results from the QueueCare AI project report.

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) with [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Soft-blue & white healthcare theme with teal accents)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/) with environment-variable configuration

---

## 📂 Project Structure
```text
QueueCare AI/
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
├── .env
├── README.md
│
├── backend_reference/                  # FastAPI Backend & ML Model
│   │
│   ├── app.py                          # REST API implementation
│   ├── requirements.txt                # Python ML dependencies
│   ├── README.md                       # Backend setup instructions
│   ├── hospital_queue_data.csv         # Hospital queue dataset
│   ├── generate_dataset.py             # Synthetic dataset generation
│   ├── train_model.py                  # ML model training
│   ├── predictor.py                    # Waiting-time prediction logic
│   ├── model.joblib                     # Trained ML model
│   ├── metrics.json                     # Model evaluation metrics
│   └── analytics.json                   # Analytics data
│
└── src/                                # React Frontend
    │
    ├── index.css                       # Tailwind imports & custom styles
    ├── main.jsx                        # Application bootstrap & router
    ├── App.jsx                         # Route definitions
    │
    ├── context/
    │   └── AppContext.jsx              # Global state & Demo/Live mode
    │
    ├── components/
    │   └── common/
    │       ├── Navbar.jsx              # Navigation & mode toggle
    │       ├── Footer.jsx              # Footer & project information
    │       ├── StatCard.jsx            # KPI summary cards
    │       ├── ChartCard.jsx           # Recharts chart container
    │       ├── LoadingState.jsx        # Loading indicators
    │       ├── ErrorMessage.jsx        # Error handling & retry
    │       └── DisclaimerBanner.jsx    # Academic prototype disclaimer
    │
    ├── pages/
    │   ├── Home.jsx                    # Landing page
    │   ├── Prediction.jsx              # Waiting-time prediction form
    │   ├── PredictionResult.jsx        # Prediction results
    │   ├── Analytics.jsx               # Analytics dashboard
    │   └── NotFound.jsx                # 404 error page
    │
    ├── services/
    │   ├── api.js                      # Axios API client
    │   ├── predictionService.js        # ML prediction API integration
    │   ├── analyticsService.js         # Analytics API integration
    │   └── mockData.js                 # Synthetic demo data
    │
    └── utils/
        └── formatters.js               # Formatting helper functions
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `pnpm`

## Backend Installation and Setup

The backend of QueueCare AI is developed using **FastAPI (Python)** and integrates a trained Machine Learning model for hospital waiting-time prediction.

### Installation

1. Navigate to the backend directory:

   ```bash
   cd "QueueCare AI"
   cd backend_reference
   ```

2. Create a Python virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   **Windows (CMD):**
   ```bash
   venv\Scripts\activate
   ```

   **Windows (PowerShell):**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

4. Install backend dependencies:

   ```bash
   python -m pip install -r requirements.txt
   ```

5. Generate the hospital queue dataset (optional, if the dataset already exists):

   ```bash
   python generate_dataset.py
   ```

6. Train the Machine Learning model (optional, if `model.joblib` already exists):

   ```bash
   python train_model.py
   ```

7. Launch the FastAPI backend server:

   ```bash
   python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
   ```

8. Open the backend API in your browser:

   - **Backend API:** http://localhost:8000
   - **Swagger API Documentation:** http://localhost:8000/docs
   - **ReDoc Documentation:** http://localhost:8000/redoc

### Running Frontend and Backend Together

**Terminal 1 – Backend:**

```bash
cd "QueueCare AI"
cd backend_reference
venv\Scripts\activate
python -m uvicorn app:app --reload --port 8000
```

**Terminal 2 – Frontend:**

```bash
cd "QueueCare AI"
npm install
npm run dev
```

Open the frontend at http://localhost:3000 (if configured in `vite.config.js`).

**Note:** Keep both terminals running for the frontend to communicate with the backend API. Ensure the frontend API base URL points to `http://localhost:8000`.

## ⚙️ Backend Integration & Demo Mode

QueueCare AI supports **two execution modes** seamlessly switchable in the top navigation bar:

1. **Demo Mode (Active by default)**:
   - Uses synthetic regression formulas matching the 1,200 records dataset distribution.
   - Calculates realistic waiting times with peak hour modifiers and reported RMSE confidence bounds.
   - Requires zero backend configuration—ideal for frontend demonstration and grading.

2. **Live Backend Mode**:
   - Sends real `POST /api/predict` requests to `VITE_API_BASE_URL` (configured in `.env`).
   - If the backend is unreachable or returns an error, it **never** silently masks the failure with fake data; it presents a clear, graceful error message explaining that the backend is offline with an option to retry or switch to Demo Mode.

A reference Python FastAPI server matching the exact API contract is provided in the `backend_reference/` directory.

---

## 📜 Academic Disclaimer

QueueCare AI is developed solely for academic research and educational evaluation. It uses synthetic patient queue data and must not be utilized for medical clinical decision-making or urgent emergency care triage.
