import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { taskService } from "../../services/taskService";
import { calendarService } from "../../services/calendarService";
import {
    CheckCircle,
    Clock,
    Calendar as CalendarIcon,
    ListTodo,
    TrendingUp
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";

const MOTIVATIONAL_QUOTES = [
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Quality is not an act, it is a habit. – Aristotle",
    "The future depends on what you do today. – Mahatma Gandhi",
    "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
    "The secret of getting ahead is getting started. – Mark Twain",
    "It always seems impossible until it's done. – Nelson Mandela",
    "Optimism is the faith that leads to achievement. – Helen Keller",
    "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
    "Productivity is never an accident. It is always the result of a commitment to excellence. – Paul J. Meyer",
    "Focus on being productive instead of busy. – Tim Ferriss",
    "Simplicity is the ultimate sophistication. – Leonardo da Vinci",
    "Whatever you do, do it well. – Walt Disney",
    "Action is the foundational key to all success. – Pablo Picasso",
    "Efficiency is doing things right; effectiveness is doing the right things. – Peter Drucker"
];

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const updateQuote = () => {
            const hour = new Date().getHours();
            setQuote(MOTIVATIONAL_QUOTES[hour % MOTIVATIONAL_QUOTES.length]);
        };
        updateQuote();
        const interval = setInterval(updateQuote, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [tasksRes, eventsRes] = await Promise.all([
                    taskService.getAll(),
                    calendarService.getAll()
                ]);

                if (tasksRes.data) {
                    // Filter tasks assigned to the current user
                    // Assuming user.employeeId matches tasks.assignee_id
                    // If user.employeeId is not set (e.g. new user not yet linked), this might be empty
                    const myTasks = tasksRes.data.filter(t => t.assignee_id === user?.employeeId);
                    setTasks(myTasks);
                }

                if (eventsRes.data) {
                    // Filter for future events and sort by date
                    const futureEvents = eventsRes.data
                        .filter(e => new Date(e.date) >= new Date().setHours(0, 0, 0, 0))
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .slice(0, 3); // Take top 3
                    setEvents(futureEvents);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (isLoading) {
        return <LoadingSpinner size="lg" message="Loading your dashboard..." />;
    }

    const pendingTasks = tasks.filter(t => t.status !== 'done');
    const completedTasks = tasks.filter(t => t.status === 'done');

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "text-red-600 bg-red-50 border-red-200";
            case "medium": return "text-amber-600 bg-amber-50 border-amber-200";
            case "low": return "text-blue-600 bg-blue-50 border-blue-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto pb-6">
            {/* Welcome Section */}
            <div className="card p-8">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'Team Member'} 👋</h1>
                        <p className="text-gray-500">Here's what's happening today.</p>
                    </div>
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                        <p className="text-indigo-700 italic font-medium">"{quote}"</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5 flex items-center gap-4 border-l-4 border-indigo-500">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                        <ListTodo size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Pending Tasks</p>
                        <h3 className="text-2xl font-bold text-main">{pendingTasks.length}</h3>
                    </div>
                </div>
                <div className="card p-5 flex items-center gap-4 border-l-4 border-green-500">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Completed Tasks</p>
                        <h3 className="text-2xl font-bold text-main">{completedTasks.length}</h3>
                    </div>
                </div>
                <div className="card p-5 flex items-center gap-4 border-l-4 border-purple-500">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Upcoming Events</p>
                        <h3 className="text-2xl font-bold text-main">{events.length}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Tasks Column */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-main flex items-center gap-2">
                            <ListTodo className="text-primary" size={24} />
                            My Active Tasks
                        </h2>
                        <Link to="/tasks" className="text-sm text-primary hover:underline font-medium">
                            View All Tasks
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        {pendingTasks.length > 0 ? (
                            pendingTasks.slice(0, 5).map(task => (
                                <div key={task.id} className="card p-4 hover:shadow-md transition-shadow border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} capitalize`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-xs text-muted flex items-center gap-1">
                                            <Clock size={12} />
                                            Due {new Date(task.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-main mb-1">{task.title}</h3>
                                    <p className="text-sm text-muted line-clamp-1">{task.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="card p-8 text-center text-muted bg-gray-50 border-dashed border-2 border-gray-200">
                                <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                                <p>No pending tasks! Great job.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Events Column */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-main flex items-center gap-2">
                            <CalendarIcon className="text-primary" size={24} />
                            Upcoming Events
                        </h2>
                        <Link to="/calendar" className="text-sm text-primary hover:underline font-medium">
                            View Calendar
                        </Link>
                    </div>

                    <div className="card p-0 overflow-hidden">
                        {events.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {events.map(event => (
                                    <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center text-xs font-bold leading-tight">
                                                <span>{new Date(event.date).getDate()}</span>
                                                <span className="text-[10px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-main text-sm">{event.title}</h4>
                                                <p className="text-xs text-muted">{event.time} • {event.location || 'Remote'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted">
                                <p>No upcoming events.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
