import React from 'react';
import { AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';

export default function ChartCard({
  title,
  subtitle,
  children,
  badge,
  actions,
  isLoading = false,
  error = null,
  isEmpty = false,
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:border-slate-300 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            {badge && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[300px] flex flex-col justify-center">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500">Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Unable to load chart</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">{error}</p>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            )}
          </div>
        ) : isEmpty ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400 text-center">
            <BarChart2 className="w-8 h-8 stroke-1 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No chart data available</p>
            <p className="text-xs text-slate-400">Please adjust filters or retry.</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
