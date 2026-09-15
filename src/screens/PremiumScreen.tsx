import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Reveal } from '../components/MotionSurface';
import { colors, radius, shadow, spacing } from '../theme/tokens';

const benefits = [
  { icon: 'library-outline', title: 'Plus d’outils cliniques', text: 'Une bibliothèque plus large de références pratiques classées par spécialité.' },
  { icon: 'calculator-outline', title: 'Scores spécialisés', text: 'Davantage de calculateurs avec critères explicites, interprétation et sources.' },
  { icon: 'pulse-outline', title: 'ECG avancé', text: 'Calculateurs et aides de lecture ECG supplémentaires dans un espace dédié.' },
  { icon: 'cloud-offline-outline', title: 'Disponible partout', text: 'Le cœur clinique reste accessible hors connexion.' },
] as const;

export function PremiumScreen({ onBack }: { onBack: () => void }) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.top}>
      <Pressable onPress={onBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]} accessibilityLabel="Retour"><Ionicons name="arrow-back" size={22} color={colors.ink} /></Pressable>
      <View style={styles.secure}><Ionicons name="shield-checkmark" size={15} color={colors.teal} /><Text style={styles.secureText}>ACCÈS PREMIUM</Text></View>
    </View>

    <Reveal>
      <LinearGradient colors={['#0A756C', '#073D3A']} style={styles.hero}>
        <View style={styles.orb} />
        <View style={styles.crown}><Ionicons name="diamond" size={23} color="#FFE09A" /></View>
        <Text style={styles.label}>MEDICAL TOOLBOX PREMIUM</Text>
        <Text style={styles.title}>Plus d’outils.{`\n`}Plus de précision.</Text>
        <Text style={styles.subtitle}>Étendez Medical Toolbox avec des scores spécialisés et des fonctions ECG avancées.</Text>
        <View style={styles.proofRow}><Proof value="100 %" label="offline" /><Proof value="0" label="publicité" /><Proof value="3" label="piliers" /></View>
      </LinearGradient>
    </Reveal>

    <Text style={styles.sectionTitle}>Ce que Premium ajoute</Text>
    <Reveal delay={70} style={styles.list}>
      {benefits.map((benefit) => (
        <View key={benefit.title} style={styles.benefit}>
          <View style={styles.benefitIcon}><Ionicons name={benefit.icon} size={21} color={colors.teal} /></View>
          <View style={styles.benefitCopy}><Text style={styles.benefitTitle}>{benefit.title}</Text><Text style={styles.benefitText}>{benefit.text}</Text></View>
          <Ionicons name="checkmark-circle" size={20} color={colors.teal} />
        </View>
      ))}
    </Reveal>

    <Reveal delay={130} style={styles.plan}>
      <View style={styles.planHead}>
        <View style={styles.planCopy}><Text style={styles.planEyebrow}>OFFRE EN PRÉPARATION</Text><Text style={styles.planTitle}>Outils, scores et ECG dans une seule application.</Text></View>
        <View style={styles.badge}><Text style={styles.badgeText}>PREMIUM</Text></View>
      </View>
      <Text style={styles.planText}>Le tarif et le moyen de paiement disponibles dans votre pays seront affichés avant toute confirmation. Aucun achat n’est encore possible depuis cette version.</Text>
      <View style={styles.ctaDisabled}><View style={styles.ctaDot} /><Text style={styles.ctaDisabledText}>Paiement bientôt disponible</Text><Ionicons name="lock-closed-outline" size={16} color={colors.muted} /></View>
      <Text style={styles.reassurance}>Aucun paiement automatique. Aucune carte demandée pour le moment.</Text>
    </Reveal>

    <View style={styles.trust}><Ionicons name="heart-outline" size={22} color={colors.teal} /><Text style={styles.trustText}><Text style={styles.trustStrong}>Conçu pour votre confiance.</Text>{`\n`}Sources visibles, données locales et limites cliniques clairement indiquées.</Text></View>
  </ScrollView>;
}

function Proof({ value, label }: { value: string; label: string }) { return <View style={styles.proof}><Text style={styles.proofValue}>{value}</Text><Text style={styles.proofLabel}>{label}</Text></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: 45 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  secure: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.mint },
  secureText: { color: colors.tealDark, fontSize: 9, fontWeight: '900', letterSpacing: .7 },
  hero: { marginTop: 22, padding: 25, borderRadius: 30, overflow: 'hidden', ...shadow },
  orb: { position: 'absolute', width: 220, height: 220, borderRadius: 110, right: -85, top: -90, backgroundColor: 'rgba(255,255,255,.07)' },
  crown: { width: 46, height: 46, borderRadius: 15, backgroundColor: 'rgba(255,224,154,.14)', alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 19, color: '#FFE09A', fontSize: 10, fontWeight: '900', letterSpacing: 1.25 },
  title: { marginTop: 8, color: '#FFFFFF', fontSize: 31, lineHeight: 37, fontWeight: '900', letterSpacing: -.8 },
  subtitle: { marginTop: 11, color: '#C9E1DD', fontSize: 14, lineHeight: 21 },
  proofRow: { marginTop: 23, flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.14)', paddingTop: 18 },
  proof: { flex: 1 },
  proofValue: { color: '#FFFFFF', fontWeight: '900', fontSize: 17 },
  proofLabel: { color: '#AACBC5', fontSize: 10, marginTop: 2 },
  sectionTitle: { marginTop: 29, marginBottom: 13, color: colors.ink, fontSize: 19, fontWeight: '900' },
  list: { gap: 10 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  benefitIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  benefitCopy: { flex: 1 },
  benefitTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  benefitText: { marginTop: 3, color: colors.muted, fontSize: 11, lineHeight: 16 },
  plan: { marginTop: 25, padding: 20, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.teal },
  planHead: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  planCopy: { flex: 1 },
  planEyebrow: { color: colors.teal, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  planTitle: { marginTop: 6, maxWidth: 230, color: colors.ink, fontSize: 18, lineHeight: 23, fontWeight: '900' },
  badge: { alignSelf: 'flex-start', backgroundColor: '#FFF0C7', paddingHorizontal: 8, paddingVertical: 6, borderRadius: radius.pill },
  badgeText: { color: '#8A5907', fontSize: 8, fontWeight: '900' },
  planText: { marginTop: 14, color: colors.muted, fontSize: 12, lineHeight: 18 },
  ctaDisabled: { marginTop: 18, minHeight: 52, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  ctaDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.amber },
  ctaDisabledText: { flex: 1, color: colors.ink, fontWeight: '900', fontSize: 13 },
  reassurance: { marginTop: 10, color: colors.muted, fontSize: 10, textAlign: 'center' },
  trust: { marginTop: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.mint, borderRadius: radius.md },
  trustText: { flex: 1, color: colors.tealDark, fontSize: 11, lineHeight: 17 },
  trustStrong: { fontWeight: '900' },
});
