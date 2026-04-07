import { getDatabase } from "../database.js";

export function countProjects() {
  const database = getDatabase();
  const row = database.prepare("SELECT COUNT(*) AS count FROM projects").get();
  return row.count;
}

export function listProjects() {
  const database = getDatabase();

  return database
    .prepare(`
      SELECT
        id,
        name,
        status,
        progress,
        owner,
        priority,
        due_date AS dueDate,
        created_at AS createdAt
      FROM projects
      ORDER BY
        CASE status
          WHEN 'In Progress' THEN 1
          WHEN 'Review' THEN 2
          WHEN 'Planning' THEN 3
          WHEN 'Done' THEN 4
          ELSE 5
        END,
        due_date ASC
    `)
    .all();
}
