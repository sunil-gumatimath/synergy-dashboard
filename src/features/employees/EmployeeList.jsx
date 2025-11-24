import React, { useState, useMemo, useEffect, useCallback } from "react";
import { UserPlus, Users, RefreshCw } from "lucide-react";
import "./employees-styles.css";
import { employeeService } from "../../services/employeeService";
import { supabase } from "../../lib/supabase";
import AddEmployeeModal from "../../components/AddEmployeeModal";
import EditEmployeeModal from "../../components/EditEmployeeModal";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import EmployeeCard from "../../components/EmployeeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  // Debounce search term to reduce re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchEmployees = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const { data, error } = await employeeService.getAll();

    if (error) {
      setToast({
        type: "error",
        message: "Failed to load employees. Please try again.",
      });
      setEmployees([]);
    } else {
      setEmployees(data || []);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  // Fetch employees on mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Supabase Realtime subscription for live updates
  useEffect(() => {
    // Create a channel for real-time updates
    const channel = supabase
      .channel('employees-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'employees',
        },
        (payload) => {
          // Refresh the employee list when any change occurs
          fetchEmployees(true); // Use refresh mode to show subtle loading

          // Show a toast notification about the change
          if (payload.eventType === 'INSERT') {
            setToast({
              type: 'info',
              message: 'New employee added by another user',
            });
          } else if (payload.eventType === 'UPDATE') {
            setToast({
              type: 'info',
              message: 'Employee data updated',
            });
          } else if (payload.eventType === 'DELETE') {
            setToast({
              type: 'info',
              message: 'Employee removed',
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEmployees]);

  // Search/filter employees with debounced search term
  const filteredEmployees = useMemo(() => {
    if (!debouncedSearchTerm) return employees;

    const term = debouncedSearchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(term) ||
        emp.role.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term),
    );
  }, [debouncedSearchTerm, employees]);

  // Add employee - memoized to prevent re-creation
  const handleAddEmployee = useCallback(
    async (employeeData) => {
      setActionLoading(true);

      const { data, error } = await employeeService.create(employeeData);

      if (error) {
        setToast({
          type: "error",
          message: error.message || "Failed to add employee. Please try again.",
        });
      } else {
        setToast({
          type: "success",
          message: `${data.name} has been added successfully!`,
        });
        setShowAddModal(false);
        fetchEmployees();
      }

      setActionLoading(false);
    },
    [fetchEmployees],
  );

  // Edit employee - memoized
  const handleEditEmployee = useCallback(
    async (id, updates) => {
      setActionLoading(true);

      const { data, error } = await employeeService.update(id, updates);

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
        setSelectedEmployee(null);
        fetchEmployees();
      }

      setActionLoading(false);
    },
    [fetchEmployees],
  );

  // Delete employee - memoized
  const handleDeleteEmployee = useCallback(async () => {
    if (!selectedEmployee) return;

    setActionLoading(true);

    const { error } = await employeeService.delete(
      selectedEmployee.id,
    );

    if (error) {
      setToast({
        type: "error",
        message:
          error.message || "Failed to delete employee. Please try again.",
      });
    } else {
      setToast({
        type: "success",
        message: `${selectedEmployee.name} has been removed from the system.`,
      });
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    }

    setActionLoading(false);
  }, [selectedEmployee, fetchEmployees]);

  // Open edit modal - memoized to prevent re-creation
  const openEditModal = useCallback((employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  }, []);

  // Open delete confirmation - memoized
  const openDeleteModal = useCallback((employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  }, []);

  if (isLoading) {
    return (
      <div className="employees-container">
        <LoadingSpinner size="lg" message="Loading employees..." />
      </div>
    );
  }

  return (
    <div className="employees-container">
      <div className="employees-header">
        <input
          type="text"
          placeholder="Search employees by name, role, department, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="employees-search"
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => fetchEmployees(true)}
            disabled={isRefreshing}
            title="Refresh employee list"
          >
            <RefreshCw
              size={18}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {filteredEmployees.length > 0 ? (
        <div className="employees-grid">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      ) : (
        <div className="card employees-empty">
          <Users size={64} className="employees-empty-icon" />
          <h3 className="employees-empty-title">No employees found</h3>
          <p className="employees-empty-description">
            {searchTerm
              ? `No employees match "${searchTerm}". Try a different search term.`
              : "No employees in the system yet. Add your first employee to get started."}
          </p>
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEmployee}
        isLoading={actionLoading}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={showEditModal}
        employee={selectedEmployee}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleEditEmployee}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteEmployee}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedEmployee(null);
        }}
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

export default React.memo(EmployeeList);
