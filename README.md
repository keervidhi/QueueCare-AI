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

```
QueueCare AI/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
├── .env
├── README.md
├── backend_reference/               # Reference FastAPI companion server
│   ├── app.py                       # REST API implementation
│   ├── requirements.txt             # Python ML dependencies
│   └── README.md                    # Backend setup instructions
└── src/
    ├── index.css                    # Tailwind imports & custom styles
    ├── main.jsx                     # Application bootstrap & router
    ├── App.jsx                      # Route definitions
    ├── context/
    │   └── AppContext.jsx           # State for predictions & Demo/Live mode
    ├── components/
    │   └── common/
    │       ├── Navbar.jsx           # Navigation & mode toggle
    │       ├── Footer.jsx           # Disclaimer & project information
    │       ├── StatCard.jsx         # KPI summary metric cards
    │       ├── ChartCard.jsx        # Responsive container for Recharts
    │       ├── LoadingState.jsx     # Pulse loading indicators
    │       ├── ErrorMessage.jsx     # Graceful error alerts & retry
    │       └── DisclaimerBanner.jsx # Academic prototype disclaimer banner
    ├── pages/
    │   ├── Home.jsx                 # Landing page & feature cards
    │   ├── Prediction.jsx           # Waiting-time prediction form
    │   ├── PredictionResult.jsx     # Prediction result card & breakdown
    │   ├── Analytics.jsx            # Flow charts & model benchmarks
    │   └── NotFound.jsx             # 404 handler
    ├── services/
    │   ├── api.js                   # Centralized Axios client & health check
    │   ├── predictionService.js     # ML inference service
    │   ├── analyticsService.js      # Patient flow & benchmark metrics
    │   └── mockData.js              # 1,200 synthetic records distribution
    └── utils/
        └── formatters.js            # Time, severity, and staffing helpers
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `pnpm`

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd "QueueCare AI"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build locally:
   ```bash
   npm run preview
   ```

---

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
