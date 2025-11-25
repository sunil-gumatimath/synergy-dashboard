import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Mail,
    Briefcase,
    Building2,
    Calendar,
    Edit,
    Trash,
    UserCircle,
    TrendingUp,
    Clock,
    Award,
    FileText,
    StickyNote,
    Copy,
    Check,
    TrendingDown,
    ChevronRight,
    Star,
} from "lucide-react";
import { employeeService } from "../services/employeeService";
import noteService from "../services/noteService";
import documentService from "../services/documentService";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import EditEmployeeModal from "../components/EditEmployeeModal";
import ConfirmModal from "../components/ConfirmModal";
import DocumentList from "../components/DocumentList";
import NotesList from "../components/NotesList";
import MockDataBanner from "../components/MockDataBanner";
import "./employee-detail-styles.css";

const EmployeeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [notes, setNotes] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [notesLoading, setNotesLoading] = useState(true);
    const [copiedField, setCopiedField] = useState(null);

    const fetchEmployee = async () => {
        setIsLoading(true);
        const { data, error } = await employeeService.getById(parseInt(id));

        if (error) {
            setToast({
                type: "error",
                message: "Failed to load employee details. Please try again.",
            });
            setEmployee(null);
        } else {
            setEmployee(data);
        }

        setIsLoading(false);
    };

    const fetchDocuments = async () => {
        setDocumentsLoading(true);
        const { data } = await documentService.getByEmployeeId(parseInt(id));
        setDocuments(data || []);
        setDocumentsLoading(false);
    };

    const fetchNotes = async () => {
        setNotesLoading(true);
        const { data } = await noteService.getByEmployeeId(parseInt(id));
        setNotes(data || []);
        setNotesLoading(false);
    };

    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        fetchEmployee();
        fetchDocuments();
        fetchNotes();
    }, [id]);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const handleDocumentAdded = (document) => {
        setDocuments((prev) => [document, ...prev]);
        setToast({ type: "success", message: "Document uploaded successfully!" });
    };

    const handleDocumentDeleted = async (documentId) => {
        await documentService.delete(documentId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        setToast({ type: "success", message: "Document deleted successfully!" });
    };

    const handleNoteAdded = (note) => {
        setNotes((prev) => [note, ...prev]);
        setToast({ type: "success", message: "Note added successfully!" });
    };

    const handleNoteUpdated = (updatedNote) => {
        setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
        setToast({ type: "success", message: "Note updated successfully!" });
    };

    const handleNoteDeleted = async (noteId) => {
        await noteService.delete(noteId);
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        setToast({ type: "success", message: "Note deleted successfully!" });
    };

    const handleEditEmployee = async (employeeId, updates) => {
        setActionLoading(true);

        const { data, error } = await employeeService.update(employeeId, updates);

        if (error) {
            setToast({
                type: "error",
                message: error.message || "Failed to update employee. Please try again.",
            });
        } else {
            setToast({
                type: "success",
                message: `${data.name} has been updated successfully!`,
            });
            setShowEditModal(false);
            fetchEmployee();
        }

        setActionLoading(false);
    };

    const handleDeleteEmployee = async () => {
        if (!employee) return;

        setActionLoading(true);

        const { error } = await employeeService.delete(employee.id);

        if (error) {
            setToast({
                type: "error",
                message: error.message || "Failed to delete employee. Please try again.",
            });
        } else {
            setToast({
                type: "success",
                message: `${employee.name} has been removed from the system.`,
            });
            setTimeout(() => {
                navigate("/employees");
            }, 1500);
        }

        setActionLoading(false);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Active":
                return "active";
            case "On Leave":
                return "leave";
            default:
                return "offline";
        }
    };

    // Calculate employment duration
    const getEmploymentDuration = (joinDate) => {
        if (!joinDate) return "N/A";
        const start = new Date(joinDate);
        const now = new Date();
        const months = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years > 0) {
            return `${years} year${years !== 1 ? "s" : ""}, ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
        }
        return months === 0 ? "Less than 1 month" : `${months} month${months !== 1 ? "s" : ""}`;
    };

    // Copy to clipboard helper
    const copyToClipboard = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Mock employment history (can be extended with real data from database)
    const employmentHistory = [
        {
            id: 1,
            title: employee?.role || "Current Position",
            department: employee?.department || "Department",
            startDate: employee?.join_date || new Date().toISOString().split("T")[0],
            endDate: null,
            isCurrent: true,
        },
    ];

    // Mock stats (can be calculated from real data)
    const stats = [
        {
            id: 1,
            label: "Projects Completed",
            value: "24",
            icon: <Award className="stat-icon" />,
            color: "primary",
            trend: "+12%",
            trendDirection: "up",
        },
        {
            id: 2,
            label: "Time with Company",
            value: getEmploymentDuration(employee?.join_date),
            icon: <Clock className="stat-icon" />,
            color: "success",
            trend: "",
            trendDirection: null,
        },
        {
            id: 3,
            label: "Performance Score",
            value: "94%",
            icon: <TrendingUp className="stat-icon" />,
            color: "warning",
            trend: "+5%",
            trendDirection: "up",
        },
    ];

    if (isLoading) {
        return (
            <div className="employee-detail-container">
                <LoadingSpinner size="lg" message="Loading employee details..." />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="employee-detail-container">
                <div className="card employee-detail-error">
                    <UserCircle size={64} className="error-icon" />
                    <h3>Employee Not Found</h3>
                    <p>The employee you're looking for doesn't exist or has been removed.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/employees")}>
                        <ArrowLeft size={18} />
                        Back to Employees
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="employee-detail-container">
            {/* Breadcrumb Navigation */}
            <div className="breadcrumb">
                <button className="breadcrumb-link" onClick={() => navigate("/employees")}>
                    Employees
                </button>
                <ChevronRight size={16} className="breadcrumb-separator" />
                <span className="breadcrumb-current">{employee.name}</span>
            </div>

            {/* Enhanced Header Section with Gradient */}
            <div className="card employee-detail-header enhanced">
                <div className="header-gradient-overlay"></div>
                <div className="employee-detail-profile">
                    <div className="avatar-wrapper">
                        <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="employee-detail-avatar"
                        />
                        <div className={`avatar-status-ring ${getStatusClass(employee.status)}`}></div>
                    </div>
                    <div className="employee-detail-info">
                        <h1 className="employee-detail-name">{employee.name}</h1>
                        <p className="employee-detail-role">
                            <Briefcase size={18} />
                            {employee.role}
                        </p>
                        <div className="employee-badges">
                            <span className={`employee-status-badge ${getStatusClass(employee.status)}`}>
                                {employee.status}
                            </span>
                            <span className="employee-badge performance">
                                <Star size={14} />
                                Top Performer
                            </span>
                        </div>
                    </div>
                </div>
                <div className="employee-detail-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowEditModal(true)}
                    >
                        <Edit size={18} />
                        Edit
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <Trash size={18} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Contact Information */}
            <div className="card employee-detail-section">
                <h2 className="section-title">Contact Information</h2>
                <div className="employee-detail-grid">
                    <div className="detail-item">
                        <Mail className="detail-icon" />
                        <div className="detail-content">
                            <p className="detail-label">Email</p>
                            <p className="detail-value">{employee.email}</p>
                        </div>
                        <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(employee.email, "email")}
                            title="Copy email"
                        >
                            {copiedField === "email" ? (
                                <Check size={18} className="copy-icon success" />
                            ) : (
                                <Copy size={18} className="copy-icon" />
                            )}
                        </button>
                    </div>
                    <div className="detail-item">
                        <Building2 className="detail-icon" />
                        <div className="detail-content">
                            <p className="detail-label">Department</p>
                            <p className="detail-value">{employee.department}</p>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Briefcase className="detail-icon" />
                        <div className="detail-content">
                            <p className="detail-label">Role</p>
                            <p className="detail-value">{employee.role}</p>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Calendar className="detail-icon" />
                        <div className="detail-content">
                            <p className="detail-label">Join Date</p>
                            <p className="detail-value">
                                {employee.join_date
                                    ? new Date(employee.join_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="card employee-detail-section">
                <h2 className="section-title">Performance Statistics</h2>
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.id} className={`stat-card stat-${stat.color}`}>
                            <div className="stat-icon-wrapper">
                                {stat.icon}
                            </div>
                            <div className="stat-content">
                                <p className="stat-value">{stat.value}</p>
                                <p className="stat-label">{stat.label}</p>
                                {stat.trend && (
                                    <div className={`stat-trend ${stat.trendDirection}`}>
                                        {stat.trendDirection === "up" ? (
                                            <TrendingUp size={14} />
                                        ) : (
                                            <TrendingDown size={14} />
                                        )}
                                        <span>{stat.trend}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Employment History */}
            <div className="card employee-detail-section">
                <h2 className="section-title">Employment History</h2>
                <div className="employment-timeline">
                    {employmentHistory.map((position) => (
                        <div key={position.id} className="timeline-item">
                            <div className="timeline-marker">
                                {position.isCurrent && <div className="timeline-pulse" />}
                            </div>
                            <div className="timeline-content">
                                <h3 className="timeline-title">{position.title}</h3>
                                <p className="timeline-department">{position.department}</p>
                                <p className="timeline-date">
                                    {new Date(position.startDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                    })}{" "}
                                    -{" "}
                                    {position.endDate
                                        ? new Date(position.endDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                        })
                                        : "Present"}
                                </p>
                                {position.isCurrent && (
                                    <span className="timeline-badge">Current</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mock Data Banner */}
            <MockDataBanner />

            {/* Documents and Notes */}
            <div className="employee-detail-grid-2">
                <DocumentList
                    employeeId={employee.id}
                    documents={documents}
                    onDocumentAdded={handleDocumentAdded}
                    onDocumentDeleted={handleDocumentDeleted}
                    isLoading={documentsLoading}
                />
                <NotesList
                    employeeId={employee.id}
                    notes={notes}
                    onNoteAdded={handleNoteAdded}
                    onNoteUpdated={handleNoteUpdated}
                    onNoteDeleted={handleNoteDeleted}
                    isLoading={notesLoading}
                />
            </div>

            {/* Edit Employee Modal */}
            <EditEmployeeModal
                isOpen={showEditModal}
                employee={employee}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditEmployee}
                isLoading={actionLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Employee"
                message={`Are you sure you want to delete ${employee?.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteEmployee}
                onCancel={() => setShowDeleteModal(false)}
                isLoading={actionLoading}
                variant="danger"
            />

            {/* Toast Notifications */}
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

export default EmployeeDetailPage;
