import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  BarChart3,
  GitCompare,
  ArrowRight,
  ShieldCheck,
  Activity,
  Users,
  CheckCircle,
  Stethoscope,
  TrendingUp,
  BrainCircuit,
  Sliders,
  Sparkles,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { isDemoMode } = useApp();

  const keyFeatures = [
    {
      title: 'Wait-Time Prediction',
      icon: Clock,
      color: 'blue',
      description:
        'Estimate consultation and triage wait times based on real-time department congestion, current queue depth, arrival hour, and on-duty medical staffing.',
      linkTo: '/predict',
      linkText: 'Launch Predictor',
      badge: 'ML Regressor',
    },
    {
      title: 'Patient Flow Analytics',
      icon: BarChart3,
      color: 'teal',
      description:
        'Explore hospital influx patterns across 24-hour cycles, departmental bottlenecks, and correlation scatter plots between queue length and wait duration.',
      linkTo: '/analytics',
      linkText: 'View Flow Charts',
      badge: 'Interactive Charts',
    },
    {
      title: 'Model Benchmarking',
      icon: GitCompare,
      color: 'indigo',
      description:
        'Compare regression architectures: Gradient Boosting (Reported MAE = 4.861 min, R² = 0.926) versus Random Forest, Decision Trees, and Linear Regression.',
      linkTo: '/analytics#models',
      linkText: 'Inspect Metrics',
      badge: 'Reported Metrics',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Patient Influx Input',
      desc: 'User inputs patient department, arrival hour, active queue position, and clinical staffing count.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Feature Transformation',
      desc: 'Inputs are mapped to non-linear peak hour factors, departmental baseline rates, and staffing capacity coefficients.',
      icon: Sliders,
    },
    {
      step: '03',
      title: 'Gradient Boosting Regression',
      desc: 'The trained regression model infers expected delay with an experimental error of ±5.19 minutes RMSE.',
      icon: BrainCircuit,
    },
    {
      step: '04',
      title: 'Actionable Triage Insights',
      desc: 'Visual indicators categorize the wait time into Low, Moderate, or High with confidence bounds and next steps.',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Top Academic Disclaimer Notice */}
      <DisclaimerBanner />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <div className="relative rounded-3xl bg-gradient-to-b from-brand-50/70 via-sky-50/40 to-white border border-brand-100/80 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-soft">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-brand-200 text-xs font-semibold text-brand-800 shadow-soft-sm">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              <span>AIML Academic Mini Project &bull; Synthetic Dataset (1,200 Records)</span>
            </div>

            {/* Title & Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Intelligent Hospital Waiting-Time &amp;{' '}
                <span className="bg-gradient-to-r from-brand-600 to-teal-600 bg-clip-text text-transparent">
                  Patient Flow Predictor
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                QueueCare AI estimates hospital outpatient turnaround and triage waiting times using machine-learning regression. Designed to help patients plan visits and assist clinical administrators in anticipating daily queue congestion.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/predict"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm sm:text-base shadow-md shadow-brand-600/25 transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Clock className="w-5 h-5" />
                <span>Predict Waiting Time</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/analytics"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-300/80 shadow-soft-sm transition-all duration-150 hover:border-slate-400"
              >
                <BarChart3 className="w-5 h-5 text-teal-600" />
                <span>Explore Analytics</span>
              </Link>

              {isDemoMode && (
                <div className="flex items-center gap-1.5 text-xs text-teal-800 bg-tealbrand-50 px-3 py-2 rounded-lg border border-teal-200">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Interactive Demo Mode Active</span>
                </div>
              )}
            </div>

            {/* Quick Micro-Trust Badges */}
            <div className="pt-4 border-t border-slate-200/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Gradient Boosting (MAE: 4.861 min)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>R² Score: 0.926 (Reported Benchmark)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>8 Outpatient Departments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experimental Stats Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Synthetic Training Records"
            value="1,200"
            subtitle="Synthetic hospital patient arrivals & wait logs"
            icon={Users}
            colorScheme="blue"
            badge="Dataset"
          />
          <StatCard
            title="Reported MAE (Best Model)"
            value="4.861 m"
            subtitle="Gradient Boosting Mean Absolute Error"
            icon={TrendingUp}
            colorScheme="teal"
            badge="Benchmark"
          />
          <StatCard
            title="Reported RMSE"
            value="6.162 m"
            subtitle="Root Mean Squared Error variance"
            icon={Activity}
            colorScheme="indigo"
            badge="Accuracy"
          />
          <StatCard
            title="Model Fit (R² Score)"
            value="0.926"
            subtitle="Variance explained across queue dynamics"
            icon={BrainCircuit}
            colorScheme="emerald"
            badge="Optimal"
          />
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Hospital Flow Intelligence
          </h2>
          <p className="text-sm text-slate-500">
            Tailored features for predicting outpatient delays, discovering departmental peak hours, and assessing ML regression reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {keyFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-soft hover:shadow-soft-md transition-all duration-200 flex flex-col justify-between group hover:border-brand-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    to={feat.linkTo}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>{feat.linkText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-soft-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-400">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              How QueueCare AI Predicts Waiting Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              From raw arrival variables to calibrated regression predictions in under 500 milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={st.step}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3 relative group hover:border-brand-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-600 group-hover:text-brand-400 transition-colors">
                      {st.step}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-700/60 text-teal-400">
                      <StepIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>Gradient Boosting model minimizes loss on non-linear queue surges.</span>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors"
            >
              Test the Predictor Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
