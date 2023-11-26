import mariadb from 'mariadb';
const pool = mariadb.createPool({
    host: 'db',
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
});

const conn = await pool.getConnection();

export default conn;