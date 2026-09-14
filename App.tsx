import { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { BottomNav, type AppTab } from './src/components/BottomNav';
import { ClinicalTool } from './src/domain/clinical/types';
import { CatalogueScreen } from './src/screens/CatalogueScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LearnScreen } from './src/screens/LearnScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { ToolScreen } from './src/screens/ToolScreen';
import { ActivityProvider, useActivity } from './src/state/ActivityContext';
import { colors } from './src/theme/tokens';

export default function App() {
  return <SafeAreaProvider><ActivityProvider><AppContent /></ActivityProvider></SafeAreaProvider>;
}

function AppContent() {
  const [tab, setTab] = useState<AppTab>('home');
  const [selectedTool, setSelectedTool] = useState<ClinicalTool | null>(null);
  const { recordOpen } = useActivity();
  const openTool = useCallback((tool: ClinicalTool) => { setSelectedTool(tool); void recordOpen(tool.id); }, [recordOpen]);

  const content = useMemo(() => {
    if (selectedTool) return <ToolScreen tool={selectedTool} onBack={() => setSelectedTool(null)} />;
    switch (tab) {
      case 'catalogue': return <CatalogueScreen onOpenTool={openTool} />;
      case 'learn': return <LearnScreen />;
      case 'progress': return <ProgressScreen />;
      default: return <HomeScreen onOpenTool={openTool} onBrowse={() => setTab('catalogue')} />;
    }
  }, [openTool, selectedTool, tab]);

  return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={styles.app}>{content}</View>
        {!selectedTool && <BottomNav active={tab} onChange={setTab} />}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  app: { flex: 1 },
});
