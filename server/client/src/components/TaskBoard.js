import React, { useEffect, useState } from 'react';
import Column from './Column';
import axios from 'axios';
import { DragDropContext } from '@hello-pangea/dnd';
import socket from '../socket';
import ActivityLog from './ActivityLog';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchTasksAndLogs = async () => {
      const taskRes = await axios.get('http://localhost:5000/api/tasks');
      const logRes = await axios.get('http://localhost:5000/api/logs');
      setTasks(taskRes.data);
      setLogs(logRes.data);
    };

    fetchTasksAndLogs();

    socket.on('taskCreated', (newTask) => setTasks((prev) => [...prev, newTask]));
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });
    socket.on('taskDeleted', (id) => {
      setTasks((prev) => prev.filter((task) => task._id !== id));
    });
    socket.on('newLog', (log) => setLogs((prev) => [log, ...prev.slice(0, 19)]));

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      socket.off('newLog');
    };
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: destination.droppableId } : task
    );
    setTasks(updatedTasks);

    await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, {
      status: destination.droppableId
    });
  };

  const getTasksByStatus = (status) => tasks.filter((task) => task.status === status);

 return (
  <div>
    <h1 className="board-heading">📝 Real-Time
Collaborative To-Do Board</h1>

    <div style={{ display: 'flex' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-container">
          <Column title="Todo" tasks={getTasksByStatus('Todo')} />
          <Column title="In Progress" tasks={getTasksByStatus('In Progress')} />
          <Column title="Done" tasks={getTasksByStatus('Done')} />
        </div>
      </DragDropContext>
      <ActivityLog logs={logs} />
    </div>
  </div>
);
};

export default TaskBoard;
