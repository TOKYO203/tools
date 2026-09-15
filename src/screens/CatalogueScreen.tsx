import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { searchClinicalTools } from '../domain/clinical/registry';
import { ClinicalTool } from '../domain/clinical/types';
import { colors, radius, spacing } from '../theme/tokens';

export function CatalogueScreen({ onOpenTool }: { onOpenTool: (tool: ClinicalTool) => void }) {
  const [query, setQuery] = useState('');
  const tools = useMemo(() => searchClinicalTools(query), [query]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>OUTILS CLINIQUES</Text>
      <Text style={styles.title}>Le bon outil, au bon moment.</Text>
      <Text style={styles.subtitle}>Recherchez par nom, acronyme, contexte ou spécialité.</Text>

      <SearchBar value={query} onChangeText={setQuery} placeholder="Rechercher un outil…" />

      <View style={styles.statusCard}>
        <View style={styles.statusIcon}><Ionicons name="shield-checkmark-outline" size={20} color={colors.teal} /></View>
        <View style={styles.statusCopy}>
          <Text style={styles.statusTitle}>Registre clinique contrôlé</Text>
          <Text style={styles.statusText}>Les outils actifs affichent leur source, leurs limites et leur date de revue.</Text>
        </View>
      </View>

      <View style={styles.countRow}>
        <Text style={styles.sectionLabel}>{query ? 'RÉSULTATS' : 'BIBLIOTHÈQUE'}</Text>
        <Text style={styles.count}>{tools.length} outil{tools.length > 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.list}>{tools.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} />)}</View>

      {!tools.length && (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Ionicons name="search-outline" size={24} color={colors.teal} /></View>
          <Text style={styles.emptyTitle}>Aucun outil trouvé</Text>
          <Text style={styles.emptyText}>Essayez un acronyme, une spécialité ou un terme différent.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: 38 },
  kicker: { color: colors.blue, fontWeight: '900', fontSize: 10, letterSpacing: 1.2 },
  title: { marginTop: 8, color: colors.ink, fontSize: 30, lineHeight: 36, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { marginTop: 8, marginBottom: 18, color: colors.muted, fontSize: 13, lineHeight: 19 },
  statusCard: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  statusIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: colors.mint },
  statusCopy: { flex: 1 },
  statusTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  statusText: { marginTop: 3, color: colors.muted, fontSize: 10, lineHeight: 15 },
  countRow: { marginTop: 24, marginBottom: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  count: { color: colors.teal, fontSize: 10, fontWeight: '900' },
  list: { gap: 10 },
  empty: { marginTop: 18, alignItems: 'center', paddingVertical: 42, paddingHorizontal: 28, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  emptyIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.mint },
  emptyTitle: { marginTop: 13, color: colors.ink, fontSize: 16, fontWeight: '900' },
  emptyText: { marginTop: 6, color: colors.muted, textAlign: 'center', fontSize: 11, lineHeight: 17 },
});
