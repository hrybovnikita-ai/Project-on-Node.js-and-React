import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const currentDir = dirname(fileURLToPath(import.meta.url));
const dataDir = join(currentDir, "data");
const databasePath = join(dataDir, "app.db");
const schemaPath = join(currentDir, "sql", "schema.sql");

let database;

function getSchemaSql() {
  return readFileSync(schemaPath, "utf8");
}

function seedDatabase() {
  const row = database.prepare("SELECT COUNT(*) AS count FROM users").get();

  if (row.count > 0) {
    return;
  }

  const insertUser = database.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `);

  const seedUsers = [
    ["Demo User", "demo@example.com", "password123", "Administrator"],
    ["Project Member", "member@example.com", "secret456", "Editor"],
    ["SQL Viewer", "viewer@example.com", "viewer789", "Viewer"],
  ];

  for (const user of seedUsers) {
    insertUser.run(...user);
  }
}

export function initDatabase() {
  if (database) {
    return database;
  }

  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  database = new DatabaseSync(databasePath);
  database.exec(getSchemaSql());
  seedDatabase();

  return database;
}

export function getDatabase() {
  return initDatabase();
}

export function getDatabaseInfo() {
  return {
    client: "SQLite",
    file: databasePath,
  };
}
