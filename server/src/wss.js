import { WebSocketServer, WebSocket } from "ws";
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
          User.sendMessage(userId, data.to, data.message);
          sendMessageToUser([data.to, userId], { action: 'chat', from: userId, to: parseInt(data.to), message: data.message });
          break;
        case 'like':
          if (!data.id) return;
          User.like(userId, data.id);
          User.hasLiked(data.id, userId).then((result) => {
            console.log(result);
            if (result) {
              sendMessageToUser([data.id], { action: 'match', from: userId });
            } else {
              sendMessageToUser([data.id], { action: 'like', from: userId });
            }
          });
          break;
        case 'unlike':
          if (!data.id) return;
          User.unlike(userId, data.id);
          sendMessageToUser([data.id], { action: 'unlike', from: userId });
          break;
        case 'seen':
          if (!data.id) return;
          sendMessageToUser([data.id], { action: 'seen', from: userId });
          break;
        case 'report':
          if (!data.id) return;
          User.report(userId, data.id);
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
  const sendMessageToUser = (userIds, message) => {
    if (instanceMap.size === 0) return;

    for (const userId of userIds) {
      const id = parseInt(userId)
      if (instanceMap.has(id)) {
        const userConnections = instanceMap.get(id);
        for (const ws of userConnections) {
          try {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(message));
            }
          } catch (error) {
            console.error(`Error sending message to user ${id}:`, error);
          }
        }
      }
    }
  };

  // Expose sendMessageToUser for external use if needed
  return { sendMessageToUser };
}
