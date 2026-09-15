import { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { BottomNav, type AppTab } from './src/components/BottomNav';
import { ClinicalTool } from './src/domain/clinical/types';
import { CatalogueScreen } from './src/screens/CatalogueScreen';
import { EcgToolkitScreen } from './src/screens/EcgToolkitScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { PremiumScreen } from './src/screens/PremiumScreen';
import { ToolScreen } from './src/screens/ToolScreen';
import { ActivityProvider, useActivity } from './src/state/ActivityContext';
import { colors } from './src/theme/tokens';

export default function App() {
  return <SafeAreaProvider><ActivityProvider><AppContent /></ActivityProvider></SafeAreaProvider>;
}

function AppContent() {
  const [tab, setTab] = useState<AppTab>('home');
  const [selectedTool, setSelectedTool] = useState<ClinicalTool | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const { recordOpen } = useActivity();
  const openTool = useCallback((tool: ClinicalTool) => { setSelectedTool(tool); void recordOpen(tool.id); }, [recordOpen]);

  const content = useMemo(() => {
    if (selectedTool) return <ToolScreen tool={selectedTool} onBack={() => setSelectedTool(null)} />;
    if (showPremium) return <PremiumScreen onBack={() => setShowPremium(false)} />;
    switch (tab) {
      case 'catalogue': return <CatalogueScreen onOpenTool={openTool} />;
      case 'progress': return <ProgressScreen onOpenTool={openTool} />;
      case 'learn': return <EcgToolkitScreen />;
      default: return <HomeScreen onOpenTool={openTool} onBrowse={() => setTab('catalogue')} onScores={() => setTab('progress')} onEcg={() => setTab('learn')} onPremium={() => setShowPremium(true)} />;
    }
  }, [openTool, selectedTool, showPremium, tab]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={styles.app}>{content}</View>
      {!selectedTool && !showPremium && <BottomNav active={tab} onChange={setTab} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  app: { flex: 1 },
});
