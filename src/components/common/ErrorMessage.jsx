import React from 'react';
import { AlertCircle, RefreshCw, Sparkles, ServerCrash } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ErrorMessage({
  title = 'Prediction Request Failed',
  message,
  onRetry,
  showDemoSwitch = true,
}) {
  const { isDemoMode, setIsDemoMode } = useApp();

  return (
    <div className="bg-rose-50/90 border border-rose-200/90 rounded-2xl p-5 text-rose-950 shadow-soft">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5">
          <ServerCrash className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-bold tracking-tight text-rose-900">{title}</h4>
          <p className="text-xs sm:text-sm text-rose-800 leading-relaxed font-normal">
            {message}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors shadow-soft-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Live Request
              </button>
            )}

            {showDemoSwitch && !isDemoMode && (
              <button
                type="button"
                onClick={() => setIsDemoMode(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-tealbrand-700 text-white hover:bg-tealbrand-600 transition-colors shadow-soft-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Switch to Demo Mode (1,200 Synthetic Records)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
