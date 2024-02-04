import { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken';
import User from "./user/user.model.js";

export default function setupWss(server) {
  const wss = new WebSocketServer({ server });
  const instanceMap = new Map();

  const closeConnection = (ws, userId) => {
    ws.send(JSON.stringify({ action: 'logout' }));
    if (userId && instanceMap.has(userId)) {
      const connections = instanceMap.get(userId).filter(conn => conn !== ws);
      if (connections.length > 0) {
        instanceMap.set(userId, connections);
      } else {
        instanceMap.delete(userId);
        // now date to SQL format
        User.update(userId, {online: false, last_seen: new Date().toISOString().slice(0, 19).replace('T', ' ')})
      }
    }
    ws.close();
  }

  wss.on('connection', (ws, req) => {
    if (!req.headers.cookie) {
      closeConnection(ws, null);
      return;
    }
    const cookies = req.headers.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (!tokenCookie) {
      closeConnection(ws, null);
      return;
    }

    const token = tokenCookie.split('=')[1];
    if (!token) {
      closeConnection(ws, null);
      return;
    }

    let userId;
    try {
      userId = jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (e) {
      closeConnection(ws, null);
      return;
    }

    const connections = instanceMap.get(userId) || [];
    instanceMap.set(userId, [...connections, ws]);
    User.update(userId, {online: true})

    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      if (!data.action) return;
      switch(data.action) {
        case 'chat':
          if (!data.to || !data.message) return;
          console.log('sending message to: ', data.to);
          console.log('message: ', data.message);
          break;
      }
    });

    ws.on('close', () => {
      closeConnection(ws, userId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      closeConnection(ws, userId);
    });
  });

  // Function to send message to a specific user
  const sendMessageToUser = (userId, message) => {
    if (instanceMap.has(userId)) {
      instanceMap.get(userId).forEach(ws => {
        ws.send(JSON.stringify(message));
      });
    }
  }

  // Expose sendMessageToUser for external use if needed
  return { sendMessageToUser };
}
