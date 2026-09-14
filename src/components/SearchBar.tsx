import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, radius } from '../theme/tokens';

export function SearchBar({ value, onChangeText, placeholder = 'Score, symptôme ou spécialité…' }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={20} color={colors.muted} />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#82918E" style={styles.input} returnKeyType="search" accessibilityLabel="Rechercher un outil clinique" />
      {!!value && <Ionicons name="close-circle" size={19} color={colors.muted} onPress={() => onChangeText('')} />}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { flexDirection: 'row', alignItems: 'center', minHeight: 54, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: 10 }, input: { flex: 1, color: colors.ink, fontSize: 15 } });
