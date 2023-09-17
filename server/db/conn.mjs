import { MongoClient } from "mongodb";

const connectionString = process.env.MONGO_URI || "";
console.log("MongoDB URI:", connectionString);

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch (err) {
  console.error(err);
}

let db = conn.db(process.env.MONGO_INITDB_DATABASE || "test");

export default db;
