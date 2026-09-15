import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../theme/tokens';

export type AppTab = 'home' | 'catalogue' | 'learn' | 'progress';

const items: { key: AppTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'Accueil', icon: 'home-outline' },
  { key: 'catalogue', label: 'Outils', icon: 'grid-outline' },
  { key: 'progress', label: 'Scores', icon: 'calculator-outline' },
  { key: 'learn', label: 'ECG', icon: 'pulse-outline' },
];

export function BottomNav({ active, onChange }: { active: AppTab; onChange: (tab: AppTab) => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.nav} accessibilityRole="tablist">
        {items.map((item) => {
          const selected = active === item.key;
          const activeColor = item.key === 'learn' ? colors.violet : colors.tealDark;
          const activeBg = item.key === 'learn' ? colors.violetSoft : colors.mint;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onChange(item.key)}
              style={({ pressed }) => [styles.item, selected && { backgroundColor: activeBg }, pressed && styles.pressed]}
            >
              <Ionicons
                name={selected ? item.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap : item.icon}
                size={18}
                color={selected ? activeColor : colors.muted}
              />
              <Text style={[styles.label, selected && { color: activeColor, fontWeight: '900' }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { backgroundColor: colors.canvas, paddingHorizontal: 14, paddingTop: 8 },
  nav: {
    flexDirection: 'row',
    gap: 5,
    padding: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    ...shadow,
  },
  item: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 12 },
  label: { fontSize: 9, fontWeight: '700', color: colors.muted },
  pressed: { opacity: 0.72 },
});
