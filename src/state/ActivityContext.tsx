import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { listToolActivity, saveFavorite, saveToolOpen, ToolActivity } from '../data/activityRepository';

interface ActivityState {
  activities: ToolActivity[];
  ready: boolean;
  isFavorite: (toolId: string) => boolean;
  recordOpen: (toolId: string) => Promise<void>;
  toggleFavorite: (toolId: string) => Promise<void>;
}

const ActivityContext = createContext<ActivityState | null>(null);

export function ActivityProvider({ children }: PropsWithChildren) {
  const [activities, setActivities] = useState<ToolActivity[]>([]);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(async () => setActivities(await listToolActivity()), []);

  useEffect(() => { refresh().finally(() => setReady(true)); }, [refresh]);
  const isFavorite = useCallback((toolId: string) => activities.some((item) => item.toolId === toolId && item.favorite), [activities]);
  const recordOpen = useCallback(async (toolId: string) => { await saveToolOpen(toolId); await refresh(); }, [refresh]);
  const toggleFavorite = useCallback(async (toolId: string) => { await saveFavorite(toolId, !isFavorite(toolId)); await refresh(); }, [isFavorite, refresh]);
  const value = useMemo(() => ({ activities, ready, isFavorite, recordOpen, toggleFavorite }), [activities, ready, isFavorite, recordOpen, toggleFavorite]);
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const value = useContext(ActivityContext);
  if (!value) throw new Error('useActivity doit être utilisé dans ActivityProvider');
  return value;
}
