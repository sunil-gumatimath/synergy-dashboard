import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Plus, Filter, Search, ClipboardList, X } from "lucide-react";
import TaskColumn from "./TaskColumn";
import { taskService } from "../../services/taskService";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./tasks.css";

import CreateTaskModal from "../../components/CreateTaskModal";
import Toast from "../../components/Toast";

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toast, setToast] = useState(null);

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
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <Search className="text-muted" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-10 py-2.5 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-surface)] text-sm w-80 focus:outline-none focus:border-[var(--primary)]"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors z-10"
                                title="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button className="btn btn-ghost">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
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
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>

            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateTask}
                isLoading={false}
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
