import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Activity,
  Clock,
  BarChart3,
  Layers,
  Sparkles,
  Server,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDemoMode, setIsDemoMode, backendStatus, latestPrediction } = useApp();

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Layers },
    { to: '/predict', label: 'Predict Waiting Time', icon: Clock },
    ...(latestPrediction
      ? [{ to: '/result', label: 'Prediction Result', icon: CheckCircle2, highlight: true }]
      : []),
    { to: '/analytics', label: 'Analytics Dashboard', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors flex items-center gap-1.5">
                QueueCare <span className="text-brand-600">AI</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200/60">
                  ML
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 -mt-1 hidden sm:block">
                Hospital Flow & Wait Predictor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-soft-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    } ${item.highlight ? 'relative pr-4' : ''}`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Controls: Mode Toggle & Status */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Mode Switcher Pill */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setIsDemoMode(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  isDemoMode
                    ? 'bg-white text-brand-700 shadow-soft-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Use synthetic regression rules matching the 1,200 records"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Demo Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDemoMode(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  !isDemoMode
                    ? 'bg-white text-slate-900 shadow-soft-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Connect to live backend ML API (VITE_API_BASE_URL)"
              >
                <Server className="w-3.5 h-3.5 text-slate-600" />
                <span>Live Backend</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendStatus.online ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                />
              </button>
            </div>

            {/* Quick Status Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                isDemoMode
                  ? 'bg-tealbrand-50/70 border-teal-200 text-teal-800'
                  : backendStatus.online
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
              title={
                isDemoMode
                  ? 'Running offline with synthetic 1,200-record regression rules'
                  : backendStatus.message
              }
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              <span>
                {isDemoMode
                  ? 'Synthetic (1.2k)'
                  : backendStatus.online
                  ? 'API Connected'
                  : 'API Disconnected'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => toggleDemoMode()}
              className="p-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
              aria-label="Toggle demo mode"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{isDemoMode ? 'Demo' : 'Live'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in duration-150">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Mobile Mode Switch */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Simulation Mode
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsDemoMode(true);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center ${
                  isDemoMode
                    ? 'bg-brand-50 border-brand-300 text-brand-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Synthetic Demo (1.2k)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDemoMode(false);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center ${
                  !isDemoMode
                    ? 'bg-brand-50 border-brand-300 text-brand-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Live Backend API
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
