import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { searchClinicalTools } from '../domain/clinical/registry';
import { ClinicalTool } from '../domain/clinical/types';
import { colors, spacing } from '../theme/tokens';

export function CatalogueScreen({ onOpenTool }: { onOpenTool: (tool: ClinicalTool) => void }) {
  const [query, setQuery] = useState('');
  const tools = useMemo(() => searchClinicalTools(query), [query]);
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.kicker}>REGISTRE CLINIQUE</Text><Text style={styles.title}>Tous les outils</Text><Text style={styles.subtitle}>Recherche par nom, acronyme, contexte ou spécialité.</Text><SearchBar value={query} onChangeText={setQuery} /><View style={styles.countRow}><Text style={styles.count}>{tools.length} outils indexés</Text><Text style={styles.offline}>Disponible hors ligne</Text></View><View style={styles.list}>{tools.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} />)}</View>{!tools.length && <View style={styles.empty}><Text style={styles.emptyTitle}>Aucun outil trouvé</Text><Text style={styles.emptyText}>Essayez un acronyme, une spécialité ou un symptôme différent.</Text></View>}</ScrollView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.canvas }, content: { padding: spacing.lg, paddingBottom: 40 }, kicker: { color: colors.teal, fontWeight: '900', fontSize: 10, letterSpacing: 1.5 }, title: { marginTop: 6, color: colors.ink, fontSize: 31, fontWeight: '900' }, subtitle: { marginTop: 7, marginBottom: 19, color: colors.muted, fontSize: 14 }, countRow: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }, count: { color: colors.ink, fontSize: 13, fontWeight: '800' }, offline: { color: colors.teal, fontSize: 11, fontWeight: '700' }, list: { marginTop: 12, gap: 12 }, empty: { alignItems: 'center', paddingVertical: 60 }, emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: '800' }, emptyText: { marginTop: 7, color: colors.muted, textAlign: 'center' } });
