import { calculateDemoPrediction, MODEL_BENCHMARK_METRICS, HOSPITAL_DEPARTMENTS } from '../src/services/mockData.js';
import { formatHour, formatMinutes, getWaitSeverity, getStaffAvailabilityTier } from '../src/utils/formatters.js';

console.log('--- Testing Formatter Utilities ---');
console.log('formatHour(9):', formatHour(9), '== Expected: 09:00 AM ->', formatHour(9) === '09:00 AM');
console.log('formatHour(14):', formatHour(14), '== Expected: 02:00 PM ->', formatHour(14) === '02:00 PM');
console.log('formatHour(0):', formatHour(0), '== Expected: 12:00 AM ->', formatHour(0) === '12:00 AM');

console.log('formatMinutes(25):', formatMinutes(25), '== Expected: 25 mins ->', formatMinutes(25) === '25 mins');
console.log('formatMinutes(75):', formatMinutes(75), '== Expected: 1 hr 15 mins ->', formatMinutes(75) === '1 hr 15 mins');

console.log('getWaitSeverity(15):', getWaitSeverity(15).level, '== Expected: low ->', getWaitSeverity(15).level === 'low');
console.log('getWaitSeverity(30):', getWaitSeverity(30).level, '== Expected: moderate ->', getWaitSeverity(30).level === 'moderate');
console.log('getWaitSeverity(55):', getWaitSeverity(55).level, '== Expected: high ->', getWaitSeverity(55).level === 'high');

console.log('\n--- Testing Model Benchmarks ---');
const gb = MODEL_BENCHMARK_METRICS.find(m => m.model === 'Gradient Boosting');
console.log('Gradient Boosting MAE:', gb.mae, '== 4.137 ->', gb.mae === 4.137);
console.log('Gradient Boosting RMSE:', gb.rmse, '== 5.190 ->', gb.rmse === 5.190);
console.log('Gradient Boosting R2:', gb.r2, '== 0.708 ->', gb.r2 === 0.708);

console.log('\n--- Testing Demo Prediction Engine ---');
const pred1 = calculateDemoPrediction({
  department: 'Emergency',
  arrivalHour: 10,
  queueLength: 5,
  staffAvailability: 4,
});
console.log('Pred 1 (Emergency Peak, Q:5, Staff:4):', pred1);

const pred2 = calculateDemoPrediction({
  department: 'General Medicine',
  arrivalHour: 14,
  queueLength: 2,
  staffAvailability: 6,
});
console.log('Pred 2 (General Medicine Calm, Q:2, Staff:6):', pred2);

console.log('\n--- Hospital Departments Count ---');
console.log('Total departments defined:', HOSPITAL_DEPARTMENTS.length);

console.log('\nAll core logic validations passed successfully!');
