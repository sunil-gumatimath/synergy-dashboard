import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, AlertCircle, Edit2 } from "lucide-react";

const EditEmployeeModal = ({
  isOpen,
  employee,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
    joinDate: "",
  });

  const [errors, setErrors] = useState({});

  const departments = [
    "Engineering",
    "Design",
    "Product",
    "Marketing",
    "Sales",
    "HR",
    "IT",
    "Data",
  ];

  const statuses = ["Active", "On Leave", "Offline"];

  // Populate form when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        role: employee.role || "",
        department: employee.department || "",
        status: employee.status || "Active",
        joinDate: employee.join_date || employee.joinDate || "",
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(employee.id, formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-icon">
              <Edit2 size={20} />
            </div>
            <div>
              <h2 className="modal-title">Edit Employee</h2>
              <p className="modal-subtitle">Update employee information</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="modal-close-btn"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="edit-name" className="form-label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Enter full name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="form-error">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="edit-email" className="form-label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="email@company.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="form-error">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="form-group">
              <label htmlFor="edit-role" className="form-label">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-role"
                type="text"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={`form-input ${errors.role ? "error" : ""}`}
                placeholder="e.g., Senior Developer"
                disabled={isLoading}
              />
              {errors.role && (
                <p className="form-error">
                  <AlertCircle size={12} /> {errors.role}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="form-group">
              <label htmlFor="edit-department" className="form-label">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="edit-department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className={`form-select ${errors.department ? "error" : ""}`}
                disabled={isLoading}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="form-error">
                  <AlertCircle size={12} /> {errors.department}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="edit-status" className="form-label">
                Status
              </label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="form-select"
                disabled={isLoading}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Join Date */}
            <div className="form-group">
              <label htmlFor="edit-joinDate" className="form-label">
                Join Date
              </label>
              <input
                id="edit-joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleChange("joinDate", e.target.value)}
                className="form-input"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                "Update Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditEmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  employee: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    department: PropTypes.string,
    status: PropTypes.string,
    join_date: PropTypes.string,
    joinDate: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default EditEmployeeModal;
