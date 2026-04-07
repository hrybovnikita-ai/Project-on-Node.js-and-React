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
  const userRow = database.prepare("SELECT COUNT(*) AS count FROM users").get();
  const projectRow = database.prepare("SELECT COUNT(*) AS count FROM projects").get();

  if (userRow.count === 0) {
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

  if (projectRow.count === 0) {
    const insertProject = database.prepare(`
      INSERT INTO projects (name, status, progress, owner, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const seedProjects = [
      ["Neon Garden UI", "In Progress", 82, "Demo User", "High", "2026-04-14"],
      ["Analytics Sync API", "Review", 64, "Project Member", "Medium", "2026-04-18"],
      ["Portal Motion Pass", "Planning", 29, "Demo User", "Medium", "2026-04-22"],
      ["Customer Access Flow", "Done", 100, "SQL Viewer", "High", "2026-04-05"],
    ];

    for (const project of seedProjects) {
      insertProject.run(...project);
    }
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
