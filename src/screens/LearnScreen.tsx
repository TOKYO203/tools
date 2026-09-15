import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/tokens';

const steps = [
  { short: 'Qualité', title: 'Vérifier le tracé', text: 'Identité, qualité du signal, étalonnage et vitesse avant toute interprétation.' },
  { short: 'Rythme', title: 'Rythme', text: 'Régulier ou irrégulier ? Rechercher les ondes P et leur relation avec les QRS.' },
  { short: 'FC', title: 'Fréquence', text: 'Estimer la fréquence ventriculaire et la confronter au contexte clinique.' },
  { short: 'Axe', title: 'Axe électrique', text: 'Apprécier l’axe frontal global à partir des dérivations des membres.' },
  { short: 'PR/QRS', title: 'Intervalles', text: 'Mesurer PR, durée du QRS, QT et QTc lorsque cela est pertinent.' },
  { short: 'ST-T', title: 'Morphologie & repolarisation', text: 'Analyser QRS, progression de R, ondes Q, segment ST et ondes T.' },
];

const measurementTools: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string; color: string; bg: string }[] = [
  { icon: 'speedometer-outline', title: 'Fréquence', text: 'Calculer la FC', color: colors.teal, bg: colors.mint },
  { icon: 'timer-outline', title: 'QT / QTc', text: 'Bazett · Fridericia', color: colors.violet, bg: colors.violetSoft },
  { icon: 'navigate-outline', title: 'Axe électrique', text: 'Orientation QRS', color: colors.blue, bg: colors.blueSoft },
  { icon: 'resize-outline', title: 'Intervalles', text: 'PR · QRS · QT', color: colors.teal, bg: colors.mint },
];

export function LearnScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>ECG TOOLKIT</Text>
      <Text style={styles.title}>Lire. Mesurer. Vérifier.</Text>
      <Text style={styles.subtitle}>Une lecture structurée de l’ECG, du rythme aux intervalles, sans surcharge visuelle.</Text>

      <LinearGradient colors={[colors.violetDeep, '#403075']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Analyse rapide ECG</Text>
            <Text style={styles.heroMeta}>Méthode en 6 étapes</Text>
          </View>
          <View style={styles.premiumBadge}><Text style={styles.premiumText}>PREMIUM</Text></View>
        </View>

        <View style={styles.waveform}>
          <View style={styles.waveLine} />
          <Ionicons name="pulse" size={72} color="#72E2CF" />
          <View style={styles.waveLine} />
        </View>

        <View style={styles.heroSteps}>
          {steps.map((step, index) => (
            <View key={step.short} style={[styles.heroStep, index === 0 && styles.heroStepActive]}>
              <Text style={[styles.heroStepText, index === 0 && styles.heroStepTextActive]}>{index + 1}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <Text style={styles.sectionLabel}>OUTILS DE MESURE</Text>
      <View style={styles.measureGrid}>
        {measurementTools.map((tool) => (
          <View key={tool.title} style={styles.measureCard}>
            <View style={[styles.measureIcon, { backgroundColor: tool.bg }]}><Ionicons name={tool.icon} size={20} color={tool.color} /></View>
            <Text style={styles.measureTitle}>{tool.title}</Text>
            <Text style={styles.measureText}>{tool.text}</Text>
            <View style={styles.soonBadge}><Text style={styles.soonText}>Bientôt actif</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.methodCard}>
        <View style={styles.methodHeader}>
          <View style={styles.methodCopy}>
            <Text style={styles.methodTitle}>Lecture structurée</Text>
            <Text style={styles.methodSubtitle}>6 étapes, toujours dans le même ordre</Text>
          </View>
          <View style={styles.guideBadge}><Text style={styles.guideText}>Guide</Text></View>
        </View>
        <View style={styles.methodChips}>
          {steps.map((step) => <View key={step.short} style={styles.methodChip}><Text style={styles.methodChipText}>{step.short}</Text></View>)}
        </View>
      </View>

      <Text style={styles.sectionLabel}>MÉTHODE DÉTAILLÉE</Text>
      <View style={styles.stepsList}>
        {steps.map((step, index) => (
          <View key={step.title} style={styles.stepCard}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
            <View style={styles.stepBody}><Text style={styles.stepTitle}>{step.title}</Text><Text style={styles.stepText}>{step.text}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.explainable}>
        <Ionicons name="sparkles" size={17} color={colors.violet} />
        <Text style={styles.explainableText}>Les fonctions ECG avancées resteront explicables : chaque mesure affichera la formule, le repère ou le critère utilisé.</Text>
      </View>

      <View style={styles.disclaimer}>
        <Ionicons name="shield-checkmark-outline" size={18} color={colors.teal} />
        <Text style={styles.disclaimerText}>Référence pédagogique. Ne remplace pas l’interprétation médicale, la comparaison aux tracés antérieurs ni les recommandations locales.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: 36 },
  kicker: { color: colors.violet, fontWeight: '900', fontSize: 10, letterSpacing: 1.2 },
  title: { marginTop: 15, color: colors.ink, fontSize: 30, lineHeight: 35, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { marginTop: 10, color: colors.muted, fontSize: 13, lineHeight: 19 },
  hero: { marginTop: 17, paddingHorizontal: 18, paddingVertical: 20, borderRadius: radius.lg, ...shadow },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroCopy: { flex: 1 },
  heroTitle: { color: colors.white, fontSize: 17, fontWeight: '900' },
  heroMeta: { marginTop: 3, color: '#D1CCF0', fontSize: 10 },
  premiumBadge: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: '#5E4A9E' },
  premiumText: { color: '#F0E5FF', fontSize: 9, fontWeight: '900' },
  waveform: { height: 76, marginVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  waveLine: { flex: 1, height: 2, backgroundColor: '#72E2CF', borderRadius: 1 },
  heroSteps: { flexDirection: 'row', gap: 7 },
  heroStep: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10 },
  heroStepActive: { backgroundColor: 'rgba(125,229,209,0.18)' },
  heroStepText: { color: '#B0ABD1', fontSize: 10, fontWeight: '900' },
  heroStepTextActive: { color: '#8FF2E0' },
  sectionLabel: { marginTop: 24, marginBottom: 11, color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  measureCard: { width: '48.5%', minHeight: 142, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  measureIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  measureTitle: { marginTop: 11, color: colors.ink, fontSize: 13, fontWeight: '900' },
  measureText: { marginTop: 5, color: colors.muted, fontSize: 9 },
  soonBadge: { marginTop: 11, alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.canvas },
  soonText: { color: colors.muted, fontSize: 8, fontWeight: '800' },
  methodCard: { marginTop: 17, padding: 16, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  methodHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  methodCopy: { flex: 1 },
  methodTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  methodSubtitle: { marginTop: 3, color: colors.muted, fontSize: 10 },
  guideBadge: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.violetSoft },
  guideText: { color: colors.violet, fontSize: 9, fontWeight: '900' },
  methodChips: { marginTop: 13, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  methodChip: { paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, backgroundColor: colors.canvas },
  methodChipText: { color: colors.muted, fontSize: 8, fontWeight: '800' },
  stepsList: { gap: 9 },
  stepCard: { flexDirection: 'row', gap: 12, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  stepNumber: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.violetSoft },
  stepNumberText: { color: colors.violet, fontWeight: '900', fontSize: 12 },
  stepBody: { flex: 1 },
  stepTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  stepText: { marginTop: 4, color: colors.muted, fontSize: 11, lineHeight: 17 },
  explainable: { marginTop: 18, flexDirection: 'row', gap: 9, padding: 13, borderRadius: 14, backgroundColor: colors.violetSoft },
  explainableText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 15 },
  disclaimer: { marginTop: 17, flexDirection: 'row', gap: 9, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  disclaimerText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 16 },
});
