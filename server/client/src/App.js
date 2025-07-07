import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import TaskBoard from './components/TaskBoard';
import './App.css'; // ✅ Ensure styling is linked

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/board" element={<TaskBoard />} />
      </Routes>
    </Router>
  );
};

export default App;
