import express from 'express';
import cors from 'cors';
import userRouter from './src/user/user.router.js';
import authRouter from './src/auth/auth.router.js';
import initTables from './db/init-db.js';
import cookies from 'cookie-parser';

const app = express();
const apiRouter = express.Router();

app.use(cors(
  {
    origin: `http://${process.env.SERVER_URL}:${process.env.CLIENT_PORT}`,
    credentials: true,
  }
));
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

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
