import express from "express";

import "./loadEnvironment.mjs"

import users from "./routes/users.mjs"


const app = express();

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.use("/users", users)

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
})

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
