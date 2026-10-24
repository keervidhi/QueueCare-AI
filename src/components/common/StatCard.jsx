import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  badge,
}) {
  const colorMap = {
    blue: {
      bg: 'bg-brand-50/70',
      text: 'text-brand-600',
      border: 'border-brand-100',
      accent: 'border-l-brand-600',
    },
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-100',
      accent: 'border-l-teal-600',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      accent: 'border-l-amber-500',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      accent: 'border-l-emerald-600',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      accent: 'border-l-indigo-600',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.blue;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft transition-all duration-200 hover:shadow-soft-md hover:border-slate-300 relative overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </h3>
            {badge && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 text-xs font-medium mt-1">
              <span className={trend.isPositive ? 'text-emerald-600' : 'text-slate-600'}>
                {trend.value}
              </span>
              <span className="text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} border ${scheme.border} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
