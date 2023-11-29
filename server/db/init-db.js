import db from '../src/models/db.js';

const initTables = async () => {
    try {
        await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        );`);
        console.log("[INFO] User table created")
    } catch (err) {
        throw new Error(err);
    }
}

export default initTables;