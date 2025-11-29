import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle, LifeBuoy } from "lucide-react";
import { taskService } from "../../services/taskService";
import CreateTicketModal from "../../components/CreateTicketModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import { useAuth } from "../../contexts/AuthContext";

const SupportView = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setIsLoading(true);
        // In a real app, we'd filter by type='ticket' and creator_id=user.id
        const { data } = await taskService.getAll();
        // Filter for demo purposes since we're using mock data mixed with tasks
        const ticketData = data ? data.filter(t => t.type === 'ticket' || t.title.includes('Support') || t.title.includes('Request')) : [];
        setTickets(ticketData);
        setIsLoading(false);
    };

    const handleCreateTicket = async (ticketData) => {
        // Add user info to the ticket
        const newTicket = {
            ...ticketData,
            assignee: {
                name: "IT Support", // Auto-assigned for demo
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=IT"
            },
            creator_id: user?.id
        };

        const { data, error } = await taskService.create(newTicket);

        if (error) {
            setToast({ type: "error", message: "Failed to create ticket" });
        } else {
            setToast({ type: "success", message: "Ticket created successfully" });
            setShowCreateModal(false);
            fetchTickets();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "done": return "text-green-600 bg-green-50 border-green-200";
            case "in-progress": return "text-blue-600 bg-blue-50 border-blue-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "done": return <CheckCircle size={14} />;
            case "in-progress": return <Clock size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-main flex items-center gap-2">
                        <LifeBuoy size={28} className="text-primary" />
                        Help Desk & Support
                    </h1>
                    <p className="text-muted text-sm">Raise tickets and track your requests</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus size={18} />
                    Raise Ticket
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{tickets.filter(t => t.status !== 'done').length}</p>
                        <p className="text-sm text-muted">Open Tickets</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'done').length}</p>
                        <p className="text-sm text-muted">Resolved</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">24h</p>
                        <p className="text-sm text-muted">Avg. Response Time</p>
                    </div>
                </div>
            </div>

            {/* Ticket List */}
            <div className="card flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                    <h2 className="font-semibold">My Tickets</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="pl-9 pr-4 py-1.5 border border-[var(--border)] rounded-[var(--radius-md)] text-sm w-48 focus:outline-none focus:border-[var(--primary)]"
                            />
                        </div>
                        <button className="btn btn-ghost btn-sm">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingSpinner size="lg" message="Loading tickets..." />
                ) : tickets.length > 0 ? (
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[var(--bg-body)] text-xs uppercase text-muted font-semibold sticky top-0">
                                <tr>
                                    <th className="p-4">Ticket ID</th>
                                    <th className="p-4">Subject</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Last Updated</th>
                                    <th className="p-4">Priority</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-[var(--bg-body)] transition-colors cursor-pointer">
                                        <td className="p-4 font-mono text-xs text-muted">#{ticket.id}</td>
                                        <td className="p-4 font-medium">{ticket.title}</td>
                                        <td className="p-4 text-sm text-muted">{ticket.category || 'General'}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                                                {getStatusIcon(ticket.status)}
                                                {ticket.status === 'done' ? 'Resolved' : ticket.status === 'in-progress' ? 'In Progress' : 'Open'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-muted">
                                            {new Date(ticket.created_at || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs font-semibold uppercase ${ticket.priority === 'high' ? 'text-red-600' :
                                                ticket.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
                                                }`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted p-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="opacity-50" />
                        </div>
                        <p>No tickets found. Raise a new ticket to get started.</p>
                    </div>
                )}
            </div>

            <CreateTicketModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateTicket}
                isLoading={false}
            />

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default SupportView;
