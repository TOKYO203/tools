import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, radius } from '../theme/tokens';

export function SearchBar({ value, onChangeText, placeholder = 'Score, symptôme ou spécialité…' }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search-outline" size={19} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#82918E"
        style={styles.input}
        returnKeyType="search"
        accessibilityLabel="Rechercher un outil clinique"
      />
      {!!value && (
        <Pressable onPress={() => onChangeText('')} accessibilityLabel="Effacer la recherche" hitSlop={8}>
          <Ionicons name="close-circle" size={19} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 9,
  },
  input: { flex: 1, color: colors.ink, fontSize: 14, paddingVertical: 0 },
});
