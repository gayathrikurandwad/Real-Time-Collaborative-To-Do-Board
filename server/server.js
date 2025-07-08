const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const socket = require('./socket'); 
const logRoutes = require('./routes/logRoutes');



dotenv.config();

const app = express();
const server = http.createServer(app); 

// Initialize Socket.IO
const io = socket.init(server);
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

const cors = require('cors');
app.use(cors({
  origin: 'https://real-time-collaborative-to-do-board-weld.vercel.app/register',  
  credentials: true
}));

app.use(express.json());
app.use('/api/logs', logRoutes);


// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
