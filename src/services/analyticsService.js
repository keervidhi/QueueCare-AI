
import apiClient from './api';

import {
  HOURLY_WAIT_TIME_DATA,
  DEPARTMENT_WAIT_TIME_DATA,
  QUEUE_CORRELATION_SAMPLE,
} from './mockData';

// Load analytics data from FastAPI
async function fetchAnalytics() {
  const response = await apiClient.get('/analytics');
  return response.data;
}

// 1. Hourly Waiting Time
export async function getHourlyAnalytics(isDemoMode = false) {
  if (isDemoMode) {
    return {
      data: HOURLY_WAIT_TIME_DATA,
      source: 'DEMO_DATA',
      isDemo: true,
    };
  }

  const result = await fetchAnalytics();

  if (!Array.isArray(result.by_hour)) {
    throw new Error('Missing by_hour data in analytics.json');
  }

  const data = result.by_hour.map((item) => ({
    hour: Number(item.arrival_hour),
    hourLabel: `${String(item.arrival_hour).padStart(2, '0')}:00`,
    avgWaitTime: Number(item.avg_wait),
  }));

  return {
    data,
    source: 'LIVE_BACKEND_API',
    isDemo: false,
  };
}

// 2. Department Waiting Time
export async function getDepartmentAnalytics(isDemoMode = false) {
  if (isDemoMode) {
    return {
      data: DEPARTMENT_WAIT_TIME_DATA,
      source: 'DEMO_DATA',
      isDemo: true,
    };
  }

  const result = await fetchAnalytics();

  if (!Array.isArray(result.by_department)) {
    throw new Error('Missing by_department data in analytics.json');
  }

  const data = result.by_department.map((item) => ({
    department: item.department,
    avgWaitTime: Number(item.avg_wait),
    avgStaff: Number(item.avg_staff),
    visits: Number(item.visits),
  }));

  return {
    data,
    source: 'LIVE_BACKEND_API',
    isDemo: false,
  };
}

// 3. Queue Depth vs Waiting Time
export async function getQueueCorrelation(isDemoMode = false) {
  if (isDemoMode) {
    return {
      data: QUEUE_CORRELATION_SAMPLE,
      source: 'DEMO_DATA',
      isDemo: true,
    };
  }

  const result = await fetchAnalytics();

  if (!Array.isArray(result.queue_vs_wait)) {
    throw new Error('Missing queue_vs_wait data in analytics.json');
  }

  const data = result.queue_vs_wait.map((item) => ({
    queueLength: Number(item.patients_ahead),
    waitTime: Number(item.avg_wait),
  }));

  return {
    data,
    source: 'LIVE_BACKEND_API',
    isDemo: false,
  };
}

// 4. Machine Learning Model Performance
export async function getModelBenchmarks(_isDemoMode = false) {
  const response = await apiClient.get('/metrics');
  const result = response.data;

  if (!Array.isArray(result.models)) {
    throw new Error('Missing models data from /api/metrics');
  }

  const models = result.models.map((item) => ({
    ...item,
    isReportedBest: item.model === result.best_model,
    status:
      item.model === result.best_model
        ? 'Best Model'
        : 'Evaluated',
  }));

  const best = models.find(
    (item) => item.model === result.best_model
  );

  return {
    data: models,
    reportedBest: best || null,
    source: 'TRAINED_MODEL_API',
    isDemo: false,
  };
}
