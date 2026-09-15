import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { ClinicalTool } from '../domain/clinical/types';
import { colors, radius, shadow } from '../theme/tokens';
import { MotionSurface } from './MotionSurface';

export function ToolCard({ tool, onPress, compact = false }: { tool: ClinicalTool; onPress: () => void; compact?: boolean }) {
  return (
    <MotionSurface
      onPress={onPress}
      accessibilityLabel={`Ouvrir ${tool.name}`}
      style={[styles.card, compact && styles.compact]}
    >
      <View style={[styles.icon, { backgroundColor: tool.surfaceColor }]}>
        <Ionicons name={tool.icon as keyof typeof Ionicons.glyphMap} size={compact ? 20 : 22} color={tool.color} />
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{tool.name}</Text>
        <Text style={styles.meta} numberOfLines={1}>{tool.specialty} · {tool.duration}</Text>
        {!compact && <Text style={styles.summary} numberOfLines={2}>{tool.summary}</Text>}
      </View>
      <View style={styles.trailing}>
        {tool.available ? <View style={styles.offline}><Text style={styles.offlineText}>VALIDÉ</Text></View> : <Text style={styles.soon}>Bientôt</Text>}
        <Ionicons name="chevron-forward" size={18} color="#8D9A97" />
      </View>
    </MotionSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    minHeight: 96,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  compact: { minHeight: 82, paddingVertical: 13, shadowOpacity: 0, elevation: 0 },
  icon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 3 },
  name: { fontSize: 15, lineHeight: 19, fontWeight: '900', color: colors.ink },
  meta: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  summary: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  trailing: { alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch', paddingVertical: 2 },
  offline: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.mint },
  offlineText: { color: colors.tealDark, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  soon: { color: colors.amber, fontSize: 9, fontWeight: '800' },
});
