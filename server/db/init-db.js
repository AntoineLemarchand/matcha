import db from '../src/models/db.js';

const initTables = async () => {
    try {
        await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            date_of_birth TIMESTAMP,
            show_gender BOOLEAN,
            gender_identity VARCHAR(255),
            gender_interest VARCHAR(255),
            matches TEXT,
            about TEXT,
            image_url VARCHAR(255),
            password VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        );`);
        console.log("[INFO] User table created")
    } catch (err) {
        throw new Error(err);
    }
}

export default initTables;