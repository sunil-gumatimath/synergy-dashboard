import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { UserPlus, Users, RefreshCw, Download, Search, X } from "lucide-react";
import "./employees-styles.css";
import { employeeService } from "../../services/employeeService";
import { supabase } from "../../lib/supabase";
import Toast from "../../components/Toast";
import EmployeeCard from "../../components/EmployeeCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import FilterPanel from "../../components/FilterPanel";
import SortControls from "../../components/SortControls";
import BulkActionToolbar from "../../components/BulkActionToolbar";

// Lazy load modals for better performance
const AddEmployeeModal = lazy(
  () => import("../../components/AddEmployeeModal"),
);
const EditEmployeeModal = lazy(
  () => import("../../components/EditEmployeeModal"),
);
const ConfirmModal = lazy(() => import("../../components/ConfirmModal"));

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

  // Bulk selection state
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Filter and sort states
  const [filters, setFilters] = useState({
    department: "",
    role: "",
    status: "",
  });
  const [sortBy, setSortBy] = useState("join_date");
  const [sortOrder, setSortOrder] = useState("desc");

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
  useEffect(() => {
    // eslint-disable-next-line
    fetchEmployees();
  }, [fetchEmployees]);

  // Supabase Realtime subscription for live updates
  useEffect(() => {
    // Create a channel for real-time updates
    const channel = supabase
      .channel("employees-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "employees",
        },
        (payload) => {
          // Refresh the employee list when any change occurs
          fetchEmployees(true); // Use refresh mode to show subtle loading

          // Show a toast notification about the change
          if (payload.eventType === "INSERT") {
            setToast({
              type: "info",
              message: "New employee added by another user",
            });
          } else if (payload.eventType === "UPDATE") {
            setToast({
              type: "info",
              message: "Employee data updated",
            });
          } else if (payload.eventType === "DELETE") {
            setToast({
              type: "info",
              message: "Employee removed",
            });
          }
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEmployees]);

  // Search, filter, and sort employees with debounced search term
  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Apply search filter
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(term) ||
          emp.role.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term),
      );
    }

    // Apply department filter
    if (filters.department) {
      result = result.filter((emp) => emp.department === filters.department);
    }

    // Apply role filter
    if (filters.role) {
      result = result.filter((emp) => emp.role === filters.role);
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((emp) => emp.status === filters.status);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle date sorting
      if (sortBy === "join_date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return result;
  }, [debouncedSearchTerm, employees, filters, sortBy, sortOrder]);

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
        fetchEmployees(true);
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
        fetchEmployees(true);
      }

      setActionLoading(false);
    },
    [fetchEmployees],
  );

  // Delete employee - memoized
  const handleDeleteEmployee = useCallback(async () => {
    if (!selectedEmployee) return;

    setActionLoading(true);

    const { error } = await employeeService.delete(selectedEmployee.id);

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
      fetchEmployees(true);
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

  // Handle employee selection
  const handleToggleSelect = useCallback((employeeId) => {
    setSelectedEmployeeIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  }, []);

  // Select all filtered employees
  const handleSelectAll = useCallback(() => {
    const allIds = new Set(filteredAndSortedEmployees.map((emp) => emp.id));
    setSelectedEmployeeIds(allIds);
  }, [filteredAndSortedEmployees]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedEmployeeIds(new Set());
  }, []);

  // Bulk delete
  const handleBulkDelete = useCallback(() => {
    setShowBulkDeleteModal(true);
  }, []);

  const confirmBulkDelete = useCallback(async () => {
    setActionLoading(true);

    const selectedEmployees = employees.filter((emp) =>
      selectedEmployeeIds.has(emp.id),
    );

    const deletePromises = selectedEmployees.map((emp) =>
      employeeService.delete(emp.id),
    );

    try {
      await Promise.all(deletePromises);
      setToast({
        type: "success",
        message: `Successfully deleted ${selectedEmployeeIds.size} employee(s)`,
      });
      setSelectedEmployeeIds(new Set());
      setShowBulkDeleteModal(false);
      fetchEmployees();
    } catch {
      setToast({
        type: "error",
        message: "Failed to delete some employees",
      });
    }

    setActionLoading(false);
  }, [selectedEmployeeIds, employees, fetchEmployees]);

  // Bulk status update
  const handleBulkStatusChange = useCallback(
    async (newStatus) => {
      setActionLoading(true);

      const selectedEmployees = employees.filter((emp) =>
        selectedEmployeeIds.has(emp.id),
      );

      const updatePromises = selectedEmployees.map((emp) =>
        employeeService.update(emp.id, { status: newStatus }),
      );

      try {
        await Promise.all(updatePromises);
        setToast({
          type: "success",
          message: `Successfully updated ${selectedEmployeeIds.size} employee(s) to ${newStatus}`,
        });
        setSelectedEmployeeIds(new Set());
        fetchEmployees();
      } catch {
        setToast({
          type: "error",
          message: "Failed to update some employees",
        });
      }

      setActionLoading(false);
    },
    [selectedEmployeeIds, employees, fetchEmployees],
  );

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setSelectedEmployeeIds(new Set()); // Clear selection when filters change
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
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
      {/* Header Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-main flex items-center gap-2">
            <Users size={28} className="text-primary" />
            Employees
          </h1>
          <p className="text-muted text-sm">Manage your team members</p>
        </div>
      </div>

      {/* Bulk Action Toolbar - appears when items selected */}
      <BulkActionToolbar
        selectedCount={selectedEmployeeIds.size}
        onClearSelection={handleClearSelection}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
      />

      <div className="employees-header">
        <div className="employees-search-wrapper">
          <Search className="employees-search-icon" size={20} />
          <input
            type="text"
            placeholder="Search employees by name, role, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="employees-search-input"
          />
          {searchTerm && (
            <button
              className="employees-search-clear"
              onClick={() => setSearchTerm("")}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {/* CSV Actions */}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              const headers = [
                "ID",
                "Name",
                "Email",
                "Role",
                "Department",
                "Status",
                "Join Date",
              ];
              const csvContent = [
                headers.join(","),
                ...filteredAndSortedEmployees.map((emp) =>
                  [
                    emp.id,
                    `"${emp.name}"`,
                    emp.email,
                    emp.role,
                    emp.department,
                    emp.status,
                    emp.join_date,
                  ].join(","),
                ),
              ].join("\n");

              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `employees_export_${new Date().toISOString().split("T")[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }}
            title="Export to CSV"
          >
            <Download size={18} />
          </button>

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

      {/* Filter and Sort Controls */}
      <div className="employees-controls">
        <FilterPanel
          employees={employees}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Results Count & Select All */}
      {employees.length > 0 && (
        <div className="employees-results">
          <p>
            Showing <strong>{filteredAndSortedEmployees.length}</strong> of{" "}
            <strong>{employees.length}</strong> employees
          </p>
          {filteredAndSortedEmployees.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleSelectAll}
            >
              {selectedEmployeeIds.size === filteredAndSortedEmployees.length
                ? "Deselect All"
                : "Select All"}
            </button>
          )}
        </div>
      )}

      {filteredAndSortedEmployees.length > 0 ? (
        <div className="employees-grid">
          {filteredAndSortedEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              isSelected={selectedEmployeeIds.has(employee.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="card employees-empty">
          <Users size={64} className="employees-empty-icon" />
          <h3 className="employees-empty-title">No employees found</h3>
          <p className="employees-empty-description">
            {searchTerm || filters.department || filters.role || filters.status
              ? `No employees match your search and filter criteria. Try adjusting your filters.`
              : "No employees in the system yet. Add your first employee to get started."}
          </p>
        </div>
      )}

      {/* Add Employee Modal */}
      <Suspense fallback={null}>
        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEmployee}
          isLoading={actionLoading}
        />
      </Suspense>

      {/* Edit Employee Modal */}
      <Suspense fallback={null}>
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
      </Suspense>

      {/* Delete Confirmation Modal */}
      <Suspense fallback={null}>
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
          type="danger"
        />
      </Suspense>

      {/* Bulk Delete Confirmation Modal */}
      <Suspense fallback={null}>
        <ConfirmModal
          isOpen={showBulkDeleteModal}
          title="Delete Multiple Employees"
          message={`Are you sure you want to delete ${selectedEmployeeIds.size} employee(s)? This action cannot be undone.`}
          confirmText="Delete All"
          cancelText="Cancel"
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDeleteModal(false)}
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

export default React.memo(EmployeeList);
