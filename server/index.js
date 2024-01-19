import express from 'express';
import cors from 'cors';
import userRouter from './src/user/user.router.js';
import authRouter from './src/auth/auth.router.js';
import initTables from './db/init-db.js';
import cookies from 'cookie-parser';
import http from 'http';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);
const apiRouter = express.Router();

app.use(cors({
  origin: `http://${process.env.SERVER_URL}:${process.env.CLIENT_PORT}`,
  credentials: true,
}));
app.use(express.json());
app.use(cookies());

try {
  initTables();
} catch (err) {
  console.log(err);
}

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);

apiRouter.get("/", (req, res) => {
  res.json("Hello World");
});

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const token = req.headers.cookie.split('=')[1];
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
      case 'swipe':
        ws.send('not implemented yet');
        break;
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
