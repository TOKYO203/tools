import { useMemo, useState } from 'react';
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
import { colors } from './src/theme/tokens';

export default function App() {
  const [tab, setTab] = useState<AppTab>('home');
  const [selectedTool, setSelectedTool] = useState<ClinicalTool | null>(null);

  const content = useMemo(() => {
    if (selectedTool) return <ToolScreen tool={selectedTool} onBack={() => setSelectedTool(null)} />;
    switch (tab) {
      case 'catalogue': return <CatalogueScreen onOpenTool={setSelectedTool} />;
      case 'learn': return <LearnScreen />;
      case 'progress': return <ProgressScreen />;
      default: return <HomeScreen onOpenTool={setSelectedTool} onBrowse={() => setTab('catalogue')} />;
    }
  }, [selectedTool, tab]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <View style={styles.app}>{content}</View>
        {!selectedTool && <BottomNav active={tab} onChange={setTab} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  app: { flex: 1 },
});
