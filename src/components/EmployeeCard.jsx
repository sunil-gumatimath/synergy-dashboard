import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Optimized Employee Card Component
 * Uses React.memo to prevent unnecessary re-renders
 * Implements lazy loading for avatar images
 */
const EmployeeCard = memo(({ employee, onEdit, onDelete }) => {
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

    return (
        <div className="card employee-card">
            <div className="employee-card-header">
                <div className="employee-info">
                    <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="employee-avatar"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="employee-details">
                        <h3>{employee.name}</h3>
                        <p>{employee.role}</p>
                    </div>
                </div>
                <span
                    className={`employee-status-badge ${getStatusClass(employee.status)}`}
                >
                    {employee.status}
                </span>
            </div>

            <div className="employee-meta">
                <div className="employee-meta-row">
                    <span className="employee-meta-label">Department</span>
                    <span className="employee-meta-value">{employee.department}</span>
                </div>
                <div className="employee-meta-row">
                    <span className="employee-meta-label">Email</span>
                    <span className="employee-meta-value">{employee.email}</span>
                </div>
            </div>

            <div className="employee-actions">
                <button
                    type="button"
                    className="employee-action-btn"
                    onClick={() => onEdit(employee)}
                >
                    Edit
                </button>
                <button
                    type="button"
                    className="employee-action-btn danger"
                    onClick={() => onDelete(employee)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
});

EmployeeCard.displayName = 'EmployeeCard';

EmployeeCard.propTypes = {
    employee: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        department: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default EmployeeCard;
