// utils/socket.js
import { io } from 'socket.io-client';

const socket = io('https://backend-igo.onrender.com', {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;
