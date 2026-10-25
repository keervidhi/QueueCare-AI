import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Building2,
  Users,
  UserCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { submitPrediction, getAvailableDepartments } from '../services/predictionService';
import { formatHour, getStaffAvailabilityTier } from '../utils/formatters';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

export default function Prediction() {
  const navigate = useNavigate();
  const { isDemoMode, savePrediction } = useApp();

  const departments = getAvailableDepartments();

  // Form State
  const initialForm = {
    department: 'General Medicine',
    arrivalHour: new Date().getHours(),
    queueLength: 4,
    staffAvailability: 4,
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Validation function
  const validate = (formToValidate = form) => {
    const newErrors = {};

    if (!form.department || form.department.trim() === '') {
      newErrors.department = 'Please select a hospital department.';
    }

    const hour = Number(form.arrivalHour);
    if (isNaN(hour) || hour < 0 || hour > 23) {
      newErrors.arrivalHour = 'Arrival hour must be an integer between 0 and 23.';
    }

    const queue = Number(form.queueLength);
    if (isNaN(queue) || queue < 0 || !Number.isInteger(queue)) {
      newErrors.queueLength = 'Queue length must be a non-negative whole integer (0 or greater).';
    }

    const staff = Number(form.staffAvailability);
    if (isNaN(staff) || staff < 1) {
      newErrors.staffAvailability = 'Staff availability must be at least 1 medical professional on duty.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user edits
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleReset = () => {
  setForm({
    ...initialForm,
    arrivalHour: new Date().getHours(),
  });
  setErrors({});
  setSubmitError(null);
  };

  const applyPreset = (preset) => {
    setForm(preset);
    setErrors({});
    setSubmitError(null);
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  // Get the current hour when Predict is clicked
  const currentArrivalHour = new Date().getHours();

  const updatedForm = {
    ...form,
    arrivalHour: currentArrivalHour,
  };

  setForm(updatedForm);

  if (!validate(updatedForm)) return;

  setIsSubmitting(true);
  setSubmitError(null);

  try {
    const result = await submitPrediction(updatedForm, isDemoMode);

    savePrediction(result);
    navigate('/result');

  } catch (err) {
    setSubmitError(
      err.message || 'An error occurred while calculating prediction.'
    );
  } finally {
    setIsSubmitting(false);
  }
};


  const currentStaffTier = getStaffAvailabilityTier(form.staffAvailability);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Academic Notice */}
      <DisclaimerBanner compact />

      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            Machine Learning Inference
          </span>
          {isDemoMode && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Demo Mode Active
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Waiting-Time Prediction
        </h1>
        <p className="text-sm text-slate-500">
          Enter patient queue parameters below to estimate outpatient consultation wait time.
        </p>
      </div>

      {/* Quick Test Presets */}
      <div className="bg-slate-100/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Scenario Presets (from 1,200 Synthetic Records):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              applyPreset({
                department: 'Emergency',
                arrivalHour: 10,
                queueLength: 8,
                staffAvailability: 5,
              })
            }
            className="text-xs bg-white hover:bg-slate-50 border border-slate-300/80 px-2.5 py-1.5 rounded-lg text-slate-700 transition-colors font-medium shadow-soft-sm"
          >
            🚨 Emergency Morning Rush (10 AM &bull; 8 in queue)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                department: 'General Medicine',
                arrivalHour: 14,
                queueLength: 3,
                staffAvailability: 6,
              })
            }
            className="text-xs bg-white hover:bg-slate-50 border border-slate-300/80 px-2.5 py-1.5 rounded-lg text-slate-700 transition-colors font-medium shadow-soft-sm"
          >
            ☀️ OPD Calm Afternoon (2 PM &bull; 3 in queue)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                department: 'Cardiology',
                arrivalHour: 11,
                queueLength: 6,
                staffAvailability: 3,
              })
            }
            className="text-xs bg-white hover:bg-slate-50 border border-slate-300/80 px-2.5 py-1.5 rounded-lg text-slate-700 transition-colors font-medium shadow-soft-sm"
          >
            ❤️ Cardiology Peak (11 AM &bull; 6 in queue)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                department: 'Pediatrics',
                arrivalHour: 17,
                queueLength: 5,
                staffAvailability: 4,
              })
            }
            className="text-xs bg-white hover:bg-slate-50 border border-slate-300/80 px-2.5 py-1.5 rounded-lg text-slate-700 transition-colors font-medium shadow-soft-sm"
          >
            🧸 Pediatrics Evening Influx (5 PM &bull; 5 in queue)
          </button>
        </div>
      </div>

      {/* Error Message if any */}
      {submitError && (
        <ErrorMessage
          title="Prediction Request Error"
          message={submitError}
          onRetry={handleSubmit}
        />
      )}

      {/* Main Prediction Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8">
        {isSubmitting ? (
          <LoadingState
            message="Evaluating Queue Dynamics..."
            subtext="Running Gradient Boosting regression with departmental base rates and arrival hour multiplier"
          />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input 1: Hospital Department */}
              <div className="space-y-2">
                <label
                  htmlFor="department"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-brand-600" />
                  <span>Hospital Department *</span>
                </label>
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
                    errors.department
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} (Avg Base: ~{dept.avgBaseWait}m)
                    </option>
                  ))}
                </select>
                {errors.department ? (
                  <p className="text-xs text-rose-600 font-medium">{errors.department}</p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Selected department affects base consultation duration and triage priority.
                  </p>
                )}
              </div>

              {/* Input 2: Patient Arrival Hour */}
              <div className="space-y-2">
                <label
                  htmlFor="arrivalHour"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span>Arrival Hour (24h) *</span>
                  </span>
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {formatHour(form.arrivalHour)}
                  </span>
                </label>
                <div className="space-y-2">
                  <select
                    id="arrivalHour"
                    name="arrivalHour"
                    value={form.arrivalHour}
                    onChange={(e) => handleChange('arrivalHour', Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
                      errors.arrivalHour
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {Array.from({ length: 24 }).map((_, h) => {
                      const isPeak = (h >= 9 && h <= 11) || (h >= 16 && h <= 18);
                      const isQuiet = h >= 0 && h <= 5;
                      return (
                        <option key={h} value={h}>
                          {formatHour(h)} {isPeak ? '🔥 (Peak Rush)' : isQuiet ? '🌙 (Quiet Shift)' : '⏱️ (Normal Flow)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {errors.arrivalHour ? (
                  <p className="text-xs text-rose-600 font-medium">{errors.arrivalHour}</p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Peak outpatient congestion occurs between 09:00 - 11:00 AM and 04:00 - 06:00 PM.
                  </p>
                )}
              </div>

              {/* Input 3: Patients Ahead in Queue */}
              <div className="space-y-2">
                <label
                  htmlFor="queueLength"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span>Patients Ahead in Queue *</span>
                  </span>
                  <span className="text-xs text-slate-500 font-normal">
                    (Non-negative integer)
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange('queueLength', Math.max(0, Number(form.queueLength) - 1))
                    }
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-slate-700 text-lg flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <input
                    id="queueLength"
                    name="queueLength"
                    type="number"
                    min="0"
                    max="100"
                    value={form.queueLength}
                    onChange={(e) => handleChange('queueLength', e.target.value)}
                    className={`flex-1 text-center font-bold text-base px-3.5 py-2 rounded-xl border bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
                      errors.queueLength
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleChange('queueLength', Number(form.queueLength) + 1)
                    }
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-slate-700 text-lg flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
                {errors.queueLength ? (
                  <p className="text-xs text-rose-600 font-medium">{errors.queueLength}</p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Number of currently registered patients waiting ahead of you.
                  </p>
                )}
              </div>

              {/* Input 4: Staff Availability */}
              <div className="space-y-2">
                <label
                  htmlFor="staffAvailability"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-brand-600" />
                    <span>Staff Availability on Duty *</span>
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${currentStaffTier.badge}`}>
                    {currentStaffTier.tier} Staffing
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        'staffAvailability',
                        Math.max(1, Number(form.staffAvailability) - 1)
                      )
                    }
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-slate-700 text-lg flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <input
                    id="staffAvailability"
                    name="staffAvailability"
                    type="number"
                    min="1"
                    max="20"
                    value={form.staffAvailability}
                    onChange={(e) => handleChange('staffAvailability', e.target.value)}
                    className={`flex-1 text-center font-bold text-base px-3.5 py-2 rounded-xl border bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
                      errors.staffAvailability
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleChange('staffAvailability', Number(form.staffAvailability) + 1)
                    }
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-slate-700 text-lg flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
                {errors.staffAvailability ? (
                  <p className="text-xs text-rose-600 font-medium">{errors.staffAvailability}</p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Active doctors / clinical staff attending patients (1-2: Low, 3-5: Moderate, 6+: Optimal).
                  </p>
                )}
              </div>
            </div>

            {/* Actions: Reset and Submit */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset Form</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/25 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Clock className="w-4 h-4" />
                <span>Calculate Estimated Waiting Time</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Input Clarification Helper Box */}
      <div className="bg-sky-50/60 border border-sky-200/70 rounded-2xl p-4 sm:p-5 text-xs text-sky-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sky-900">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Backend Input Interface Note:</span>
        </div>
        <p className="leading-relaxed">
          The prediction engine expects four numeric and categorical features:
          <code className="mx-1 px-1.5 py-0.5 rounded bg-sky-100 font-mono text-[11px]">department (string)</code>,
          <code className="mx-1 px-1.5 py-0.5 rounded bg-sky-100 font-mono text-[11px]">arrival_hour (0-23 int)</code>,
          <code className="mx-1 px-1.5 py-0.5 rounded bg-sky-100 font-mono text-[11px]">queue_length (int &ge; 0)</code>, and
          <code className="mx-1 px-1.5 py-0.5 rounded bg-sky-100 font-mono text-[11px]">staff_availability (active staff count)</code>.
          In Demo Mode, these features feed directly into the calibrated Gradient Boosting model (MAE = 4.137 min).
        </p>
      </div>
    </div>
  );
}
