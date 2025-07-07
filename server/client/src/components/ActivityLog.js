import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../socket';

const LogPanel = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch logs initially
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/logs');
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };

    fetchLogs();

    // Real-time log updates
    socket.on('newLog', (newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]); // keep only 20 logs
    });

    return () => socket.off('newLog');
  }, []);

  return (
    <div style={{
      width: '300px',
      backgroundColor: '#fdfdfd',
      borderLeft: '1px solid #ccc',
      padding: '1rem',
      overflowY: 'auto',
      height: '100vh',
      position: 'fixed',
      right: 0,
      top: 0
    }}>
      <h3 style={{ textAlign: 'center' }}>📋 Activity Log</h3>
      {logs.map((log) => (
        <div key={log._id} style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          <p>{log.message}</p>
          <small style={{ color: '#888' }}>{new Date(log.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default LogPanel;
