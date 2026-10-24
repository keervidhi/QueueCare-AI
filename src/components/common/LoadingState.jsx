import React from 'react';
import { Activity, Clock } from 'lucide-react';

export default function LoadingState({ message = 'Estimating waiting time with ML model...', subtext = 'Processing department triage load, arrival time curves, and staffing weights' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-soft">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 animate-pulse">
          <Clock className="w-8 h-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow">
          <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <Activity className="w-3 h-3 animate-spin" />
          </div>
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">{message}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{subtext}</p>
      
      {/* Skeleton bar */}
      <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4">
        <div className="w-full h-full bg-gradient-to-r from-brand-500 via-teal-400 to-brand-500 animate-[shimmer_1.5s_infinite] -translate-x-full" />
      </div>
    </div>
  );
}
