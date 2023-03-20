//require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
//const uri = process.env.DB_URI
const uri = "mongodb://localhost:27017";

const app = express();

app.get("/", (req, res) => {
    res.json("Hello World");
});

app.post("/signup", (req, res) => {
    res.json("Hello World");
});

app.get("/users", async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("test");
        const users = database.collection("user");

        const returnedUsers = await users.find().toArray();
        res.send(returnedUsers);
    } finally {
        await client.close();
    }
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
