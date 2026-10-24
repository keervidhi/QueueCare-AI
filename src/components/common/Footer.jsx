import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Cpu, Database, HeartPulse, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const { isDemoMode, backendStatus } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Disclaimer Strip */}
      <div className="bg-slate-950/80 border-b border-slate-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Academic Prototype Disclaimer:</strong> QueueCare AI is a machine-learning research project built on a synthetic dataset of 1,200 records. Predictions are non-clinical and must not be used for emergency triage.
            </span>
          </div>
          <span className="text-[11px] text-slate-500 shrink-0">
            AIML Mini Project &bull; Version 1.0.0
          </span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                QueueCare <span className="text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Hospital Waiting-Time and Patient Flow Predictor. Leveraging regression models to estimate patient turnaround times across hospital departments, arrival hours, queue volumes, and clinical staffing.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                <Database className="w-3 h-3 text-brand-400" />
                1,200 Synthetic Records
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                <Cpu className="w-3 h-3 text-teal-400" />
                Gradient Boosting Regressor (R² = 0.708)
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/predict" className="hover:text-white transition-colors">
                  Wait-Time Predictor
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">
                  Patient Flow Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Backend & Model Status */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              System Environment
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Mode:</span>
                  <span className={`font-semibold ${isDemoMode ? 'text-teal-400' : 'text-brand-400'}`}>
                    {isDemoMode ? 'Synthetic Demo Mode' : 'Live Backend Mode'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Backend API:</span>
                  <span className={`flex items-center gap-1 font-medium ${backendStatus.online ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${backendStatus.online ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {backendStatus.online ? 'Online' : 'Not Connected'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate" title={import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}>
                  Target: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; {new Date().getFullYear()} QueueCare AI Research Group. Academic Mini Project.</p>
          <p className="flex items-center gap-1">
            Built with React, Vite, Tailwind CSS, Recharts &amp; Gradient Boosting ML
          </p>
        </div>
      </div>
    </footer>
  );
}
