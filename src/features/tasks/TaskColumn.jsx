import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

const TaskColumn = ({ columnId, title, tasks }) => {
    return (
        <div className="task-column">
            <div className="task-column-header">
                <div className="task-column-title">
                    {title}
                    <span className="task-count-badge">{tasks.length}</span>
                </div>
            </div>

            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                    <div
                        className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <button className="add-task-btn">
                <Plus size={16} />
                Add Task
            </button>
        </div>
    );
};

export default TaskColumn;
