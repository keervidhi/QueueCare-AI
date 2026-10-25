import apiClient from './api';
import { HOSPITAL_DEPARTMENTS, calculateDemoPrediction } from './mockData';

/**
 * Hospital department options
 */
export function getAvailableDepartments() {
  return HOSPITAL_DEPARTMENTS;
}

/**
 * Submit prediction inputs and receive estimated waiting time.
 *
 * @param {Object} input
 * @param {string} input.department - e.g. "Emergency", "General Medicine"
 * @param {number} input.arrivalHour - 0 to 23
 * @param {number} input.queueLength - non-negative integer
 * @param {number} input.staffAvailability - count of available staff on duty (e.g. 1 to 10)
 * @param {boolean} isDemoMode - whether the user explicitly selected Demo Mode
 * @returns {Promise<Object>} prediction result
 */
export async function submitPrediction(input, isDemoMode = false) {
  const { department, arrivalHour, queueLength, staffAvailability } = input;

  // Sanitize values
 /* const payload = {
    department: department.trim(),
    arrival_hour: Number(arrivalHour),
    queue_length: Number(queueLength),
    staff_availability: Number(staffAvailability),
  };*/
  const payload = {
  department: department.trim(),
  arrival_hour: Number(arrivalHour),
  patients_ahead: Number(queueLength),
  staff_available: Number(staffAvailability),
  };
  // If Demo Mode is explicitly enabled by the user
  if (isDemoMode) {
    // Simulate brief calculation processing time for natural UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    const demoResult = calculateDemoPrediction({
      department: payload.department,
      arrivalHour: payload.arrival_hour,
      queueLength: payload.queue_length,
      staffAvailability: payload.staff_availability,
    });

    return {
      success: true,
      isDemo: true,
      source: 'DEMO_SYNTHETIC_MODEL',
      predictedWaitMinutes: demoResult.predictedWaitMinutes,
      confidenceRange: demoResult.confidenceRange,
      serviceRateMinutes: demoResult.serviceRateMinutes,
      peakHourFactor: demoResult.peakHourFactor,
      modelUsed: demoResult.modelUsed,
      submittedInput: {
        department: payload.department,
        arrivalHour: payload.arrival_hour,
        queueLength: payload.queue_length,
        staffAvailability: payload.staff_availability,
      },
      timestamp: demoResult.timestamp,
    };
  }

  // Live Backend Mode: Must call real API endpoint
  try {
    const response = await apiClient.post('/predict', payload);
    const data = response.data;

    // Normalize response fields based on common backend ML structures
    // Accepts either predicted_wait_time, predicted_wait_minutes, wait_time, etc.
    const waitTime = data.predicted_wait_time ?? data.predicted_wait_minutes ?? data.wait_time ?? data.prediction;

    if (waitTime === undefined || waitTime === null) {
      throw new Error('Backend response did not contain a recognized wait time field (expected predicted_wait_time)');
    }

    return {
      success: true,
      isDemo: false,
      source: 'LIVE_BACKEND_API',
      predictedWaitMinutes: Math.round(Number(waitTime) * 10) / 10,
      /*confidenceRange: data.confidence_range || {
        lower: Math.max(0, Math.round((Number(waitTime) - 5.19) * 10) / 10),
        upper: Math.round((Number(waitTime) + 5.19) * 10) / 10,
      },
      serviceRateMinutes: data.service_rate_minutes ?? null,
      peakHourFactor: data.peak_hour_factor ?? 'Standard',
      modelUsed: data.model_used || 'Backend ML Model',*/
      confidenceRange: data.confidence_interval || null,
      serviceRateMinutes: data.service_rate_minutes ?? null,
      peakHourFactor: data.peak_hour_factor ?? 'Standard',
      modelUsed: data.model || 'Backend ML Model',
      submittedInput: {
        department: payload.department,
        arrivalHour: payload.arrival_hour,
        queueLength: payload.queue_length,
        staffAvailability: payload.staff_availability,
      },
      rawResponse: data,
      timestamp: new Date().toISOString(),
    };
   /*catch (error) {
    // IMPORTANT: Per guidelines, never silently fall back to mock data when real API fails!
    console.error('Failed to communicate with live backend ML API:', error);

    let errorMessage = 'Failed to obtain waiting-time prediction from the backend API.';
    if (error.response) {
      errorMessage = `Backend error (${error.response.status}): ${
        error.response.data?.message || error.response.data?.detail || error.response.statusText
      }`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Backend request timed out. Please check if the ML server is responsive.';
    } else if (error.request) {
      errorMessage =
        'Backend server is unreachable. Please verify that the API server is running at ' +
        (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api') +
        ' or switch to Demo Mode in the top bar to test with synthetic regression rules.';
    } else {
      errorMessage = error.message;
    }

    const err = new Error(errorMessage);
    err.isBackendOffline = !error.response;
    err.originalError = error;
    throw err;
  }*/
 
} catch (error) {
  console.error('Failed to communicate with live backend ML API:', error);

  let errorMessage = 'Failed to obtain waiting-time prediction from the backend API.';

  if (error.response) {
    const detail = error.response.data?.detail;

    const message = Array.isArray(detail)
      ? detail.map(item =>
          `${item.loc?.join('.')}: ${item.msg}`
        ).join('; ')
      : typeof detail === 'string'
        ? detail
        : error.response.data?.message || error.response.statusText;

    errorMessage = `Backend error (${error.response.status}): ${message}`;

  } else if (error.code === 'ECONNABORTED') {
    errorMessage = 'Backend request timed out.';

  } else if (error.request) {
    errorMessage = 'Backend server is unreachable. Please check if FastAPI is running.';

  } else {
    errorMessage = error.message;
  }

  const err = new Error(errorMessage);
  err.isBackendOffline = !error.response;
  err.originalError = error;

  throw err;
}

}
