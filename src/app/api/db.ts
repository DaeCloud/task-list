// api/db.ts
import mysql from "mysql2/promise";

let pool: mysql.Pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function query(sql: string, params: any[] = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

/**
 * Create tables if they don't exist
 */
export async function initDb() {
  const pool = getPool();

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description LONGTEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log("Database initialized");
}
