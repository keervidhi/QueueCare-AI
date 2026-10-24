import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Mode: true = Demo Mode (using synthetic regression rules), false = Live API Mode
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const saved = localStorage.getItem('queuecare_demo_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [backendStatus, setBackendStatus] = useState({
    checked: false,
    online: false,
    message: 'Checking backend status...',
  });

  // Latest prediction object
  const [latestPrediction, setLatestPrediction] = useState(() => {
    try {
      const saved = sessionStorage.getItem('queuecare_latest_prediction');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // History of predictions in the current session
  const [predictionHistory, setPredictionHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem('queuecare_prediction_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save demo mode choice to localStorage
  useEffect(() => {
    localStorage.setItem('queuecare_demo_mode', JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  // Save latest prediction to sessionStorage
  useEffect(() => {
    if (latestPrediction) {
      sessionStorage.setItem('queuecare_latest_prediction', JSON.stringify(latestPrediction));
    }
  }, [latestPrediction]);

  // Save history to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('queuecare_prediction_history', JSON.stringify(predictionHistory));
  }, [predictionHistory]);

  // Check backend health on initial load
  const verifyBackend = async () => {
    setBackendStatus((prev) => ({ ...prev, checked: false }));
    const result = await checkBackendHealth();
    setBackendStatus({
      checked: true,
      online: result.online,
      message: result.message,
    });
  };

  useEffect(() => {
    verifyBackend();
  }, []);

  const savePrediction = (prediction) => {
    setLatestPrediction(prediction);
    setPredictionHistory((prev) => [prediction, ...prev.slice(0, 9)]);
  };

  const clearPrediction = () => {
    setLatestPrediction(null);
    sessionStorage.removeItem('queuecare_latest_prediction');
  };

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        setIsDemoMode,
        backendStatus,
        verifyBackend,
        latestPrediction,
        savePrediction,
        clearPrediction,
        predictionHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
