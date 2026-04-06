import { getDatabase } from "../database.js";

export function countUsers() {
  const database = getDatabase();
  const row = database.prepare("SELECT COUNT(*) AS count FROM users").get();
  return row.count;
}

export function findUserByEmail(email) {
  const database = getDatabase();

  return database
    .prepare(`
      SELECT id, name, email, password, role, created_at AS createdAt
      FROM users
      WHERE lower(email) = lower(?)
      LIMIT 1
    `)
    .get(email);
}

export function createUser({ name, email, password, role = "Member" }) {
  const database = getDatabase();

  const result = database
    .prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `)
    .run(name, email, password, role);

  return database
    .prepare(`
      SELECT id, name, email, password, role, created_at AS createdAt
      FROM users
      WHERE id = ?
      LIMIT 1
    `)
    .get(result.lastInsertRowid);
}

export function listUsers() {
  const database = getDatabase();

  return database
    .prepare(`
      SELECT id, name, email, role, created_at AS createdAt
      FROM users
      ORDER BY id ASC
    `)
    .all();
}
