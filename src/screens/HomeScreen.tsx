import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { clinicalRegistry, searchClinicalTools } from '../domain/clinical/registry';
import { ClinicalTool } from '../domain/clinical/types';
import { useActivity } from '../state/ActivityContext';
import { colors, radius, spacing } from '../theme/tokens';

export function HomeScreen({ onOpenTool, onBrowse, onScores, onEcg, onPremium }: {
  onOpenTool: (tool: ClinicalTool) => void;
  onBrowse: () => void;
  onScores: () => void;
  onEcg: () => void;
  onPremium: () => void;
}) {
  const [query, setQuery] = useState('');
  const { activities } = useActivity();
  const results = searchClinicalTools(query);
  const favorites = activities.filter((item) => item.favorite).map((item) => clinicalRegistry.find((tool) => tool.id === item.toolId)).filter((tool): tool is ClinicalTool => !!tool);
  const recent = activities.filter((item) => item.openedAt !== null).slice(0, 3).map((item) => clinicalRegistry.find((tool) => tool.id === item.toolId)).filter((tool): tool is ClinicalTool => !!tool);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>MEDICAL TOOLBOX</Text><Text style={styles.greeting}>Référence clinique rapide</Text></View>
        <Pressable onPress={onPremium} style={styles.premiumChip}><Ionicons name="diamond" size={14} color="#8A5907" /><Text style={styles.premiumChipText}>PREMIUM</Text></Pressable>
      </View>

      <Text style={styles.title}>Outils. Scores. ECG.</Text>
      <Text style={styles.subtitle}>Accédez rapidement aux références utiles et aux calculateurs, même hors connexion.</Text>
      <SearchBar value={query} onChangeText={setQuery} />

      {!!query ? (
        <View style={styles.section}><Text style={styles.sectionTitle}>{results.length} résultat{results.length > 1 ? 's' : ''}</Text>{results.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} compact />)}</View>
      ) : (
        <>
          <View style={styles.hubs}>
            <Pressable style={styles.hubCard} onPress={onBrowse}>
              <View style={styles.hubIcon}><Ionicons name="grid-outline" size={24} color={colors.teal} /></View>
              <View style={styles.hubBody}><Text style={styles.hubTitle}>Outils</Text><Text style={styles.hubText}>Références et aides cliniques classées par spécialité.</Text></View>
              <Ionicons name="chevron-forward" size={20} color={colors.teal} />
            </Pressable>
            <Pressable style={styles.hubCard} onPress={onScores}>
              <View style={styles.hubIcon}><Ionicons name="calculator-outline" size={24} color={colors.teal} /></View>
              <View style={styles.hubBody}><Text style={styles.hubTitle}>Scores</Text><Text style={styles.hubText}>Calculateurs cliniques avec critères, résultat et source.</Text></View>
              <Ionicons name="chevron-forward" size={20} color={colors.teal} />
            </Pressable>
            <Pressable style={styles.hubCard} onPress={onEcg}>
              <View style={styles.hubIcon}><Ionicons name="pulse-outline" size={24} color={colors.teal} /></View>
              <View style={styles.hubBody}><Text style={styles.hubTitle}>ECG</Text><Text style={styles.hubText}>Méthode de lecture structurée et futurs calculateurs ECG.</Text></View>
              <Ionicons name="chevron-forward" size={20} color={colors.teal} />
            </Pressable>
          </View>

          <View style={styles.stats}><View style={styles.stat}><Text style={styles.statValue}>100%</Text><Text style={styles.statLabel}>Hors ligne</Text></View><View style={styles.divider} /><View style={styles.stat}><Text style={styles.statValue}>{clinicalRegistry.length}</Text><Text style={styles.statLabel}>Outils indexés</Text></View><View style={styles.divider} /><View style={styles.stat}><Text style={styles.statValue}>V1</Text><Text style={styles.statLabel}>Socle clinique</Text></View></View>

          <Pressable onPress={onPremium} style={styles.premiumBanner}><View style={styles.premiumIcon}><Ionicons name="diamond" size={20} color="#8A5907" /></View><View style={styles.premiumCopy}><Text style={styles.premiumTitle}>Medical Toolbox Premium</Text><Text style={styles.premiumText}>Plus d’outils, plus de scores et des fonctions ECG avancées.</Text></View><Ionicons name="chevron-forward" size={20} color={colors.teal} /></Pressable>

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
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: 38 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 1.7 },
  greeting: { marginTop: 4, color: colors.muted, fontSize: 14, fontWeight: '600' },
  premiumChip: { height: 37, paddingHorizontal: 11, borderRadius: radius.pill, backgroundColor: '#FFF0C7', flexDirection: 'row', alignItems: 'center', gap: 6 },
  premiumChipText: { color: '#8A5907', fontSize: 9, fontWeight: '900', letterSpacing: .6 },
  title: { marginTop: 23, color: colors.ink, fontSize: 34, lineHeight: 39, fontWeight: '900', letterSpacing: -1.2 },
  subtitle: { marginTop: 10, marginBottom: 20, color: colors.muted, fontSize: 15, lineHeight: 21 },
  hubs: { marginTop: 20, gap: 11 },
  hubCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  hubIcon: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.mint },
  hubBody: { flex: 1 },
  hubTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  hubText: { marginTop: 4, color: colors.muted, fontSize: 12, lineHeight: 17 },
  stats: { marginTop: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingVertical: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  statLabel: { marginTop: 3, color: colors.muted, fontSize: 10, fontWeight: '600' },
  divider: { height: 28, width: 1, backgroundColor: colors.line },
  sectionHeader: { marginTop: 28, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  savedLabel: { color: colors.danger, fontSize: 11, fontWeight: '800' },
  link: { color: colors.teal, fontSize: 13, fontWeight: '800' },
  section: { marginTop: 18, gap: 12 },
  sectionCompact: { gap: 9 },
  disclaimer: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 15, backgroundColor: colors.mint, borderRadius: radius.md },
  disclaimerText: { flex: 1, color: colors.tealDark, fontSize: 12, lineHeight: 17, fontWeight: '600' },
  premiumBanner: { marginTop: 14, padding: 15, borderRadius: radius.md, borderWidth: 1, borderColor: '#E8D59D', backgroundColor: '#FFFAEC', flexDirection: 'row', alignItems: 'center', gap: 11 },
  premiumIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#FFF0C7', alignItems: 'center', justifyContent: 'center' },
  premiumCopy: { flex: 1 },
  premiumTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  premiumText: { marginTop: 3, color: colors.muted, fontSize: 10 },
});
