import express from 'express';
import cors from 'cors';
import userRouter from './src/user/user.router.js';
import authRouter from './src/auth/auth.router.js';
import initTables from './db/init-db.js';
import cookies from 'cookie-parser';
import http from 'http';
import setupWss from './src/wss.js';

const app = express();
const server = http.createServer(app);
const apiRouter = express.Router();

app.use(cors({
  origin: `https://${process.env.SERVER_URL}:${process.env.SERVER_PORT}`,
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

setupWss(server);

server.listen(3000, () => {
  console.log(`[INFO] backend server running`);
});
