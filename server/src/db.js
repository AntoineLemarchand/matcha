// db.js
import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: 'db',
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
});

async function query(sql, params = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

export default {query};
