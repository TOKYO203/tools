import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { clinicalRegistry, searchClinicalTools } from '../domain/clinical/registry';
import { ClinicalTool } from '../domain/clinical/types';
import { useActivity } from '../state/ActivityContext';
import { colors, radius, shadow, spacing } from '../theme/tokens';

export function HomeScreen({ onOpenTool, onBrowse }: { onOpenTool: (tool: ClinicalTool) => void; onBrowse: () => void }) {
  const [query, setQuery] = useState('');
  const { activities } = useActivity();
  const results = searchClinicalTools(query);
  const favorites = activities.filter((item) => item.favorite).map((item) => clinicalRegistry.find((tool) => tool.id === item.toolId)).filter((tool): tool is ClinicalTool => !!tool);
  const recent = activities.filter((item) => item.openedAt !== null).slice(0, 3).map((item) => clinicalRegistry.find((tool) => tool.id === item.toolId)).filter((tool): tool is ClinicalTool => !!tool);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}><View><Text style={styles.eyebrow}>MEDICAL TOOLBOX</Text><Text style={styles.greeting}>Bonjour 👋</Text></View><View style={styles.avatar}><Ionicons name="person" size={19} color={colors.teal} /></View></View>
      <Text style={styles.title}>Votre pratique.{`\n`}Votre maîtrise.</Text>
      <Text style={styles.subtitle}>Trouvez, calculez et comprenez — même sans connexion.</Text>
      <SearchBar value={query} onChangeText={setQuery} />
      {!!query ? (
        <View style={styles.section}><Text style={styles.sectionTitle}>{results.length} résultat{results.length > 1 ? 's' : ''}</Text>{results.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} compact />)}</View>
      ) : (
        <>
          <LinearGradient colors={['#087B72', '#07534E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroOrb} /><View style={styles.heroIcon}><Ionicons name="flash" size={20} color="#BDF5E1" /></View><Text style={styles.heroLabel}>RÉVISION DU JOUR</Text><Text style={styles.heroTitle}>Gardez vos réflexes cliniques affûtés</Text><Text style={styles.heroText}>5 questions · environ 4 minutes</Text>
            <Pressable style={styles.heroButton}><Text style={styles.heroButtonText}>Commencer</Text><Ionicons name="arrow-forward" size={17} color={colors.tealDark} /></Pressable>
          </LinearGradient>
          <View style={styles.stats}><View style={styles.stat}><Text style={styles.statValue}>100%</Text><Text style={styles.statLabel}>Hors ligne</Text></View><View style={styles.divider} /><View style={styles.stat}><Text style={styles.statValue}>{clinicalRegistry.length}</Text><Text style={styles.statLabel}>Outils indexés</Text></View><View style={styles.divider} /><View style={styles.stat}><Text style={styles.statValue}>V1</Text><Text style={styles.statLabel}>Socle clinique</Text></View></View>
          {!!favorites.length && <><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Vos favoris</Text><Text style={styles.savedLabel}>{favorites.length} épinglé{favorites.length > 1 ? 's' : ''}</Text></View><View style={styles.sectionCompact}>{favorites.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} compact />)}</View></>}
          {!!recent.length && <><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Récemment utilisés</Text></View><View style={styles.sectionCompact}>{recent.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} compact />)}</View></>}
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Outils essentiels</Text><Pressable onPress={onBrowse}><Text style={styles.link}>Tout voir</Text></Pressable></View>
          <View style={styles.section}>{clinicalRegistry.slice(0, 3).map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} />)}</View>
          <View style={styles.disclaimer}><Ionicons name="shield-checkmark-outline" size={20} color={colors.teal} /><Text style={styles.disclaimerText}>Aide pédagogique et à la décision. Ne remplace pas le jugement clinique.</Text></View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, content: { padding: spacing.lg, paddingBottom: 38 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 1.7 }, greeting: { marginTop: 4, color: colors.muted, fontSize: 14, fontWeight: '600' }, avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 23, color: colors.ink, fontSize: 34, lineHeight: 39, fontWeight: '900', letterSpacing: -1.2 }, subtitle: { marginTop: 10, marginBottom: 20, color: colors.muted, fontSize: 15, lineHeight: 21 }, hero: { marginTop: 20, minHeight: 246, padding: 22, borderRadius: radius.lg, overflow: 'hidden', ...shadow }, heroOrb: { position: 'absolute', width: 190, height: 190, borderRadius: 95, right: -55, top: -68, backgroundColor: 'rgba(255,255,255,0.06)' }, heroIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }, heroLabel: { marginTop: 16, color: '#BDF5E1', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }, heroTitle: { marginTop: 7, maxWidth: 270, color: '#FFFFFF', fontSize: 22, lineHeight: 27, fontWeight: '900' }, heroText: { marginTop: 5, color: '#C7DFDA', fontSize: 13 }, heroButton: { marginTop: 18, width: 132, minHeight: 42, borderRadius: radius.pill, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, heroButtonText: { color: colors.tealDark, fontWeight: '800' },
  stats: { marginTop: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingVertical: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line }, stat: { flex: 1, alignItems: 'center' }, statValue: { color: colors.ink, fontSize: 17, fontWeight: '900' }, statLabel: { marginTop: 3, color: colors.muted, fontSize: 10, fontWeight: '600' }, divider: { height: 28, width: 1, backgroundColor: colors.line }, sectionHeader: { marginTop: 28, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '900' }, savedLabel: { color: colors.danger, fontSize: 11, fontWeight: '800' }, link: { color: colors.teal, fontSize: 13, fontWeight: '800' }, section: { marginTop: 18, gap: 12 }, sectionCompact: { gap: 9 }, disclaimer: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 15, backgroundColor: colors.mint, borderRadius: radius.md }, disclaimerText: { flex: 1, color: colors.tealDark, fontSize: 12, lineHeight: 17, fontWeight: '600' },
});
