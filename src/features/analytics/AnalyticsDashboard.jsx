import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import "./analytics-styles.css";

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="card analytics-stat-card">
    <div className="analytics-stat-content">
      <p className="analytics-stat-label">{title}</p>
      <h3 className="analytics-stat-value">{value}</h3>
      <p
        className={`analytics-stat-change ${change >= 0 ? "positive" : "negative"}`}
      >
        {change >= 0 ? "+" : ""}
        {change}% from last month
      </p>
    </div>
    <div
      className="analytics-stat-icon"
      style={{ backgroundColor: `${color}20`, color: color }}
    >
      <Icon size={24} />
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  // Mock Data
  const employeeGrowthData = [
    { month: "Jan", employees: 45 },
    { month: "Feb", employees: 52 },
    { month: "Mar", employees: 48 },
    { month: "Apr", employees: 61 },
    { month: "May", employees: 67 },
    { month: "Jun", employees: 75 },
  ];

  const departmentData = [
    { name: "Engineering", value: 35, color: "#4f46e5" },
    { name: "Design", value: 25, color: "#ec4899" },
    { name: "Marketing", value: 20, color: "#8b5cf6" },
    { name: "Sales", value: 15, color: "#10b981" },
    { name: "HR", value: 5, color: "#f59e0b" },
  ];

  const performanceData = [
    { name: "Mon", performance: 85 },
    { name: "Tue", performance: 88 },
    { name: "Wed", performance: 92 },
    { name: "Thu", performance: 89 },
    { name: "Fri", performance: 94 },
  ];

  return (
    <div className="analytics-container">
      {/* Stats Row */}
      <div className="analytics-stats-grid">
        <StatCard
          title="Total Employees"
          value="75"
          change={12}
          icon={Users}
          color="#4f46e5"
        />
        <StatCard
          title="Avg. Performance"
          value="92%"
          change={5}
          icon={Activity}
          color="#10b981"
        />
        <StatCard
          title="Total Payroll"
          value="$142k"
          change={8}
          icon={DollarSign}
          color="#f59e0b"
        />
        <StatCard
          title="Hiring Pipeline"
          value="12"
          change={-2}
          icon={TrendingUp}
          color="#ec4899"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="analytics-charts-row">
        {/* Growth Chart */}
        <div className="card analytics-chart-card">
          <h3 className="analytics-chart-title">Employee Growth</h3>
          <div className="analytics-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={employeeGrowthData}>
                <defs>
                  <linearGradient
                    id="colorEmployees"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="employees"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEmployees)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="card analytics-chart-card">
          <h3 className="analytics-chart-title">Department Distribution</h3>
          <div className="analytics-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="analytics-performance-row">
        {/* Performance Trend */}
        <div className="card analytics-chart-card">
          <h3 className="analytics-chart-title">Weekly Performance</h3>
          <div className="analytics-performance-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} barSize={40}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "0",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="performance"
                  fill="#10b981"
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="card analytics-insights-card">
          <h3 className="analytics-chart-title">Quick Insights</h3>
          <div className="analytics-insights-list">
            <div className="analytics-insight-item primary">
              <div className="analytics-insight-header">
                <p className="analytics-insight-label">Top Performer</p>
                <span className="analytics-insight-badge">Engineering</span>
              </div>
              <p className="analytics-insight-value">Ananya Gupta</p>
            </div>
            <div className="analytics-insight-item purple">
              <div className="analytics-insight-header">
                <p className="analytics-insight-label">Most Active Dept</p>
                <span className="analytics-insight-badge">98% Done</span>
              </div>
              <p className="analytics-insight-value">Design Team</p>
            </div>
            <div className="analytics-insight-item orange">
              <div className="analytics-insight-header">
                <p className="analytics-insight-label">Upcoming Reviews</p>
                <span className="analytics-insight-badge">This Week</span>
              </div>
              <p className="analytics-insight-value">12 Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
