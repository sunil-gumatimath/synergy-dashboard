import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Plus, Filter, Search, ClipboardList } from "lucide-react";
import TaskColumn from "./TaskColumn";
import { taskService } from "../../services/taskService";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./tasks.css";

import CreateTaskModal from "../../components/CreateTaskModal";
import Toast from "../../components/Toast";

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, my-tasks
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toast, setToast] = useState(null);

    const columns = {
        todo: "To Do",
        "in-progress": "In Progress",
        review: "Review",
        done: "Done",
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        const { data } = await taskService.getAll();
        setTasks(data || []);
        setIsLoading(false);
    };

    const handleCreateTask = async (taskData) => {
        const { data, error } = await taskService.create(taskData);

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
        return tasks.filter((task) => task.status === status);
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="pl-10 pr-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-surface)] text-sm w-64 focus:outline-none focus:border-[var(--primary)]"
                        />
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
