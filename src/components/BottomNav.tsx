import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

export type AppTab = 'home' | 'catalogue' | 'learn' | 'progress';
const items: { key: AppTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'Accueil', icon: 'home-outline' },
  { key: 'catalogue', label: 'Outils', icon: 'grid-outline' },
  { key: 'learn', label: 'Apprendre', icon: 'school-outline' },
  { key: 'progress', label: 'Progrès', icon: 'analytics-outline' },
];

export function BottomNav({ active, onChange }: { active: AppTab; onChange: (tab: AppTab) => void }) {
  return (
    <View style={styles.nav} accessibilityRole="tablist">
      {items.map((item) => {
        const selected = active === item.key;
        return (
          <Pressable key={item.key} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onChange(item.key)} style={styles.item}>
            <View style={[styles.iconWrap, selected && styles.iconWrapActive]}>
              <Ionicons name={selected ? item.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap : item.icon} size={21} color={selected ? colors.teal : colors.muted} />
            </View>
            <Text style={[styles.label, selected && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 8, paddingBottom: 9 },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  iconWrap: { height: 30, minWidth: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  iconWrapActive: { backgroundColor: colors.mint },
  label: { fontSize: 11, fontWeight: '600', color: colors.muted },
  labelActive: { color: colors.teal, fontWeight: '800' },
});
