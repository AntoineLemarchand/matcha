import express from 'express';
import cors from 'cors';
import userRouter from './src/user/user.router.js';
import authRouter from './src/auth/auth.router.js';
import initTables from './db/init-db.js';
import cookies from 'cookie-parser';
import http from 'http';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import User from './src/user/user.model.js';

const app = express();
const server = http.createServer(app);
const apiRouter = express.Router();

app.use(cors({
  origin: `http://${process.env.SERVER_URL}:${process.env.CLIENT_PORT}`,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true}));
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
app.use('/api/images', express.static('images'));

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message, stack: err.stack });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  if (!req.headers.cookie) {
    ws.send(JSON.stringify({ action: 'logout' }));
    ws.close();
    return
  }
  const cookies = req.headers.cookie.split(';');
  const token = cookies.find(cookie => cookie.includes('token')).split('=')[1];
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
      case 'propositions':
        (new User()).getPropositions(userId, 10).then((propositions) => {
          ws.send(JSON.stringify({ action: 'propositions', data: propositions }));
        });
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
