import { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken';

export default function setupWss(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    if (!req.headers.cookie) {
      ws.send(JSON.stringify({ action: 'logout' }));
      ws.close();
      return
    }
    const cookies = req.headers.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.includes('token'));
    if (!tokenCookie) {
      ws.send(JSON.stringify({ action: 'logout' }));
      ws.close();
      return
    }
    const token = tokenCookie.split('=')[1];
    if (!token) {
      ws.send(JSON.stringify({ action: 'logout' }));
      ws.close();
      return
    }
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    if (!userId) {
      ws.send(JSON.stringify({ action: 'logout' }));
      ws.close();
      return
    }
    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      if (!data.action) return;
      switch(data.action) {
        case 'chat':
          ws.send('not implemented yet');
          break;
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}
