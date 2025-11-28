import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
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
  Phone,
  MapPin,
  Hash,
  User,
  Download,
  Target,
  BookOpen,
  Zap,
} from "lucide-react";
import { employeeService } from "../services/employeeService";
import noteService from "../services/noteService";
import documentService from "../services/documentService";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import DocumentList from "../components/DocumentList";
import NotesList from "../components/NotesList";
import MockDataBanner from "../components/MockDataBanner";
import "./employee-detail-styles.css";

// Lazy load modals - they're only needed on user interaction
const EditEmployeeModal = lazy(() => import("../components/EditEmployeeModal"));
const ConfirmModal = lazy(() => import("../components/ConfirmModal"));

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
  const [activeTab, setActiveTab] = useState("overview");
  const contentRef = useRef(null);

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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchEmployee();
    fetchDocuments();
    fetchNotes();
  }, [id]);
  /* eslint-enable react-hooks/exhaustive-deps */

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
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
    );
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
        message:
          error.message || "Failed to update employee. Please try again.",
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
        message:
          error.message || "Failed to delete employee. Please try again.",
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
    return months === 0
      ? "Less than 1 month"
      : `${months} month${months !== 1 ? "s" : ""}`;
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

  // Mock additional contact info (these can be added to database schema)
  const contactInfo = {
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    employeeId: `EMP${String(employee?.id || 0).padStart(4, "0")}`,
    manager: "Rahul Sharma",
  };

  // Mock employment history with multiple positions
  const employmentHistory = [
    {
      id: 1,
      title: employee?.role || "Current Position",
      department: employee?.department || "Department",
      startDate: employee?.join_date || new Date().toISOString().split("T")[0],
      endDate: null,
      isCurrent: true,
      description:
        "Leading the team and driving key initiatives for the department.",
    },
    {
      id: 2,
      title: "Associate " + (employee?.role || "Position"),
      department: employee?.department || "Department",
      startDate: "2021-03-15",
      endDate: employee?.join_date || new Date().toISOString().split("T")[0],
      isCurrent: false,
      description:
        "Contributed to multiple successful projects and demonstrated strong technical skills.",
    },
  ];

  // Mock skills & competencies
  const skills = [
    { id: 1, name: "JavaScript", level: 95, category: "technical" },
    { id: 2, name: "React", level: 90, category: "technical" },
    { id: 3, name: "Node.js", level: 85, category: "technical" },
    { id: 4, name: "Leadership", level: 88, category: "soft" },
    { id: 5, name: "Communication", level: 92, category: "soft" },
    { id: 6, name: "Problem Solving", level: 90, category: "soft" },
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
    {
      id: 4,
      label: "Team Rating",
      value: "4.8/5",
      icon: <Star className="stat-icon" />,
      color: "warning",
      trend: "+0.3",
      trendDirection: "up",
    },
  ];

  // Export to PDF function
  const exportToPDF = async () => {
    try {
      setToast({ type: "info", message: "Preparing PDF export..." });

      const content = `
EMPLOYEE PROFILE EXPORT
${"=".repeat(50)}

Personal Information:
Name: ${employee.name}
Employee ID: ${contactInfo.employeeId}
Email: ${employee.email}
Phone: ${contactInfo.phone}
Location: ${contactInfo.location}

Employment Details:
Role: ${employee.role}
Department: ${employee.department}
Status: ${employee.status}
Join Date: ${new Date(employee.join_date).toLocaleDateString()}
Time with Company: ${getEmploymentDuration(employee.join_date)}
Reporting Manager: ${contactInfo.manager}

Performance Statistics:
${stats.map((s) => `${s.label}: ${s.value} ${s.trend || ""}`).join("\n")}

Skills & Competencies:
${skills.map((s) => `${s.name}: ${s.level}%`).join("\n")}

Employment History:
${employmentHistory.map((h) => `${h.title} - ${h.department} (${h.startDate} to ${h.endDate || "Present"})`).join("\n")}

Documents: ${documents.length}
Notes: ${notes.length}

Exported on: ${new Date().toLocaleString()}
            `;

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${employee.name.replace(/\s+/g, "_")}_Profile.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setToast({ type: "success", message: "Profile exported successfully!" });
    } catch {
      setToast({ type: "error", message: "Failed to export profile" });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
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
                  <Phone className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Phone</p>
                    <p className="detail-value">{contactInfo.phone}</p>
                  </div>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(contactInfo.phone, "phone")}
                    title="Copy phone"
                  >
                    {copiedField === "phone" ? (
                      <Check size={18} className="copy-icon success" />
                    ) : (
                      <Copy size={18} className="copy-icon" />
                    )}
                  </button>
                </div>
                <div className="detail-item">
                  <MapPin className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Location</p>
                    <p className="detail-value">{contactInfo.location}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Hash className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Employee ID</p>
                    <p className="detail-value">{contactInfo.employeeId}</p>
                  </div>
                  <button
                    className="copy-btn"
                    onClick={() =>
                      copyToClipboard(contactInfo.employeeId, "id")
                    }
                    title="Copy ID"
                  >
                    {copiedField === "id" ? (
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
                  <User className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Reporting Manager</p>
                    <p className="detail-value">{contactInfo.manager}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar className="detail-icon" />
                  <div className="detail-content">
                    <p className="detail-label">Join Date</p>
                    <p className="detail-value">
                      {employee.join_date
                        ? new Date(employee.join_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
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
                    <div className="stat-icon-wrapper">{stat.icon}</div>
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

            {/* Skills & Competencies */}
            <div className="card employee-detail-section">
              <h2 className="section-title">
                <Target size={20} />
                Skills & Competencies
              </h2>
              <div className="skills-container">
                <div className="skills-category">
                  <h3 className="skills-category-title">
                    <Zap size={18} />
                    Technical Skills
                  </h3>
                  <div className="skills-list">
                    {skills
                      .filter((s) => s.category === "technical")
                      .map((skill) => (
                        <div key={skill.id} className="skill-item">
                          <div className="skill-header">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-percentage">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="skill-bar">
                            <div
                              className="skill-progress"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="skills-category">
                  <h3 className="skills-category-title">
                    <BookOpen size={18} />
                    Soft Skills
                  </h3>
                  <div className="skills-list">
                    {skills
                      .filter((s) => s.category === "soft")
                      .map((skill) => (
                        <div key={skill.id} className="skill-item">
                          <div className="skill-header">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-percentage">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="skill-bar">
                            <div
                              className="skill-progress soft"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "history":
        return (
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
                      {new Date(position.startDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                        },
                      )}{" "}
                      -{" "}
                      {position.endDate
                        ? new Date(position.endDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                            },
                          )
                        : "Present"}
                    </p>
                    {position.description && (
                      <p className="timeline-description">
                        {position.description}
                      </p>
                    )}
                    {position.isCurrent && (
                      <span className="timeline-badge">Current</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "documents":
        return (
          <>
            <MockDataBanner />
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
          </>
        );

      default:
        return null;
    }
  };

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
          <p>
            The employee you're looking for doesn't exist or has been removed.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/employees")}
          >
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
        <button
          className="breadcrumb-link"
          onClick={() => navigate("/employees")}
        >
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
            <div
              className={`avatar-status-ring ${getStatusClass(employee.status)}`}
            ></div>
          </div>
          <div className="employee-detail-info">
            <h1 className="employee-detail-name">{employee.name}</h1>
            <p className="employee-detail-role">
              <Briefcase size={18} />
              {employee.role}
            </p>
            <div className="employee-badges">
              <span
                className={`employee-status-badge ${getStatusClass(employee.status)}`}
              >
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
            className="btn btn-secondary"
            onClick={exportToPDF}
            title="Export profile to file"
          >
            <Download size={18} />
            Export
          </button>
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

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <UserCircle size={18} />
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <Clock size={18} />
            Employment History
          </button>
          <button
            className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            <FileText size={18} />
            Documents & Notes
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content" ref={contentRef}>
        {renderTabContent()}
      </div>

      {/* Edit Employee Modal */}
      <Suspense fallback={null}>
        <EditEmployeeModal
          isOpen={showEditModal}
          employee={employee}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditEmployee}
          isLoading={actionLoading}
        />
      </Suspense>

      {/* Delete Confirmation Modal */}
      <Suspense fallback={null}>
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
      </Suspense>

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
