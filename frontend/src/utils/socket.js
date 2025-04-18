// utils/socket.js
import { io } from 'socket.io-client';

const socket = io('http://192.168.1.64:5000', {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;
