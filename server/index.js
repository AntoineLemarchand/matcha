import express from 'express';
import cors from 'cors';
import userRouter from './src/user/user.router.js';
import authRouter from './src/auth/auth.router.js';
import initTables from './db/init-db.js';
import cookies from 'cookie-parser';
import http from 'http';
import { WebSocketServer } from 'ws';
import authController from './src/auth/auth.controller.js';

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
  try {
    authController.verify(token);
  } catch (err) {
    ws.close();
  }
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
