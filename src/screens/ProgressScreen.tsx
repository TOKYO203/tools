import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { ToolCard } from '../components/ToolCard';
import { calculatorDefinitions } from '../domain/clinical/definitions';
import { formulaDefinitions } from '../domain/clinical/formulaDefinitions';
import { clinicalRegistry } from '../domain/clinical/registry';
import type { ClinicalTool } from '../domain/clinical/types';
import { colors, radius, shadow, spacing } from '../theme/tokens';

type Filter = 'Tous' | 'Cardio' | 'Urgences' | 'Neuro' | 'Pneumo';
const filters: Filter[] = ['Tous', 'Cardio', 'Urgences', 'Neuro', 'Pneumo'];

export function ProgressScreen({ onOpenTool }: { onOpenTool: (tool: ClinicalTool) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Tous');
  const scoreIds = useMemo(() => new Set([
    ...calculatorDefinitions.map((definition) => definition.toolId),
    ...formulaDefinitions.map((definition) => definition.toolId),
  ]), []);
  const scores = useMemo(() => clinicalRegistry.filter((tool) => tool.available && scoreIds.has(tool.id)), [scoreIds]);
  const heart = scores.find((tool) => tool.id === 'heart-score');

  const visibleScores = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('fr');
    return scores.filter((tool) => {
      const haystack = [tool.name, tool.acronym, tool.specialty, ...tool.keywords].join(' ').toLocaleLowerCase('fr');
      const queryMatches = !needle || haystack.includes(needle);
      const specialty = tool.specialty.toLocaleLowerCase('fr');
      const filterMatches = filter === 'Tous'
        || (filter === 'Cardio' && specialty.includes('cardio'))
        || (filter === 'Urgences' && specialty.includes('urgence'))
        || (filter === 'Neuro' && specialty.includes('neuro'))
        || (filter === 'Pneumo' && specialty.includes('pneumo'));
      return queryMatches && filterMatches;
    });
  }, [filter, query, scores]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>SCORES & CALCULATEURS</Text>
      <Text style={styles.title}>Scores cliniques</Text>
      <Text style={styles.subtitle}>Des outils rapides, sourcés et lisibles en quelques secondes.</Text>

      <SearchBar value={query} onChangeText={setQuery} placeholder="Rechercher un score…" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((item) => {
          const active = item === filter;
          return (
            <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, active && styles.filterActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {!query && filter === 'Tous' && heart && (
        <Pressable onPress={() => onOpenTool(heart)} style={({ pressed }) => pressed && styles.pressed}>
          <LinearGradient colors={['#0A3836', '#0F6359']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featured}>
            <View style={styles.featuredTop}>
              <View style={styles.featuredIcon}><Ionicons name="heart" size={20} color="#CCF5E8" /></View>
              <View style={styles.featuredBody}>
                <Text style={styles.featuredTitle}>HEART Score</Text>
                <Text style={styles.featuredMeta}>Cardiologie / Urgences · 2 min</Text>
              </View>
              <View style={styles.validated}><Text style={styles.validatedText}>VALIDÉ</Text></View>
            </View>
            <Text style={styles.featuredText}>Stratification structurée du risque cardiovasculaire, avec interprétation immédiatement visible.</Text>
          </LinearGradient>
        </Pressable>
      )}

      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>{query || filter !== 'Tous' ? 'RÉSULTATS' : 'TOUS LES SCORES'}</Text>
        <Text style={styles.count}>{visibleScores.length} outil{visibleScores.length > 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.list}>
        {visibleScores.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} compact />)}
      </View>

      {!visibleScores.length && (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Ionicons name="search-outline" size={24} color={colors.teal} /></View>
          <Text style={styles.emptyTitle}>Aucun score trouvé</Text>
          <Text style={styles.emptyText}>Essayez un autre acronyme, une autre spécialité ou retirez le filtre actif.</Text>
        </View>
      )}

      <View style={styles.disclaimer}>
        <Ionicons name="shield-checkmark-outline" size={19} color={colors.teal} />
        <Text style={styles.disclaimerText}>Aucune valeur n’est présélectionnée. Les scores restent des aides à la décision et doivent être interprétés dans leur contexte clinique.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: 36 },
  pressed: { opacity: 0.78 },
  kicker: { color: colors.teal, fontWeight: '900', fontSize: 10, letterSpacing: 1.1 },
  title: { marginTop: 7, color: colors.ink, fontSize: 30, lineHeight: 36, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { marginTop: 8, marginBottom: 18, color: colors.muted, fontSize: 13, lineHeight: 19 },
  filters: { gap: 7, paddingTop: 14, paddingBottom: 16 },
  filter: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.surface },
  filterActive: { backgroundColor: colors.tealDark },
  filterText: { color: colors.muted, fontSize: 9, fontWeight: '900' },
  filterTextActive: { color: colors.white },
  featured: { padding: 17, borderRadius: radius.md, ...shadow },
  featuredTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  featuredIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
  featuredBody: { flex: 1 },
  featuredTitle: { color: colors.white, fontSize: 16, fontWeight: '900' },
  featuredMeta: { marginTop: 3, color: '#CCE8E3', fontSize: 10 },
  validated: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: '#267066' },
  validatedText: { color: '#D9FAF0', fontSize: 9, fontWeight: '900' },
  featuredText: { marginTop: 12, color: '#DBF0EB', fontSize: 12, lineHeight: 17 },
  headerRow: { marginTop: 24, marginBottom: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  count: { color: colors.teal, fontSize: 10, fontWeight: '900' },
  list: { gap: 9 },
  empty: { marginTop: 18, alignItems: 'center', paddingVertical: 34, paddingHorizontal: 26, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  emptyIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.mint },
  emptyTitle: { marginTop: 13, color: colors.ink, fontSize: 16, fontWeight: '900' },
  emptyText: { marginTop: 6, color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center' },
  disclaimer: { marginTop: 24, flexDirection: 'row', gap: 9, padding: 14, borderRadius: radius.md, backgroundColor: colors.mint },
  disclaimerText: { flex: 1, color: colors.tealDark, fontSize: 11, lineHeight: 17, fontWeight: '600' },
});
