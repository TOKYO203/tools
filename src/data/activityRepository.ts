import * as SQLite from 'expo-sqlite';

export interface ToolActivity {
  toolId: string;
  favorite: boolean;
  openedAt: number | null;
  openCount: number;
}

let database: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDatabase() {
  database ??= SQLite.openDatabaseAsync('medical-toolbox.db');
  const db = await database;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tool_activity (
      tool_id TEXT PRIMARY KEY NOT NULL,
      favorite INTEGER NOT NULL DEFAULT 0,
      opened_at INTEGER,
      open_count INTEGER NOT NULL DEFAULT 0
    );
  `);
  return db;
}

export async function listToolActivity(): Promise<ToolActivity[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ tool_id: string; favorite: number; opened_at: number | null; open_count: number }>(
    'SELECT tool_id, favorite, opened_at, open_count FROM tool_activity ORDER BY opened_at DESC',
  );
  return rows.map((row) => ({ toolId: row.tool_id, favorite: row.favorite === 1, openedAt: row.opened_at, openCount: row.open_count }));
}

export async function saveToolOpen(toolId: string) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO tool_activity (tool_id, opened_at, open_count) VALUES (?, ?, 1)
     ON CONFLICT(tool_id) DO UPDATE SET opened_at = excluded.opened_at, open_count = open_count + 1`,
    toolId,
    Date.now(),
  );
}

export async function saveFavorite(toolId: string, favorite: boolean) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO tool_activity (tool_id, favorite) VALUES (?, ?)
     ON CONFLICT(tool_id) DO UPDATE SET favorite = excluded.favorite`,
    toolId,
    favorite ? 1 : 0,
  );
}
