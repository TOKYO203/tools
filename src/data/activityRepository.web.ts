export interface ToolActivity {
  toolId: string;
  favorite: boolean;
  openedAt: number | null;
  openCount: number;
}

const STORAGE_KEY = 'medical-toolbox:tool-activity:v1';

function readAll(): ToolActivity[] {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ToolActivity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: ToolActivity[]) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage failures in private/restricted browser contexts.
  }
}

export async function listToolActivity(): Promise<ToolActivity[]> {
  return readAll().sort((a, b) => (b.openedAt ?? 0) - (a.openedAt ?? 0));
}

export async function saveToolOpen(toolId: string) {
  const items = readAll();
  const existing = items.find((item) => item.toolId === toolId);
  if (existing) {
    existing.openedAt = Date.now();
    existing.openCount += 1;
  } else {
    items.push({ toolId, favorite: false, openedAt: Date.now(), openCount: 1 });
  }
  writeAll(items);
}

export async function saveFavorite(toolId: string, favorite: boolean) {
  const items = readAll();
  const existing = items.find((item) => item.toolId === toolId);
  if (existing) existing.favorite = favorite;
  else items.push({ toolId, favorite, openedAt: null, openCount: 0 });
  writeAll(items);
}
