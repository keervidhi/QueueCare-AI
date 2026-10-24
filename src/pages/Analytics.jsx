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
      {/* Top Academic Disclaimer Notice */}
      <DisclaimerBanner compact />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

      {/* Summary KPI Metrics */}
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

      {/* Charts Grid - 2x2 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Average Waiting Time by Arrival Hour (Line Chart) */}
        <ChartCard
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

        {/* Chart 2: Average Waiting Time by Department (Bar Chart) */}
        <ChartCard
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

        {/* Chart 3: Patients Ahead vs Waiting Time (Scatter Plot) */}
        <ChartCard
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

        {/* Chart 4: Model Performance Comparison (Grouped Bar Chart) */}
        <ChartCard
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

      {/* Reported Experimental Benchmark Table */}
      <section id="models" className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-4">
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

        {/* Highlight Card for Gradient Boosting */}
        <div className="bg-gradient-to-r from-brand-50 via-teal-50/50 to-white border border-brand-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        {/* Detailed Table */}
        <div className="overflow-x-auto pt-2">
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
