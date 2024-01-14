import db from '../src/db.js';
import fs from 'fs';

const initTables = async () => {
    try {
        const schema = fs.readFileSync('db/schema.sql').toString();
        await db.query(schema);
        console.log("[INFO] User table created")
    } catch (err) {
        throw new Error(err);
    }
}

export default initTables;
