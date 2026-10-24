import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="bg-amber-50/90 border border-amber-200 text-amber-900 text-xs px-3 py-2 rounded-lg flex items-center justify-between gap-2 shadow-soft-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Academic Prototype Notice:</strong> Predictions are generated from a 1,200-record synthetic research dataset and are <em>not</em> clinically validated or suitable for emergency triage.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-500 hover:text-amber-800 p-0.5 rounded transition-colors"
          aria-label="Dismiss disclaimer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Academic prototype notice"
      className="bg-gradient-to-r from-amber-50 via-amber-50/80 to-amber-100/50 border-b border-amber-200/80 text-amber-900 text-xs sm:text-sm px-4 py-2.5 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-amber-100 text-amber-700 rounded-md shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="leading-tight">
            <strong className="font-semibold text-amber-950">Academic Prototype:</strong> This application demonstrates machine learning regression models trained on a synthetic dataset of 1,200 patient flow records. Estimates are for educational exploration only and must <strong>never</strong> be used for actual medical diagnosis or emergency triage.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-950 p-1 rounded-md hover:bg-amber-100/70 transition-colors shrink-0"
          title="Dismiss"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
