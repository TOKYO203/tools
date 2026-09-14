import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ToolCard } from '../components/ToolCard';
import { calculatorDefinitions } from '../domain/clinical/definitions';
import { clinicalRegistry } from '../domain/clinical/registry';
import type { ClinicalTool } from '../domain/clinical/types';
import { colors, radius, spacing } from '../theme/tokens';

export function ProgressScreen({ onOpenTool }: { onOpenTool: (tool: ClinicalTool) => void }) {
  const calculatorIds = new Set(calculatorDefinitions.map((definition) => definition.toolId));
  const scores = clinicalRegistry.filter((tool) => calculatorIds.has(tool.id));
  const upcoming = clinicalRegistry.filter((tool) => !tool.available && ['ckd-epi-2021'].includes(tool.id));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>SCORES & CALCULATEURS</Text>
      <Text style={styles.title}>Calculer rapidement, interpréter prudemment.</Text>
      <Text style={styles.subtitle}>Scores cliniques structurés, avec critères explicites, résultat et source.</Text>

      <View style={styles.notice}>
        <Ionicons name="calculator-outline" size={22} color={colors.teal} />
        <Text style={styles.noticeText}>Aucun score n’est calculé tant que tous les critères requis ne sont pas renseignés.</Text>
      </View>

      <View style={styles.headerRow}><Text style={styles.sectionTitle}>Disponibles</Text><Text style={styles.count}>{scores.length} scores</Text></View>
      <View style={styles.list}>{scores.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} />)}</View>

      {!!upcoming.length && <>
        <View style={styles.headerRow}><Text style={styles.sectionTitle}>À venir</Text></View>
        <View style={styles.list}>{upcoming.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} />)}</View>
      </>}

      <View style={styles.disclaimer}>
        <Ionicons name="shield-checkmark-outline" size={19} color={colors.teal} />
        <Text style={styles.disclaimerText}>Les scores sont des aides à la décision. Leur interprétation dépend de l’indication, du contexte clinique et des recommandations applicables.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: 40 },
  kicker: { color: colors.teal, fontWeight: '900', fontSize: 10, letterSpacing: 1.5 },
  title: { marginTop: 8, color: colors.ink, fontSize: 31, lineHeight: 37, fontWeight: '900' },
  subtitle: { marginTop: 10, color: colors.muted, fontSize: 15, lineHeight: 21 },
  notice: { marginTop: 22, flexDirection: 'row', gap: 10, padding: 15, backgroundColor: colors.mint, borderRadius: radius.md },
  noticeText: { flex: 1, color: colors.tealDark, fontSize: 12, lineHeight: 18, fontWeight: '600' },
  headerRow: { marginTop: 27, marginBottom: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  count: { color: colors.teal, fontSize: 11, fontWeight: '800' },
  list: { gap: 12 },
  disclaimer: { marginTop: 24, flexDirection: 'row', gap: 9, padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  disclaimerText: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 17 },
});
