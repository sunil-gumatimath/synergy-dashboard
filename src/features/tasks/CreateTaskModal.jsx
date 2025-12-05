import React, { useState, useEffect } from "react";
import { X, Save, Calendar, User, AlertCircle } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { employeeService } from "../../services/employeeService";

const CreateTaskModal = ({ isOpen, onClose, onSubmit, isLoading, taskToEdit = null, initialStatus = 'todo' }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assignee_id: "",
    });

    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
            if (taskToEdit) {
                setFormData({
                    title: taskToEdit.title || "",
                    description: taskToEdit.description || "",
                    priority: taskToEdit.priority || "medium",
                    due_date: taskToEdit.due_date ? new Date(taskToEdit.due_date).toISOString().split('T')[0] : "",
                    assignee_id: taskToEdit.assignee?.id || taskToEdit.assignee_id || "",
                });
            } else {
                // Reset form on open
                setFormData({
                    title: "",
                    description: "",
                    priority: "medium",
                    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 1 week
                    assignee_id: "",
                });
            }
            setErrors({});
        }
    }, [isOpen, taskToEdit]);

    const fetchEmployees = async () => {
        setLoadingEmployees(true);
        const { data } = await employeeService.getAll();
        if (data) {
            setEmployees(data);
        }
        setLoadingEmployees(false);
    };

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.due_date) newErrors.due_date = "Due date is required";
        if (!formData.assignee_id) newErrors.assignee_id = "Assignee is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const selectedEmployee = employees.find(e => e.id.toString() === formData.assignee_id.toString());

            onSubmit({
                ...formData,
                type: 'task',
                status: taskToEdit ? taskToEdit.status : initialStatus
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-lg w-full">
                <div className="modal-header">
                    <h2 className="modal-title">{taskToEdit ? "Edit Task" : "Create New Task"}</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`form-input ${errors.title ? "border-red-500" : ""}`}
                            placeholder="e.g., Prepare Q4 Report"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div className="form-group">
                            <label htmlFor="priority" className="form-label">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {/* Due Date */}
                        <div className="form-group">
                            <label htmlFor="due_date" className="form-label">
                                Due Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="due_date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    className={`form-input !pl-10 ${errors.due_date ? "border-red-500" : ""}`}
                                />
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                            </div>
                            {errors.due_date && (
                                <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>
                            )}
                        </div>
                    </div>

                    {/* Assignee */}
                    <div className="form-group">
                        <label htmlFor="assignee_id" className="form-label">
                            Assign To <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="assignee_id"
                                name="assignee_id"
                                value={formData.assignee_id}
                                onChange={handleChange}
                                className={`form-select !pl-10 ${errors.assignee_id ? "border-red-500" : ""}`}
                                disabled={loadingEmployees}
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name} - {emp.role}
                                    </option>
                                ))}
                            </select>
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        </div>
                        {loadingEmployees && <p className="text-xs text-muted mt-1">Loading employees...</p>}
                        {errors.assignee_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.assignee_id}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`form-textarea ${errors.description ? "border-red-500" : ""}`}
                            placeholder="Describe the task details..."
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
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
                                    <LoadingSpinner size="sm" color="white" />
                                    <span>{taskToEdit ? "Saving..." : "Creating..."}</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>{taskToEdit ? "Save Changes" : "Create Task"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
