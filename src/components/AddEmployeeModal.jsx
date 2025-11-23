import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, AlertCircle, User } from 'lucide-react';

const AddEmployeeModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        department: '',
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState({});

    const departments = [
        'Engineering',
        'Design',
        'Product',
        'Marketing',
        'Sales',
        'HR',
        'IT',
        'Data'
    ];

    const statuses = ['Active', 'On Leave', 'Offline'];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.role.trim()) {
            newErrors.role = 'Role is required';
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onSubmit(formData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            role: '',
            department: '',
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0],
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="flex items-center gap-3">
                        <div className="modal-icon">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="modal-title">Add New Employee</h2>
                            <p className="modal-subtitle">Fill in the details to add a new team member</p>
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
                            <label htmlFor="name" className="form-label">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`form-input ${errors.name ? 'error' : ''}`}
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
                            <label htmlFor="email" className="form-label">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`form-input ${errors.email ? 'error' : ''}`}
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
                            <label htmlFor="role" className="form-label">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="role"
                                type="text"
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className={`form-input ${errors.role ? 'error' : ''}`}
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
                            <label htmlFor="department" className="form-label">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="department"
                                value={formData.department}
                                onChange={(e) => handleChange('department', e.target.value)}
                                className={`form-select ${errors.department ? 'error' : ''}`}
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
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
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
                            <label htmlFor="joinDate" className="form-label">
                                Join Date
                            </label>
                            <input
                                id="joinDate"
                                type="date"
                                value={formData.joinDate}
                                onChange={(e) => handleChange('joinDate', e.target.value)}
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
                                'Add Employee'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

export default AddEmployeeModal;
