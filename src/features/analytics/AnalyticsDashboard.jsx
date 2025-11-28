import React, { useState, useEffect, useMemo } from "react";
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
import {
  Users,
  TrendingUp,
  Award,
  DollarSign,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { employeeService } from "../../services/employeeService";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./analytics-styles.css";

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="card analytics-stat-card">
    <div className="analytics-stat-content">
      <p className="analytics-stat-label">{title}</p>
      <h3 className="analytics-stat-value">{value}</h3>
      {change !== undefined && (
        <p
          className={`analytics-stat-change ${change >= 0 ? "positive" : "negative"}`}
        >
          {change >= 0 ? "+" : ""}
          {change}% from last month
        </p>
      )}
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
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data } = await employeeService.getAll();
      if (data) {
        setEmployees(data);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Calculate Statistics
  const stats = useMemo(() => {
    const totalEmployees = employees.length;

    // Department Distribution
    const deptCounts = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});

    const departmentData = Object.entries(deptCounts).map(([name, value], index) => ({
      name,
      value,
      color: [
        "#4f46e5", // Indigo
        "#ec4899", // Pink
        "#8b5cf6", // Violet
        "#10b981", // Emerald
        "#f59e0b", // Amber
        "#3b82f6", // Blue
        "#ef4444", // Red
      ][index % 7]
    }));

    // Employee Growth (Mocked for now as we don't have historical data API, 
    // but we can simulate based on join dates if available, or keep mock for trend)
    // For this implementation, let's calculate growth based on join_date if possible, 
    // or fallback to a static trend for visual consistency if dates aren't reliable.
    // Let's try to group by month of join_date for the current year.
    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const growthData = months.map((month, index) => {
      // Count employees joined up to this month in current year
      // This is a cumulative count approximation
      const count = employees.filter(emp => {
        const joinDate = new Date(emp.join_date);
        return joinDate.getFullYear() < currentYear ||
          (joinDate.getFullYear() === currentYear && joinDate.getMonth() <= index);
      }).length;

      return { month, employees: count };
    }).slice(0, new Date().getMonth() + 1); // Only show up to current month

    return {
      totalEmployees,
      departmentData,
      growthData: growthData.length > 0 ? growthData : [{ month: 'Jan', employees: 0 }]
    };
  }, [employees]);

  if (isLoading) {
    return (
      <div className="analytics-container">
        <LoadingSpinner size="lg" message="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Stats Row */}
      <div className="analytics-stats-grid">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          change={12}
          icon={Users}
          color="#4f46e5"
        />
        <StatCard
          title="Avg. Performance"
          value="N/A"
          icon={Award}
          color="warning"
        />
        <StatCard
          title="Total Payroll"
          value="N/A"
          icon={DollarSign}
          color="success"
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
              <AreaChart data={stats.growthData}>
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
                  data={stats.departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.departmentData.map((entry, index) => (
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


    </div>
  );
};

export default AnalyticsDashboard;
