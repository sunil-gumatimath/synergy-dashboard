import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, MessageSquare, Paperclip, Trash2 } from "lucide-react";

const TaskCard = ({ task, index, onEdit, onDelete }) => {
    const getPriorityClass = (priority) => {
        switch (priority.toLowerCase()) {
            case "high":
                return "priority-high";
            case "medium":
                return "priority-medium";
            case "low":
                return "priority-low";
            default:
                return "priority-medium";
        }
    };

    const isOverdue = new Date(task.due_date) < new Date() && task.status !== "done";

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`task-card group ${snapshot.isDragging ? "dragging" : ""}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className={`task-priority-badge ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                        </div>
                        <button
                            className="text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(task);
                            }}
                            title="Delete Task"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    <h4
                        className="task-title cursor-pointer hover:text-primary transition-colors"
                        onClick={() => onEdit(task)}
                    >
                        {task.title}
                    </h4>

                    {task.description && (
                        <p className="task-description">{task.description}</p>
                    )}

                    <div className="task-footer">
                        <div className="task-meta">
                            {(task.comments > 0 || task.attachments > 0) && (
                                <>
                                    {task.comments > 0 && (
                                        <div className="task-meta-item" title={`${task.comments} comments`}>
                                            <MessageSquare size={14} />
                                            <span>{task.comments}</span>
                                        </div>
                                    )}
                                    {task.attachments > 0 && (
                                        <div className="task-meta-item" title={`${task.attachments} attachments`}>
                                            <Paperclip size={14} />
                                            <span>{task.attachments}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className={`task-meta-item task-date ${isOverdue ? "overdue" : ""}`}>
                                <Calendar size={14} />
                                <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>

                        {task.assignee && (
                            <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="task-assignee"
                                title={`Assigned to ${task.assignee.name}`}
                            />
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
