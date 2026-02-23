import React from "react";
import PropTypes from "prop-types";
import { X, AlertCircle, User, Shield } from "lucide-react";
import Avatar from "./common/Avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const ROLES = ["Admin", "Manager", "Employee"];

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  status: z.string().default("Active"),
  gender: z.string().default("other"),
  joinDate: z.string().default(() => new Date().toISOString().split("T")[0]),
});

const AddEmployeeModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      gender: "other",
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  const watchName = watch("name");
  const watchGender = watch("gender");

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
  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Prefer not to say" }
  ];

  const submitForm = async (data) => {
    await onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className="modal-content"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="flex items-center gap-3">
              <div className="modal-icon">
                <User size={20} />
              </div>
              <div>
                <Dialog.Title className="modal-title">Add New Employee</Dialog.Title>
                <Dialog.Description className="modal-subtitle">
                  Fill in the details to add a new team member
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                className="modal-close-btn"
                disabled={isLoading}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(submitForm)} className="modal-body">
            {/* Avatar Preview */}
            <div className="avatar-preview-section">
              <Avatar
                name={watchName || "New Employee"}
                gender={watchGender}
                size="xl"
              />
              <p className="avatar-preview-hint">Avatar preview based on name and gender</p>
            </div>

            <div className="form-grid">
              {/* Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={`form-input ${errors.name ? "error" : ""}`}
                  placeholder="Enter full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="form-error">
                    <AlertCircle size={12} /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="email@company.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="form-error">
                    <AlertCircle size={12} /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="form-group">
                <label htmlFor="role" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={13} style={{ color: '#6366f1' }} />
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  {...register("role")}
                  className={`form-select ${errors.role ? "error" : ""}`}
                  disabled={isLoading}
                  style={{ borderColor: 'rgba(99,102,241,0.4)', boxShadow: '0 0 0 1px rgba(99,102,241,0.15)' }}
                >
                  <option value="">Select role</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.role && (
                  <p className="form-error">
                    <AlertCircle size={12} /> {errors.role.message}
                  </p>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  {...register("department")}
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
                    <AlertCircle size={12} /> {errors.department.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  {...register("status")}
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

              {/* Gender */}
              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  id="gender"
                  {...register("gender")}
                  className="form-select"
                  disabled={isLoading}
                >
                  {genders.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Join Date */}
              <div className="form-group">
                <label htmlFor="joinDate" className="form-label">
                  Join Date
                </label>
                <input
                  id="joinDate"
                  type="date"
                  {...register("joinDate")}
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
                    Adding...
                  </>
                ) : (
                  "Add Employee"
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

AddEmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default AddEmployeeModal;
