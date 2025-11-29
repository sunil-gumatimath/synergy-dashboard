import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Plus, Filter, ClipboardList, X } from "lucide-react";
import TaskColumn from "./TaskColumn";
import { taskService } from "../../services/taskService";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./tasks.css";

import CreateTaskModal from "../../components/CreateTaskModal";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toast, setToast] = useState(null);

    // Filter State
    const [filterPriority, setFilterPriority] = useState("all");
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Edit/Delete State
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [initialStatus, setInitialStatus] = useState("todo");

    const columns = {
        todo: "To Do",
        "in-progress": "In Progress",
        review: "Review",
        done: "Done",
    };

    const fetchTasks = async () => {
        setIsLoading(true);
        const { data } = await taskService.getAll();
        setTasks(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateTask = async (taskData) => {
        const { data: _data, error } = await taskService.create(taskData);

        if (error) {
            setToast({ type: "error", message: "Failed to create task" });
        } else {
            setToast({ type: "success", message: "Task created successfully" });
            setShowCreateModal(false);
            fetchTasks();
        }
    };

    const handleUpdateTask = async (taskData) => {
        if (!editingTask) return;

        const { error } = await taskService.update(editingTask.id, taskData);

        if (error) {
            setToast({ type: "error", message: "Failed to update task" });
        } else {
            setToast({ type: "success", message: "Task updated successfully" });
            setShowCreateModal(false);
            setEditingTask(null);
            fetchTasks();
        }
    };

    const handleDeleteTask = async () => {
        if (!deletingTask) return;

        const { error } = await taskService.delete(deletingTask.id);

        if (error) {
            setToast({ type: "error", message: "Failed to delete task" });
        } else {
            setToast({ type: "success", message: "Task deleted successfully" });
            setShowDeleteModal(false);
            setDeletingTask(null);
            fetchTasks();
        }
    };

    const openCreateModal = (status = "todo") => {
        setEditingTask(null);
        setInitialStatus(status);
        setShowCreateModal(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setInitialStatus(task.status);
        setShowCreateModal(true);
    };

    const openDeleteModal = (task) => {
        setDeletingTask(task);
        setShowDeleteModal(true);
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Optimistic update
        const newStatus = destination.droppableId;
        const updatedTasks = tasks.map((task) =>
            task.id.toString() === draggableId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);

        // API call
        await taskService.updateStatus(draggableId, newStatus);
    };

    const getTasksByStatus = (status) => {
        let filteredTasks = tasks.filter((task) => task.status === status);

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredTasks = filteredTasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(term) ||
                    (task.description && task.description.toLowerCase().includes(term)) ||
                    (task.assignee?.name && task.assignee.name.toLowerCase().includes(term))
            );
        }

        // Apply priority filter
        if (filterPriority !== "all") {
            filteredTasks = filteredTasks.filter(
                (task) => task.priority.toLowerCase() === filterPriority
            );
        }

        return filteredTasks;
    };

    if (isLoading) {
        return <LoadingSpinner size="lg" message="Loading tasks..." />;
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-main flex items-center gap-2">
                        <ClipboardList size={28} className="text-primary" />
                        Tasks & Tickets
                    </h1>
                    <p className="text-muted text-sm">Manage team workload and requests</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-1 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-surface)] text-sm w-52 h-8 focus:outline-none focus:border-[var(--primary)]"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
                                title="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            className={`btn ${filterPriority !== 'all' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                        >
                            <Filter size={18} />
                            {filterPriority === 'all' ? 'Filter' : `Priority: ${filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}`}
                        </button>
                        {showFilterMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                {['all', 'high', 'medium', 'low'].map((priority) => (
                                    <button
                                        key={priority}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterPriority === priority ? 'text-primary font-medium' : 'text-gray-700'}`}
                                        onClick={() => {
                                            setFilterPriority(priority);
                                            setShowFilterMenu(false);
                                        }}
                                    >
                                        {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => openCreateModal("todo")}
                    >
                        <Plus size={18} />
                        New Task
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="task-board-container">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="task-board">
                        {Object.entries(columns).map(([columnId, title]) => (
                            <TaskColumn
                                key={columnId}
                                columnId={columnId}
                                title={title}
                                tasks={getTasksByStatus(columnId)}
                                onEdit={openEditModal}
                                onDelete={openDeleteModal}
                                onAdd={() => openCreateModal(columnId)}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>

            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingTask(null);
                }}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                isLoading={false}
                taskToEdit={editingTask}
                initialStatus={initialStatus}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteTask}
                title="Delete Task"
                message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />

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

export default TaskBoard;
