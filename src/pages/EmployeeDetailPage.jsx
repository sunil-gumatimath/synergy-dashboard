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
  DollarSign,
  CheckCircle,
  Landmark,
  GraduationCap,
  CreditCard,
  School,
} from "lucide-react";
import { employeeService } from "../services/employeeService";
import noteService from "../services/noteService";
import documentService from "../services/documentService";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import DocumentList from "../components/DocumentList";
import NotesList from "../components/NotesList";
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
  const [activeTab, setActiveTab] = useState("profile");
  const contentRef = useRef(null);

  const fetchEmployee = async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Try to convert to number if it looks like one, otherwise keep as string (UUID)
      const queryId = !isNaN(id) && !id.includes('-') ? parseInt(id) : id;

      const { data, error } = await employeeService.getById(queryId);

      if (error) {
        console.error("Error fetching employee:", error);
        setToast({
          type: "error",
          message: "Failed to load employee details. Please try again.",
        });
        setEmployee(null);
      } else {
        setEmployee(data);
      }
    } catch (err) {
      console.error("Error in fetchEmployee:", err);
      setToast({
        type: "error",
        message: "An unexpected error occurred while loading details.",
      });
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setDocumentsLoading(true);
    const { data } = await documentService.getByEmployeeId(id);
    setDocuments(data || []);
    setDocumentsLoading(false);
  };

  const fetchNotes = async () => {
    setNotesLoading(true);
    const { data } = await noteService.getByEmployeeId(id);
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
      setActionLoading(false);
    } else {
      setToast({
        type: "success",
        message: `${employee.name} has been removed from the system.`,
      });
      setTimeout(() => {
        navigate("/employees");
      }, 1500);
    }
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

  // Contact info (using available data or placeholders)
  const contactInfo = {
    phone: employee?.phone || "N/A",
    location: employee?.location || "N/A",
    employeeId: `EMP${String(employee?.id || 0).padStart(4, "0")}`,
    manager: employee?.manager || "N/A",
  };

  // Employment history (using available data)
  const employmentHistory = [
    {
      id: 1,
      title: employee?.role || "Current Position",
      department: employee?.department || "Department",
      startDate: employee?.join_date || new Date().toISOString().split("T")[0],
      endDate: null,
      isCurrent: true,
      description: "Current Role",
    },
  ];

  // Stats (using available data)
  const stats = [
    {
      id: 1,
      label: "Performance Score",
      value: employee?.performance_score ? `${employee.performance_score}%` : "N/A",
      icon: <TrendingUp className="stat-icon" />,
      color:
        employee?.performance_score >= 80
          ? "success"
          : employee?.performance_score >= 60
            ? "warning"
            : "danger",
      trend: employee?.performance_score ? "+5%" : "",
      trendDirection: "up",
    },
    {
      id: 2,
      label: "Time with Company",
      value: getEmploymentDuration(employee?.join_date),
      icon: <Clock className="stat-icon" />,
      color: "primary",
      trend: "",
      trendDirection: null,
    },
    {
      id: 3,
      label: "Annual Salary",
      value: employee?.salary ? `$${employee.salary.toLocaleString()}` : "N/A",
      icon: <DollarSign className="stat-icon" />,
      color: "info",
      trend: "",
      trendDirection: null,
    },
    {
      id: 4,
      label: "Projects Completed",
      value: "12",
      icon: <CheckCircle className="stat-icon" />,
      color: "purple",
      trend: "+2",
      trendDirection: "up",
    },
  ];

  // Mock Bank Details
  const bankDetails = {
    bankName: "Global Trust Bank",
    accountNumber: "8899 4567 2233 4589",
    accountType: "Savings",
    ifscCode: "GTB0004589",
    branch: "Downtown Branch",
    taxId: "TAX-8899-7766",
    holderName: employee?.name || "Employee Name",
  };

  // Mock Education Details
  const education = [
    {
      id: 1,
      degree: "Master of Computer Science",
      institution: "Tech University",
      year: "2018 - 2020",
      grade: "Distinction",
      description: "Specialized in Artificial Intelligence and Machine Learning.",
    },
    {
      id: 2,
      degree: "Bachelor of Technology",
      institution: "City Engineering College",
      year: "2014 - 2018",
      grade: "First Class",
      description: "Major in Computer Science and Engineering.",
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
N/A

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
      case "profile":
        return (
          <>
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
          </>
        );

      case "personal":
        return (
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
        );

      case "bank":
        return (
          <div className="card employee-detail-section">
            <h2 className="section-title">Bank Account Details</h2>
            <div className="employee-detail-grid">
              <div className="detail-item">
                <Landmark className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Bank Name</p>
                  <p className="detail-value">{bankDetails.bankName}</p>
                </div>
              </div>
              <div className="detail-item">
                <CreditCard className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Account Number</p>
                  <p className="detail-value">{bankDetails.accountNumber}</p>
                </div>
                <button
                  className="copy-btn"
                  onClick={() =>
                    copyToClipboard(bankDetails.accountNumber, "account")
                  }
                  title="Copy Account Number"
                >
                  {copiedField === "account" ? (
                    <Check size={18} className="copy-icon success" />
                  ) : (
                    <Copy size={18} className="copy-icon" />
                  )}
                </button>
              </div>
              <div className="detail-item">
                <FileText className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Account Type</p>
                  <p className="detail-value">{bankDetails.accountType}</p>
                </div>
              </div>
              <div className="detail-item">
                <Hash className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">IFSC / Sort Code</p>
                  <p className="detail-value">{bankDetails.ifscCode}</p>
                </div>
              </div>
              <div className="detail-item">
                <MapPin className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Branch</p>
                  <p className="detail-value">{bankDetails.branch}</p>
                </div>
              </div>
              <div className="detail-item">
                <User className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Account Holder</p>
                  <p className="detail-value">{bankDetails.holderName}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "education":
        return (
          <div className="card employee-detail-section">
            <h2 className="section-title">Education</h2>
            <div className="employment-timeline">
              {education.map((edu) => (
                <div key={edu.id} className="timeline-item">
                  <div className="timeline-icon">
                    <School size={14} />
                  </div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">{edu.degree}</h3>
                    <p className="timeline-department">{edu.institution}</p>
                    <p className="timeline-date">{edu.year}</p>
                    <p className="timeline-description">
                      Grade: {edu.grade}
                      <br />
                      {edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "history":
        return (
          <div className="card employee-detail-section">
            <h2 className="section-title">Employment History</h2>
            <div className="employment-timeline">
              {employmentHistory.map((position) => (
                <div key={position.id} className="timeline-item">
                  <div className="timeline-marker simple">
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
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <UserCircle size={18} />
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            <User size={18} />
            Personal Information
          </button>
          <button
            className={`tab-btn ${activeTab === "bank" ? "active" : ""}`}
            onClick={() => setActiveTab("bank")}
          >
            <Landmark size={18} />
            Bank Details
          </button>
          <button
            className={`tab-btn ${activeTab === "education" ? "active" : ""}`}
            onClick={() => setActiveTab("education")}
          >
            <GraduationCap size={18} />
            Education
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
          type="danger"
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
