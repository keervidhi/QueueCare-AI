/*
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Building2,
  Users,
  BrainCircuit,
  Info,
  CheckCircle2,
  Sparkles,
  Server,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getHourlyAnalytics,
  getDepartmentAnalytics,
  getQueueCorrelation,
  getModelBenchmarks,
} from '../services/analyticsService';
import ChartCard from '../components/common/ChartCard';
import StatCard from '../components/common/StatCard';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

export default function Analytics() {
  const { isDemoMode } = useApp();

  const [hourlyData, setHourlyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [modelMetrics, setModelMetrics] = useState([]);
  const [reportedBest, setReportedBest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state for hourly chart: 'all' (0-23h) or 'daytime' (07:00 - 21:00)
  const [hourlyFilter, setHourlyFilter] = useState('all');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hourlyRes, deptRes, scatterRes, modelRes] = await Promise.all([
        getHourlyAnalytics(isDemoMode),
        getDepartmentAnalytics(isDemoMode),
        getQueueCorrelation(isDemoMode),
        getModelBenchmarks(isDemoMode),
      ]);

      setHourlyData(hourlyRes.data || []);
      setDepartmentData(deptRes.data || []);
      setScatterData(scatterRes.data || []);
      setModelMetrics(modelRes.data || []);
      setReportedBest(modelRes.reportedBest || null);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError(err.message || 'Failed to fetch analytics metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [isDemoMode]);

  // Filtered hourly view
  const displayHourlyData =
    hourlyFilter === 'daytime'
      ? hourlyData.filter((d) => d.hour >= 7 && d.hour <= 21)
      : hourlyData;

  // Custom tooltips for polished healthcare UI
  const CustomHourlyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
          <p className="font-bold text-slate-900">{data.hourLabel} ({data.hour}:00 hrs)</p>
          <p className="text-brand-600 font-semibold">
            Average Wait: {data.avgWaitTime} minutes
          </p>
          <p className="text-slate-500">
            Patient Volume Influx: {data.patientVolume} patients
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDeptTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
          <p className="font-bold text-slate-900">{data.department}</p>
          <p className="text-teal-700 font-semibold">
            Average Wait: {data.avgWaitTime} minutes
          </p>
          <p className="text-slate-500">
            Avg Clinical Staff: {data.avgStaff} &bull; Sample Size: {data.patientCount} records
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
          <p className="font-bold text-slate-900">{data.department}</p>
          <p className="text-brand-600 font-semibold">
            Patients Ahead: {data.queueLength} &rarr; Wait: {data.waitTime} mins
          </p>
          <p className="text-slate-500">Staff on duty: {data.staff}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Academic Disclaimer Notice */
      /*<DisclaimerBanner compact />

      {/* Header and Controls */
      /*<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" />
              Patient Flow Intelligence
            </span>
            {isDemoMode ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Synthetic Dataset (1,200 Records)
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Server className="w-3.5 h-3.5" />
                Live API Connected
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics &amp; Model Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive exploratory visualizations derived from 1,200 synthetic hospital visit logs.
          </p>
        </div>
      </div>

      {/* Summary KPI Metrics 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Optimal Regression Model"
          value="Gradient Boosting"
          subtitle="Reported best performing architecture"
          icon={BrainCircuit}
          colorScheme="teal"
          badge="Reported Best"
        />
        <StatCard
          title="Reported MAE"
          value="4.137 min"
          subtitle="Mean Absolute Error (reported benchmark)"
          icon={Clock}
          colorScheme="blue"
          badge="Project Report"
        />
        <StatCard
          title="Reported RMSE"
          value="5.190 min"
          subtitle="Root Mean Squared Error (reported)"
          icon={TrendingUp}
          colorScheme="indigo"
          badge="Project Report"
        />
        <StatCard
          title="Reported R² Fit"
          value="0.708"
          subtitle="Coefficient of determination (reported)"
          icon={CheckCircle2}
          colorScheme="emerald"
          badge="Project Report"
        />
      </div>

      {/* Charts Grid - 2x2 Layout */
      /*<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Average Waiting Time by Arrival Hour (Line Chart) */
        /*<ChartCard
          title="1. Average Waiting Time by Arrival Hour"
          subtitle="Diurnal congestion curve across 24-hour cycle showing morning and evening peak surges"
          badge="Diurnal Trends"
          isLoading={loading}
          error={error}
          onRetry={fetchAnalytics}
          actions={
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setHourlyFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  hourlyFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-soft-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                24 Hours
              </button>
              <button
                type="button"
                onClick={() => setHourlyFilter('daytime')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  hourlyFilter === 'daytime'
                    ? 'bg-white text-slate-900 shadow-soft-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Peak Hours Only
              </button>
            </div>
          }
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayHourlyData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="hourLabel"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Patient Arrival Hour (24h)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Avg Wait (Minutes)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip content={<CustomHourlyTooltip />} />
                <ReferenceLine y={45} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Extended Wait Threshold (45m)', fill: '#e11d48', fontSize: 10, position: 'insideTopRight' }} />
                <Line
                  type="monotone"
                  dataKey="avgWaitTime"
                  name="Avg Wait Time (mins)"
                  stroke="#026bc9"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#026bc9', strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#0e87eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Average Waiting Time by Department (Bar Chart) */
        /*<ChartCard
          title="2. Average Waiting Time by Department"
          subtitle="Specialty comparison reflecting intake protocol complexity and doctor-to-patient ratios"
          badge="Department Influx"
          isLoading={loading}
          error={error}
          onRetry={fetchAnalytics}
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 20, left: -10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="department"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Avg Wait (Minutes)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip content={<CustomDeptTooltip />} />
                <Bar
                  dataKey="avgWaitTime"
                  name="Avg Wait Time (mins)"
                  radius={[6, 6, 0, 0]}
                >
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.avgWaitTime > 40
                          ? '#026bc9'
                          : entry.avgWaitTime > 30
                          ? '#0e87eb'
                          : entry.avgWaitTime > 22
                          ? '#14b8a6'
                          : '#0d9488'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 3: Patients Ahead vs Waiting Time (Scatter Plot) */
        /*<ChartCard
          title="3. Queue Depth vs. Waiting Time Correlation"
          subtitle="Synthetic scatter plot demonstrating linear progression moderated by clinical staffing"
          badge="Queue Correlation"
          isLoading={loading}
          error={error}
          onRetry={fetchAnalytics}
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="queueLength"
                  name="Patients Ahead"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 'dataMax + 2']}
                  label={{ value: 'Number of Patients Ahead in Queue', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  type="number"
                  dataKey="waitTime"
                  name="Waiting Time (mins)"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 'dataMax + 10']}
                  label={{ value: 'Observed Wait (Minutes)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip content={<CustomScatterTooltip />} />
                <Scatter
                  name="Outpatient Records"
                  data={scatterData}
                  fill="#026bc9"
                  fillOpacity={0.75}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 4: Model Performance Comparison (Grouped Bar Chart) */
       /* <ChartCard
          title="4. Machine Learning Model Performance Comparison"
          subtitle="Evaluation across MAE, RMSE, and R² (reported project report experimental benchmarks)"
          badge="Reported Benchmarks"
          isLoading={loading}
          error={error}
          onRetry={fetchAnalytics}
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelMetrics} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="model"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Metric Value (MAE / RMSE in mins)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'R² Score' ? `${value}` : `${value} mins`,
                    name,
                  ]}
                  contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                />
                <Bar dataKey="mae" name="MAE (Minutes - Lower is better)" fill="#026bc9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rmse" name="RMSE (Minutes - Lower is better)" fill="#38a5f8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="r2" name="R² Score (Higher is better)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Reported Experimental Benchmark Table */
      /*<section id="models" className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-brand-600" />
              <span>Reported Experimental Model Evaluation Metrics</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Trained on 1,200 synthetic patient wait-time records. Values labeled as reported experimental results from the QueueCare AI project report.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 w-fit">
            Academic Report Benchmark
          </span>
        </div>

        {/* Highlight Card for Gradient Boosting */
        /*<div className="bg-gradient-to-r from-brand-50 via-teal-50/50 to-white border border-brand-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                Primary Selected Architecture:
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white">
                Best Overall Performance
              </span>
            </div>
            <h4 className="text-lg font-extrabold text-slate-900">
              Gradient Boosting Regressor
            </h4>
            <p className="text-xs text-slate-600 max-w-xl">
              Reported in project documentation as achieving the lowest prediction error and highest variance explanation across diverse department loads.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-white/80 backdrop-blur-sm p-3.5 rounded-xl border border-brand-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Reported MAE</p>
              <p className="text-xl font-black text-brand-700">4.137 <span className="text-xs font-medium text-slate-500">mins</span></p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Reported RMSE</p>
              <p className="text-xl font-black text-brand-700">5.190 <span className="text-xs font-medium text-slate-500">mins</span></p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Reported R²</p>
              <p className="text-xl font-black text-teal-700">0.708</p>
            </div>
          </div>
        </div>

        {/* Detailed Table */
        /*<div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Regression Model</th>
                <th className="py-3 px-4">Mean Absolute Error (MAE)</th>
                <th className="py-3 px-4">Root Mean Squared Error (RMSE)</th>
                <th className="py-3 px-4">R-Squared (R²)</th>
                <th className="py-3 px-4">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {modelMetrics.map((item) => (
                <tr
                  key={item.model}
                  className={item.isReportedBest ? 'bg-brand-50/40 font-semibold' : 'hover:bg-slate-50/60'}
                >
                  <td className="py-3 px-4 flex items-center gap-2 text-slate-900">
                    {item.isReportedBest && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    )}
                    <span>{item.model}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {item.mae.toFixed(3)} mins
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {item.rmse.toFixed(3)} mins
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {item.r2.toFixed(3)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        item.isReportedBest
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

----------------------------------------------------------------------------------------------

*/

import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

import {
  BarChart3, BrainCircuit, Clock, TrendingUp,
  CheckCircle2, RefreshCw
} from 'lucide-react';

import { useApp } from '../context/AppContext';

import {
  getHourlyAnalytics,
  getDepartmentAnalytics,
  getQueueCorrelation,
  getModelBenchmarks
} from '../services/analyticsService';

import ChartCard from '../components/common/ChartCard';
import StatCard from '../components/common/StatCard';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

export default function Analytics() {
  const { isDemoMode } = useApp();

  const [hourlyData, setHourlyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [modelMetrics, setModelMetrics] = useState([]);
  const [reportedBest, setReportedBest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [hourlyFilter, setHourlyFilter] = useState('all');

  async function fetchAnalytics() {
    setLoading(true);
    setErrors({});

    const results = await Promise.allSettled([
      getHourlyAnalytics(isDemoMode),
      getDepartmentAnalytics(isDemoMode),
      getQueueCorrelation(isDemoMode),
      getModelBenchmarks(isDemoMode)
    ]);

    const nextErrors = {};
    const names = ['hourly', 'department', 'scatter', 'models'];

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        nextErrors[names[index]] =
          result.reason?.message || 'Unable to load data';
      }
    });

    setHourlyData(
      results[0].status === 'fulfilled'
        ? results[0].value.data
        : []
    );

    setDepartmentData(
      results[1].status === 'fulfilled'
        ? results[1].value.data
        : []
    );

    setScatterData(
      results[2].status === 'fulfilled'
        ? results[2].value.data
        : []
    );

    if (results[3].status === 'fulfilled') {
      setModelMetrics(results[3].value.data);
      setReportedBest(results[3].value.reportedBest);
    } else {
      setModelMetrics([]);
      setReportedBest(null);
    }

    setErrors(nextErrors);
    setLoading(false);
  }

  useEffect(() => {
    fetchAnalytics();
  }, [isDemoMode]);

  const filteredHourlyData =
    hourlyFilter === 'daytime'
      ? hourlyData.filter(
          item => Number(item.hour) >= 7 &&
                  Number(item.hour) <= 21
        )
      : hourlyData;

  const metricValue = (key, unit = '') => {
    if (!reportedBest) return '—';

    const value = Number(reportedBest[key]);

    return Number.isFinite(value)
      ? `${value.toFixed(3)}${unit}`
      : '—';
  };

  const chartProps = {
    isLoading: loading,
    onRetry: fetchAnalytics
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <DisclaimerBanner compact />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-700 text-sm font-semibold">
            <BarChart3 size={18} />
            Patient Flow Intelligence
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Analytics &amp; Model Benchmarks
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Hospital queue analytics and trained machine learning results
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {isDemoMode
              ? 'Demo data for patient-flow charts; trained model metrics from FastAPI'
              : 'Live backend analytics and trained model metrics'}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          title="Optimal Regression Model"
          value={reportedBest?.model || '—'}
          subtitle="Best model selected during training"
          icon={BrainCircuit}
          colorScheme="teal"
          badge="Trained Best"
        />

        <StatCard
          title="Trained Model MAE"
          value={metricValue('mae', ' min')}
          subtitle="Mean Absolute Error"
          icon={Clock}
          colorScheme="blue"
          badge="Model Evaluation"
        />

        <StatCard
          title="Trained Model RMSE"
          value={metricValue('rmse', ' min')}
          subtitle="Root Mean Squared Error"
          icon={TrendingUp}
          colorScheme="indigo"
          badge="Model Evaluation"
        />

        <StatCard
          title="Trained Model R² Fit"
          value={metricValue('r2')}
          subtitle="Coefficient of determination"
          icon={CheckCircle2}
          colorScheme="emerald"
          badge="Model Evaluation"
        />

      </div>

      {/* Four Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1 */}
        <ChartCard
          title="1. Average Waiting Time by Arrival Hour"
          subtitle="Waiting time distribution across the day"
          badge="Hourly Trends"
          {...chartProps}
          error={errors.hourly}
          actions={
            <select
              value={hourlyFilter}
              onChange={e => setHourlyFilter(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="all">24 Hours</option>
              <option value="daytime">Peak Hours Only</option>
            </select>
          }
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredHourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hourLabel"
                  fontSize={11}
                />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgWaitTime"
                  name="Average Wait (min)"
                  stroke="#026bc9"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2 */}
        <ChartCard
          title="2. Average Waiting Time by Department"
          subtitle="Comparison of hospital departments"
          badge="Department Analysis"
          {...chartProps}
          error={errors.department}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                margin={{ bottom: 35 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  fontSize={10}
                />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="avgWaitTime"
                  name="Average Wait (min)"
                  radius={[5, 5, 0, 0]}
                >
                  {departmentData.map((item, index) => (
                    <Cell
                      key={index}
                      fill={
                        item.avgWaitTime > 40
                          ? '#026bc9'
                          : item.avgWaitTime > 30
                          ? '#38a5f8'
                          : '#14b8a6'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 3 */}
        <ChartCard
          title="3. Queue Depth vs. Waiting Time Correlation"
          subtitle="Relationship between patients ahead and waiting time"
          badge="Queue Correlation"
          {...chartProps}
          error={errors.scatter}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="queueLength"
                  name="Patients Ahead"
                  fontSize={11}
                />
                <YAxis
                  type="number"
                  dataKey="waitTime"
                  name="Waiting Time"
                  fontSize={11}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter
                  name="Patient Records"
                  data={scatterData}
                  fill="#026bc9"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 4 */}
        <ChartCard
          title="4. Machine Learning Model Performance Comparison"
          subtitle="Actual trained model evaluation results"
          badge="Trained Metrics"
          {...chartProps}
          error={errors.models}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={modelMetrics}
                margin={{ bottom: 35 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="model"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  fontSize={10}
                />
                <YAxis fontSize={11} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'R²'
                      ? `${value}`
                      : `${value} min`,
                    name
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="mae"
                  name="MAE"
                  fill="#026bc9"
                />
                <Bar
                  dataKey="rmse"
                  name="RMSE"
                  fill="#38a5f8"
                />
                <Bar
                  dataKey="r2"
                  name="R²"
                  fill="#14b8a6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

      {/* Best Model Highlight */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Best Performing Machine Learning Model
        </h2>

        {errors.models && (
          <p className="text-red-600 text-sm mb-4">
            {errors.models}
          </p>
        )}

        <div className="bg-blue-50 rounded-2xl p-5">
          <h3 className="text-xl font-bold text-blue-900">
            {reportedBest?.model || 'Model unavailable'}
          </h3>

          <p className="text-sm text-slate-600 mt-2">
            Selected using the trained model evaluation results.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

            <div className="bg-white p-4 rounded-xl">
              <p className="text-xs text-slate-500">MAE</p>
              <p className="text-xl font-bold text-blue-700">
                {metricValue('mae', ' min')}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <p className="text-xs text-slate-500">RMSE</p>
              <p className="text-xl font-bold text-blue-700">
                {metricValue('rmse', ' min')}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <p className="text-xs text-slate-500">R² Score</p>
              <p className="text-xl font-bold text-teal-700">
                {metricValue('r2')}
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* Model Evaluation Table */}
      <section
        id="models"
        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Trained Model Evaluation Metrics
        </h2>

        <p className="text-sm text-slate-500 mb-5">
          Model comparison using the synthetic hospital queue dataset.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Regression Model</th>
                <th className="p-3">MAE (min)</th>
                <th className="p-3">RMSE (min)</th>
                <th className="p-3">R²</th>
                <th className="p-3">CV-RMSE</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {modelMetrics.map(item => (
                <tr
                  key={item.model}
                  className={
                    item.isReportedBest
                      ? 'bg-teal-50 border-b'
                      : 'border-b hover:bg-slate-50'
                  }
                >
                  <td className="p-3 font-semibold">
                    {item.model}
                  </td>

                  <td className="p-3">
                    {Number(item.mae).toFixed(3)}
                  </td>

                  <td className="p-3">
                    {Number(item.rmse).toFixed(3)}
                  </td>

                  <td className="p-3">
                    {Number(item.r2).toFixed(3)}
                  </td>

                  <td className="p-3">
                    {Number(item.cv_rmse).toFixed(3)}
                  </td>

                  <td className="p-3">
                    <span
                      className={
                        item.isReportedBest
                          ? 'text-teal-700 font-bold'
                          : 'text-slate-500'
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </section>

    </div>
  );
}
