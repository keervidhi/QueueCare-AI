import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Building2,
  Users,
  UserCheck,
  RotateCcw,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Server,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  formatHour,
  formatMinutes,
  getWaitSeverity,
  getStaffAvailabilityTier,
} from '../utils/formatters';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

export default function PredictionResult() {
  const navigate = useNavigate();
  const { latestPrediction, clearPrediction, isDemoMode } = useApp();

  // Empty state handling
  if (!latestPrediction) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-soft">
          <Clock className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            No Waiting-Time Prediction Yet
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Submit your hospital department, patient arrival hour, and current queue details to generate an ML-estimated waiting time.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/25 transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>Go to Prediction Form</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  }

  const {
    predictedWaitMinutes,
    confidenceRange,
    serviceRateMinutes,
    peakHourFactor,
    modelUsed,
    submittedInput,
    source,
    isDemo,
    timestamp,
  } = latestPrediction;

  const severity = getWaitSeverity(predictedWaitMinutes);
  const staffTier = getStaffAvailabilityTier(submittedInput.staffAvailability);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Academic Disclaimer Notice */}
      <DisclaimerBanner compact />

      {/* Header and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Inference Complete
            </span>

            {isDemo ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Demo Model (1,200 Records)
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
                <Server className="w-3.5 h-3.5" />
                Live ML Backend API
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prediction Results
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/predict')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Predict Again</span>
          </button>

          <Link
            to="/analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Prominent Estimated Waiting Time Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle accent backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-100/50 via-teal-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${severity.badgeBg}`}>
                {severity.label}
              </span>
              <span className="text-xs text-slate-400">
                &bull; Calculated at {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Estimated Outpatient Waiting Time
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                  {Math.round(predictedWaitMinutes)}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-slate-500">
                  minutes
                </span>
                <span className="text-sm font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 ml-2">
                  (~{formatMinutes(predictedWaitMinutes)})
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {severity.description}
            </p>

            {/* Confidence Interval pill */}
            {confidenceRange && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>
                  Estimated interval:{' '}
                  <strong>{confidenceRange.lower} – {confidenceRange.upper} mins</strong> (±5.19 min RMSE)
                </span>
              </div>
            )}
          </div>

          {/* Quick Metrics Pillar */}
          <div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-5 space-y-3 shrink-0 min-w-[260px]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-200">
              Inference Snapshot
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Model:</span>
                <span className="font-semibold text-slate-800">{modelUsed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Service Rate:</span>
                <span className="font-semibold text-slate-800">
                  {serviceRateMinutes ? `~${serviceRateMinutes} min/patient` : 'Calibrated Rate'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Hourly Influx Factor:</span>
                <span className="font-semibold text-slate-800">{peakHourFactor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Data Source:</span>
                <span className="font-semibold text-teal-700">{source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Parameters Summary Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            <span>Submitted Patient Queue Parameters</span>
          </h3>
          <span className="text-xs text-slate-400">Values passed to ML model</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Department */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>Department</span>
            </div>
            <p className="text-base font-bold text-slate-900">
              {submittedInput.department}
            </p>
            <p className="text-[11px] text-slate-400">Clinical Specialty Unit</p>
          </div>

          {/* Arrival Hour */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Arrival Time</span>
            </div>
            <p className="text-base font-bold text-slate-900">
              {formatHour(submittedInput.arrivalHour)}
            </p>
            <p className="text-[11px] text-slate-400">Hour {submittedInput.arrivalHour}:00 Influx</p>
          </div>

          {/* Queue Length */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Users className="w-4 h-4 text-brand-600" />
              <span>Patients Ahead</span>
            </div>
            <p className="text-base font-bold text-slate-900">
              {submittedInput.queueLength} {submittedInput.queueLength === 1 ? 'patient' : 'patients'}
            </p>
            <p className="text-[11px] text-slate-400">Position in triage line</p>
          </div>

          {/* Staff Availability */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <UserCheck className="w-4 h-4 text-brand-600" />
              <span>Active Staffing</span>
            </div>
            <p className="text-base font-bold text-slate-900">
              {submittedInput.staffAvailability} on duty
            </p>
            <p className={`text-[11px] font-semibold ${staffTier.badge} inline-block px-1.5 rounded`}>
              {staffTier.tier} Capacity
            </p>
          </div>
        </div>
      </div>

      {/* Model-Based Estimate Clarification Note */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-5 text-xs sm:text-sm text-slate-700 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Understanding Your Model-Based Estimate</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          This prediction is computed via Gradient Boosting regression calibrated on a synthetic dataset of 1,200 outpatient visits. The algorithm accounts for patient queue accumulation, non-linear arrival surge windows (morning and evening shifts), and available clinical staffing capacity. It does not replace real triage evaluation.
        </p>
      </div>

      {/* Bottom Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={() => {
            clearPrediction();
            navigate('/predict');
          }}
          className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
        >
          Clear this prediction and return to form
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/predict')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Predict Another</span>
          </button>
          <Link
            to="/analytics"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/20 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Explore Analytics Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
