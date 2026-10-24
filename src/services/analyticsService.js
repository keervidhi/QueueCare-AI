import apiClient from './api';
import {
  HOURLY_WAIT_TIME_DATA,
  DEPARTMENT_WAIT_TIME_DATA,
  QUEUE_CORRELATION_SAMPLE,
  MODEL_BENCHMARK_METRICS,
} from './mockData';

/**
 * Fetch hourly waiting time distribution (0-23 hours).
 * In live mode, requests `/analytics/hourly`; in demo mode, returns 1,200-record synthetic distribution.
 */
export async function getHourlyAnalytics(isDemoMode = false) {
  if (isDemoMode) {
    return {
      data: HOURLY_WAIT_TIME_DATA,
      source: 'SYNTHETIC_DATASET_1200',
      isDemo: true,
    };
  }

  try {
    const res = await apiClient.get('/analytics/hourly');
    return {
      data: res.data,
      source: 'LIVE_BACKEND_API',
      isDemo: false,
    };
  } catch (error) {
    console.warn('Real backend /analytics/hourly unreachable; throwing error per strict API contract.', error);
    throw new Error('Could not fetch hourly analytics from live backend. Toggle Demo Mode to inspect synthetic sample data.');
  }
}

/**
 * Fetch department waiting time and staffing analysis.
 */
export async function getDepartmentAnalytics(isDemoMode = false) {
  if (isDemoMode) {
    return {
      data: DEPARTMENT_WAIT_TIME_DATA,
      source: 'SYNTHETIC_DATASET_1200',
      isDemo: true,
    };
  }

  try {
    const res = await apiClient.get('/analytics/departments');
    return {
      data: res.data,
      source: 'LIVE_BACKEND_API',
      isDemo: false,
    };
  } catch (error) {
    console.warn('Real backend /analytics/departments unreachable;', error);
    throw new Error('Could not fetch department analytics from live backend.');
  }
}

/**
 * Fetch queue length vs wait time correlation scatter points.
 */
export async function getQueueCorrelation(isDemoMode = false) {
  if (isDemoMode) {
    return {
      data: QUEUE_CORRELATION_SAMPLE,
      source: 'SYNTHETIC_DATASET_1200',
      isDemo: true,
    };
  }

  try {
    const res = await apiClient.get('/analytics/correlation');
    return {
      data: res.data,
      source: 'LIVE_BACKEND_API',
      isDemo: false,
    };
  } catch (error) {
    console.warn('Real backend /analytics/correlation unreachable;', error);
    throw new Error('Could not fetch queue correlation from live backend.');
  }
}

/**
 * Fetch model performance metrics.
 * Displays reported experimental results (Gradient Boosting MAE = 4.137, RMSE = 5.190, R² = 0.708)
 */
export async function getModelBenchmarks(isDemoMode = false) {
  if (isDemoMode) {
    return {
      data: MODEL_BENCHMARK_METRICS,
      reportedBest: {
        model: 'Gradient Boosting Regressor',
        mae: 4.137,
        rmse: 5.190,
        r2: 0.708,
        label: 'Reported Experimental Results (Project Report Benchmark)',
        description: 'Trained and evaluated on 1,200 synthetic patient wait-time records.',
      },
      source: 'REPORTED_EXPERIMENTAL_RESULTS',
      isDemo: true,
    };
  }

  try {
    const res = await apiClient.get('/analytics/models');
    return {
      data: res.data.models || res.data,
      reportedBest: res.data.reported_best || {
        model: 'Gradient Boosting Regressor',
        mae: 4.137,
        rmse: 5.190,
        r2: 0.708,
      },
      source: 'LIVE_BACKEND_API',
      isDemo: false,
    };
  } catch (error) {
    console.warn('Real backend /analytics/models unreachable;', error);
    throw new Error('Could not fetch model metrics from live backend.');
  }
}
