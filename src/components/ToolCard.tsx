import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ClinicalTool } from '../domain/clinical/types';
import { colors, radius, shadow } from '../theme/tokens';

export function ToolCard({ tool, onPress, compact = false }: { tool: ClinicalTool; onPress: () => void; compact?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Ouvrir ${tool.name}`}>
      <View style={[styles.icon, { backgroundColor: tool.surfaceColor }]}><Ionicons name={tool.icon as keyof typeof Ionicons.glyphMap} size={23} color={tool.color} /></View>
      <View style={styles.body}>
        <View style={styles.topline}><Text style={styles.name} numberOfLines={1}>{tool.name}</Text>{tool.available ? <View style={styles.offline}><Text style={styles.offlineText}>OFFLINE</Text></View> : <Text style={styles.soon}>Bientôt</Text>}</View>
        <Text style={styles.meta}>{tool.specialty} · {tool.duration}</Text>
        {!compact && <Text style={styles.summary} numberOfLines={2}>{tool.summary}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#93A29F" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, backgroundColor: colors.surface, borderRadius: radius.md, ...shadow },
  compact: { paddingVertical: 13, shadowOpacity: 0, elevation: 0, borderWidth: 1, borderColor: colors.line }, pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  icon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, body: { flex: 1, gap: 3 }, topline: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { flexShrink: 1, fontSize: 16, fontWeight: '800', color: colors.ink }, meta: { color: colors.muted, fontSize: 12, fontWeight: '600' }, summary: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 3 },
  offline: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, backgroundColor: colors.mint }, offlineText: { color: colors.tealDark, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 }, soon: { color: colors.amber, fontSize: 10, fontWeight: '800' },
});
