import React from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="card flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className={`text-xs font-medium mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}% from last month
            </p>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}20`, color: color }}>
            <Icon size={24} />
        </div>
    </div>
);

const AnalyticsDashboard = () => {
    // Mock Data
    const employeeGrowthData = [
        { month: 'Jan', employees: 45 },
        { month: 'Feb', employees: 52 },
        { month: 'Mar', employees: 48 },
        { month: 'Apr', employees: 61 },
        { month: 'May', employees: 67 },
        { month: 'Jun', employees: 75 },
    ];

    const departmentData = [
        { name: 'Engineering', value: 35, color: '#4f46e5' },
        { name: 'Design', value: 25, color: '#ec4899' },
        { name: 'Marketing', value: 20, color: '#8b5cf6' },
        { name: 'Sales', value: 15, color: '#10b981' },
        { name: 'HR', value: 5, color: '#f59e0b' },
    ];

    const performanceData = [
        { name: 'Mon', performance: 85 },
        { name: 'Tue', performance: 88 },
        { name: 'Wed', performance: 92 },
        { name: 'Thu', performance: 89 },
        { name: 'Fri', performance: 94 },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Employees" value="75" change={12} icon={Users} color="#4f46e5" />
                <StatCard title="Avg. Performance" value="92%" change={5} icon={Activity} color="#10b981" />
                <StatCard title="Total Payroll" value="$142k" change={8} icon={DollarSign} color="#f59e0b" />
                <StatCard title="Hiring Pipeline" value="12" change={-2} icon={TrendingUp} color="#ec4899" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-6">Employee Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={employeeGrowthData}>
                                <defs>
                                    <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="employees" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorEmployees)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Distribution */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-6">Department Distribution</h3>
                    <div className="h-80">
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
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Trend */}
                <div className="card lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-6">Weekly Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="performance" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions / Summary */}

                <div className="card h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-6">Quick Insights</h3>
                    <div className="space-y-4 flex-1">
                        <div className="p-4 bg-indigo-50 rounded-sm border border-indigo-100 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-indigo-600 font-medium">Top Performer</p>
                                <span className="text-xs text-indigo-500 font-medium bg-indigo-100 px-2 py-1 rounded-sm">Engineering</span>
                            </div>
                            <p className="text-base font-bold text-indigo-900">Sarah Wilson</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-sm border border-purple-100 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-purple-600 font-medium">Most Active Dept</p>
                                <span className="text-xs text-purple-500 font-medium bg-purple-100 px-2 py-1 rounded-sm">98% Done</span>
                            </div>
                            <p className="text-base font-bold text-purple-900">Design Team</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-sm border border-orange-100 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-orange-600 font-medium">Upcoming Reviews</p>
                                <span className="text-xs text-orange-500 font-medium bg-orange-100 px-2 py-1 rounded-sm">This Week</span>
                            </div>
                            <p className="text-base font-bold text-orange-900">12 Reviews</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
