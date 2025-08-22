import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '12345',
  database: 'postgres',
});

export async function signupUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
    [username, hashedPassword]
  );
  return result.rows[0];
}

export async function loginUser(username, password) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  return { id: user.id, username: user.username };
}
