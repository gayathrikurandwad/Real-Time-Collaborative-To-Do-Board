import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const TaskCard = ({ task, index }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-badge priority-high';
      case 'Medium':
        return 'priority-badge priority-medium';
      case 'Low':
      default:
        return 'priority-badge priority-low';
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card"
          style={provided.draggableProps.style}
        >
          <div className="task-title">{task.title}</div>
          <div className="task-meta">{task.description}</div>
          <div className="task-priority">
            <span className={getPriorityClass(task.priority)}>{task.priority}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
