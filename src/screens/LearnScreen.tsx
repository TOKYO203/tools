import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

const steps = [
  { n: '1', title: 'Vérifier le tracé', text: 'Identité, qualité du signal, étalonnage et vitesse du papier avant toute interprétation.' },
  { n: '2', title: 'Fréquence', text: 'Estimer la fréquence ventriculaire puis préciser si elle est adaptée au contexte.' },
  { n: '3', title: 'Rythme', text: 'Régulier ou irrégulier ? Rechercher les ondes P et leur relation avec les QRS.' },
  { n: '4', title: 'Axe', text: 'Apprécier l’axe électrique global à partir des dérivations frontales.' },
  { n: '5', title: 'Intervalles', text: 'Mesurer PR, durée du QRS, QT et QTc lorsque cela est pertinent.' },
  { n: '6', title: 'Morphologie', text: 'Analyser progression de R, QRS, ondes Q pathologiques éventuelles et critères morphologiques.' },
  { n: '7', title: 'ST et T', text: 'Rechercher les anomalies de repolarisation et toujours les interpréter dans le contexte clinique.' },
];

const tools = [
  { icon: 'speedometer-outline', title: 'Fréquence cardiaque', text: 'Aide au calcul sur rythme régulier ou irrégulier.', status: 'À intégrer' },
  { icon: 'analytics-outline', title: 'Axe électrique', text: 'Assistant simple pour orienter l’axe frontal.', status: 'À intégrer' },
  { icon: 'timer-outline', title: 'QT / QTc', text: 'Mesure et correction du QT avec formule documentée.', status: 'À intégrer' },
  { icon: 'git-compare-outline', title: 'Intervalles ECG', text: 'Repères rapides pour PR, QRS et QT/QTc.', status: 'Référence' },
];

export function LearnScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>ECG</Text>
      <Text style={styles.title}>Lecture ECG structurée.</Text>
      <Text style={styles.subtitle}>Une référence rapide pour lire un ECG toujours dans le même ordre, sans module de quiz ni cas clinique.</Text>

      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" size={21} color={colors.teal} />
        <Text style={styles.noticeText}>Commencer par vérifier la qualité et l’étalonnage du tracé. Un ECG s’interprète toujours avec les symptômes, les constantes et le contexte clinique.</Text>
      </View>

      <Text style={styles.sectionTitle}>Méthode en 7 étapes</Text>
      <View style={styles.list}>
        {steps.map((step) => (
          <View key={step.n} style={styles.stepCard}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{step.n}</Text></View>
            <View style={styles.stepBody}><Text style={styles.stepTitle}>{step.title}</Text><Text style={styles.stepText}>{step.text}</Text></View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Outils ECG</Text>
      <View style={styles.toolsList}>
        {tools.map((tool) => (
          <View key={tool.title} style={styles.toolCard}>
            <View style={styles.icon}><Ionicons name={tool.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.teal} /></View>
            <View style={styles.toolBody}><Text style={styles.toolTitle}>{tool.title}</Text><Text style={styles.toolText}>{tool.text}</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>{tool.status}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Ionicons name="shield-checkmark-outline" size={19} color={colors.teal} />
        <Text style={styles.disclaimerText}>Référence pédagogique. Ne remplace pas l’interprétation médicale, la comparaison aux ECG antérieurs ni les recommandations locales.</Text>
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
  sectionTitle: { marginTop: 28, marginBottom: 12, color: colors.ink, fontSize: 18, fontWeight: '900' },
  list: { gap: 10 },
  stepCard: { flexDirection: 'row', gap: 13, padding: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  stepNumber: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mint },
  stepNumberText: { color: colors.teal, fontWeight: '900', fontSize: 13 },
  stepBody: { flex: 1 },
  stepTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  stepText: { marginTop: 4, color: colors.muted, fontSize: 12, lineHeight: 18 },
  toolsList: { gap: 10 },
  toolCard: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: colors.mint },
  toolBody: { flex: 1 },
  toolTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  toolText: { marginTop: 3, color: colors.muted, fontSize: 11, lineHeight: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9, backgroundColor: colors.canvas },
  badgeText: { color: colors.muted, fontSize: 9, fontWeight: '800' },
  disclaimer: { marginTop: 24, flexDirection: 'row', gap: 9, padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  disclaimerText: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 17 },
});
