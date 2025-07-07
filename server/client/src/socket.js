import { io } from 'socket.io-client';

// Point to your backend URL
const socket = io('http://localhost:5000');

export default socket;
