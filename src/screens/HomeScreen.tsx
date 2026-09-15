import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MotionSurface, Reveal } from '../components/MotionSurface';
import { ToolCard } from '../components/ToolCard';
import { clinicalRegistry } from '../domain/clinical/registry';
import { ClinicalTool } from '../domain/clinical/types';
import { useActivity } from '../state/ActivityContext';
import { colors, radius, shadow, spacing } from '../theme/tokens';

export function HomeScreen({ onOpenTool, onBrowse, onScores, onEcg, onPremium }: {
  onOpenTool: (tool: ClinicalTool) => void;
  onBrowse: () => void;
  onScores: () => void;
  onEcg: () => void;
  onPremium: () => void;
}) {
  const { activities } = useActivity();
  const favorites = activities
    .filter((item) => item.favorite)
    .map((item) => clinicalRegistry.find((tool) => tool.id === item.toolId))
    .filter((tool): tool is ClinicalTool => !!tool);
  const recent = activities
    .filter((item) => item.openedAt !== null)
    .slice(0, 3)
    .map((item) => clinicalRegistry.find((tool) => tool.id === item.toolId))
    .filter((tool): tool is ClinicalTool => !!tool);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topbar}>
        <View style={styles.brandBlock}>
          <Text style={styles.eyebrow}>MEDICAL TOOLBOX</Text>
          <Text style={styles.greeting}>Clinique. Rapide. Fiable.</Text>
        </View>
        <Pressable onPress={onPremium} style={({ pressed }) => [styles.profileChip, pressed && styles.pressed]} accessibilityLabel="Ouvrir Medical Toolbox Premium">
          <Text style={styles.profileText}>MD</Text>
        </Pressable>
      </View>

      <Reveal>
        <LinearGradient colors={[colors.tealDeep, '#08574F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.heroKicker}>VOTRE COMPAGNON CLINIQUE</Text>
          <Text style={styles.heroTitle}>Décider plus vite.{`\n`}Vérifier plus sûrement.</Text>
          <Text style={styles.heroText}>Scores validés, calculateurs et outils ECG réunis dans une interface pensée pour le terrain.</Text>
          <View style={styles.offlinePill}>
            <View style={styles.statusDot} />
            <Text style={styles.offlineText}>Calculs disponibles hors ligne</Text>
          </View>
        </LinearGradient>
      </Reveal>

      <Text style={styles.sectionLabel}>ACCÈS RAPIDES</Text>
      <Reveal delay={70} style={styles.modules}>
        <ModuleCard
          title="Scores"
          text={`${clinicalRegistry.filter((tool) => tool.available).length} outils cliniques actifs et sourcés`}
          badge="Calculer"
          icon="calculator-outline"
          iconColor={colors.teal}
          iconBg={colors.mint}
          onPress={onScores}
        />
        <ModuleCard
          title="Outils cliniques"
          text="Références rapides et aides pratiques classées par spécialité"
          badge="Explorer"
          icon="medical-outline"
          iconColor={colors.blue}
          iconBg={colors.blueSoft}
          onPress={onBrowse}
        />
        <ModuleCard
          title="ECG Toolkit"
          text="Fréquence, axe, QT/QTc, intervalles et lecture structurée"
          badge="Premium"
          icon="pulse-outline"
          iconColor={colors.violet}
          iconBg={colors.violetSoft}
          onPress={onEcg}
        />
      </Reveal>

      <Reveal delay={130}>
        <MotionSurface onPress={onPremium} accessibilityLabel="Découvrir Medical Toolbox Premium" style={styles.premiumStrip}>
          <View style={styles.premiumIcon}><Ionicons name="sparkles" size={18} color={colors.violet} /></View>
          <View style={styles.premiumCopy}>
            <Text style={styles.premiumTitle}>Medical Toolbox Premium</Text>
            <Text style={styles.premiumText}>Plus d’outils, fonctions ECG avancées, historique et personnalisation.</Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color={colors.violet} />
        </MotionSurface>
      </Reveal>

      {!!recent.length && (
        <Reveal delay={180}>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Récemment utilisés</Text><Pressable onPress={onBrowse}><Text style={styles.link}>Tout voir</Text></Pressable></View>
          <View style={styles.list}>{recent.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} compact />)}</View>
        </Reveal>
      )}

      {!!favorites.length && (
        <Reveal delay={220}>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Favoris</Text><Text style={styles.savedLabel}>{favorites.length} épinglé{favorites.length > 1 ? 's' : ''}</Text></View>
          <View style={styles.list}>{favorites.slice(0, 3).map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} compact />)}</View>
        </Reveal>
      )}

      {!recent.length && (
        <Reveal delay={180}>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Pour commencer</Text><Pressable onPress={onScores}><Text style={styles.link}>Scores</Text></Pressable></View>
          <View style={styles.list}>{clinicalRegistry.slice(0, 3).map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => onOpenTool(tool)} compact />)}</View>
        </Reveal>
      )}

      <View style={styles.disclaimer}>
        <Ionicons name="shield-checkmark-outline" size={19} color={colors.teal} />
        <Text style={styles.disclaimerText}>Aide pédagogique et à la décision. Les résultats doivent toujours être interprétés dans leur contexte clinique.</Text>
      </View>
    </ScrollView>
  );
}

function ModuleCard({ title, text, badge, icon, iconColor, iconBg, onPress }: {
  title: string;
  text: string;
  badge: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  onPress: () => void;
}) {
  return (
    <MotionSurface onPress={onPress} accessibilityLabel={`Ouvrir ${title}`} style={styles.moduleCard}>
      <View style={[styles.moduleIcon, { backgroundColor: iconBg }]}><Ionicons name={icon} size={23} color={iconColor} /></View>
      <View style={styles.moduleBody}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleText}>{text}</Text>
      </View>
      <View style={styles.moduleRight}>
        <View style={[styles.badge, badge === 'Premium' && styles.badgePremium]}><Text style={[styles.badgeText, badge === 'Premium' && styles.badgePremiumText]}>{badge}</Text></View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>
    </MotionSurface>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: 34 },
  pressed: { opacity: 0.76 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  brandBlock: { flex: 1 },
  eyebrow: { color: colors.teal, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  greeting: { marginTop: 3, color: colors.muted, fontSize: 13 },
  profileChip: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  profileText: { color: colors.tealDark, fontSize: 11, fontWeight: '900' },
  hero: { paddingHorizontal: 20, paddingVertical: 23, borderRadius: radius.xl, ...shadow },
  heroKicker: { color: colors.mintStrong, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  heroTitle: { marginTop: 12, color: colors.white, fontSize: 29, lineHeight: 32, fontWeight: '900', letterSpacing: -0.8 },
  heroText: { marginTop: 12, color: '#D4EBE5', fontSize: 13, lineHeight: 19 },
  offlinePill: { marginTop: 15, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.11)' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#B8F3E2' },
  offlineText: { color: '#D6F5EB', fontSize: 10, fontWeight: '800' },
  sectionLabel: { marginTop: 24, marginBottom: 11, color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  modules: { gap: 11 },
  moduleCard: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, minHeight: 94, backgroundColor: colors.surface, borderRadius: 22, borderWidth: 1, borderColor: colors.line, ...shadow },
  moduleIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  moduleBody: { flex: 1 },
  moduleTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  moduleText: { marginTop: 4, color: colors.muted, fontSize: 11, lineHeight: 16 },
  moduleRight: { minHeight: 54, alignItems: 'flex-end', justifyContent: 'space-between' },
  badge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.mint },
  badgeText: { color: colors.teal, fontSize: 9, fontWeight: '900' },
  badgePremium: { backgroundColor: colors.violetSoft },
  badgePremiumText: { color: colors.violet },
  premiumStrip: { marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 15, borderRadius: radius.md, borderWidth: 1, borderColor: '#E6E0FA', backgroundColor: '#FBFAFF' },
  premiumIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.violetSoft },
  premiumCopy: { flex: 1 },
  premiumTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  premiumText: { marginTop: 3, color: colors.muted, fontSize: 10, lineHeight: 15 },
  sectionHeader: { marginTop: 27, marginBottom: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  savedLabel: { color: colors.teal, fontSize: 10, fontWeight: '800' },
  link: { color: colors.teal, fontSize: 12, fontWeight: '900' },
  list: { gap: 9 },
  disclaimer: { marginTop: 24, flexDirection: 'row', gap: 9, padding: 14, borderRadius: radius.md, backgroundColor: colors.mint },
  disclaimerText: { flex: 1, color: colors.tealDark, fontSize: 11, lineHeight: 17, fontWeight: '600' },
});
