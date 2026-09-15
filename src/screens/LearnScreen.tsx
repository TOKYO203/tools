import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MotionSurface, Reveal } from '../components/MotionSurface';
import { colors, radius, shadow, spacing } from '../theme/tokens';

const steps = [
  { short: 'Qualité', title: 'Vérifier le tracé', text: 'Identité, qualité du signal, étalonnage et vitesse avant toute interprétation.' },
  { short: 'Rythme', title: 'Rythme', text: 'Régulier ou irrégulier ? Rechercher les ondes P et leur relation avec les QRS.' },
  { short: 'FC', title: 'Fréquence', text: 'Estimer la fréquence ventriculaire et la confronter au contexte clinique.' },
  { short: 'Axe', title: 'Axe électrique', text: 'Apprécier l’axe frontal global à partir des dérivations des membres.' },
  { short: 'PR/QRS', title: 'Intervalles', text: 'Mesurer PR, durée du QRS, QT et QTc lorsque cela est pertinent.' },
  { short: 'ST-T', title: 'Morphologie & repolarisation', text: 'Analyser QRS, progression de R, ondes Q, segment ST et ondes T.' },
];

type ActiveTool = 'rate' | 'qtc' | 'axis' | 'intervals' | null;
type RateMode = 'regular' | 'irregular';
type RateUnit = 'large' | 'small';
type Polarity = 'positive' | 'negative' | 'isoelectric';

const measurementTools: { id: Exclude<ActiveTool, null>; icon: keyof typeof Ionicons.glyphMap; title: string; text: string; color: string; bg: string }[] = [
  { id: 'rate', icon: 'speedometer-outline', title: 'Fréquence', text: 'Calculer la FC', color: colors.teal, bg: colors.mint },
  { id: 'qtc', icon: 'timer-outline', title: 'QT / QTc', text: 'Bazett · Fridericia', color: colors.violet, bg: colors.violetSoft },
  { id: 'axis', icon: 'navigate-outline', title: 'Axe électrique', text: 'Orientation QRS', color: colors.blue, bg: colors.blueSoft },
  { id: 'intervals', icon: 'resize-outline', title: 'Intervalles', text: 'PR · QRS · QT', color: colors.teal, bg: colors.mint },
];

function parseNumber(value: string) {
  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export function LearnScreen() {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [guidedDone, setGuidedDone] = useState<boolean[]>(steps.map(() => false));

  const [rateMode, setRateMode] = useState<RateMode>('regular');
  const [rateUnit, setRateUnit] = useState<RateUnit>('large');
  const [rateText, setRateText] = useState('');

  const [qtText, setQtText] = useState('');
  const [hrText, setHrText] = useState('');

  const [axisI, setAxisI] = useState<Polarity | null>(null);
  const [axisAvf, setAxisAvf] = useState<Polarity | null>(null);
  const [axisII, setAxisII] = useState<Polarity | null>(null);

  const [prText, setPrText] = useState('');
  const [qrsText, setQrsText] = useState('');
  const [intervalQtText, setIntervalQtText] = useState('');
  const [intervalHrText, setIntervalHrText] = useState('');

  const rate = useMemo(() => {
    const value = parseNumber(rateText);
    if (value === null || value <= 0) return null;
    if (rateMode === 'irregular') {
      if (value < 1 || value > 50) return null;
      return Math.round(value * 6);
    }
    if (rateUnit === 'large') {
      if (value < 0.5 || value > 30) return null;
      return Math.round(300 / value);
    }
    if (value < 2.5 || value > 150) return null;
    return Math.round(1500 / value);
  }, [rateMode, rateText, rateUnit]);

  const qtc = useMemo(() => calculateQtc(qtText, hrText), [hrText, qtText]);
  const intervalQtc = useMemo(() => calculateQtc(intervalQtText, intervalHrText), [intervalHrText, intervalQtText]);
  const axis = useMemo(() => classifyAxis(axisI, axisAvf, axisII), [axisI, axisAvf, axisII]);

  const intervals = useMemo(() => {
    const pr = parseNumber(prText);
    const qrs = parseNumber(qrsText);
    const qt = parseNumber(intervalQtText);
    const validPr = pr !== null && pr >= 60 && pr <= 500;
    const validQrs = qrs !== null && qrs >= 40 && qrs <= 400;
    const validQt = qt !== null && qt >= 150 && qt <= 700;
    return {
      pr: validPr ? {
        value: pr,
        label: pr < 120 ? 'PR court (< 120 ms)' : pr <= 200 ? 'PR dans le repère usuel 120–200 ms' : 'PR prolongé (> 200 ms)',
        tone: pr >= 120 && pr <= 200 ? colors.teal : colors.amber,
      } : null,
      qrs: validQrs ? {
        value: qrs,
        label: qrs < 120 ? 'Durée QRS < 120 ms' : 'QRS élargi (≥ 120 ms) — morphologie à analyser',
        tone: qrs < 120 ? colors.teal : colors.amber,
      } : null,
      qt: validQt ? qt : null,
    };
  }, [intervalQtText, prText, qrsText]);

  const guidedCount = guidedDone.filter(Boolean).length;
  const guidedComplete = guidedCount === steps.length;

  const openTool = (id: ActiveTool) => {
    setActiveTool((current) => current === id ? null : id);
  };

  const toggleGuidedStep = (index: number) => {
    setGuidedDone((current) => current.map((done, itemIndex) => itemIndex === index ? !done : done));
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={styles.kicker}>ECG TOOLKIT</Text>
      <Text style={styles.title}>Lire. Mesurer. Vérifier.</Text>
      <Text style={styles.subtitle}>Des assistants de mesure et une lecture structurée en 6 étapes, sans diagnostic automatique.</Text>

      <Reveal>
        <LinearGradient colors={[colors.violetDeep, '#403075']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Lecture guidée ECG</Text>
              <Text style={styles.heroMeta}>6 étapes · progression visible</Text>
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
              <View key={step.short} style={[styles.heroStep, guidedDone[index] && styles.heroStepActive]}>
                <Text style={[styles.heroStepText, guidedDone[index] && styles.heroStepTextActive]}>{guidedDone[index] ? '✓' : index + 1}</Text>
              </View>
            ))}
          </View>

          <Pressable onPress={() => setGuidedOpen((current) => !current)} style={styles.heroCta}>
            <Text style={styles.heroCtaText}>{guidedOpen ? 'Masquer la lecture guidée' : guidedCount ? `Reprendre · ${guidedCount}/6` : 'Démarrer la lecture guidée'}</Text>
            <Ionicons name={guidedOpen ? 'chevron-up' : 'arrow-forward'} size={17} color={colors.violetDeep} />
          </Pressable>
        </LinearGradient>
      </Reveal>

      {guidedOpen && (
        <Reveal style={styles.guidedPanel}>
          <View style={styles.guidedTop}>
            <View>
              <Text style={styles.panelEyebrow}>LECTURE GUIDÉE</Text>
              <Text style={styles.guidedTitle}>Progression {guidedCount} / 6</Text>
            </View>
            <Pressable onPress={() => setGuidedDone(steps.map(() => false))} style={styles.resetButton}><Text style={styles.resetText}>Réinitialiser</Text></Pressable>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${(guidedCount / steps.length) * 100}%` }]} /></View>
          <Text style={styles.panelIntro}>Marquez une étape uniquement après l’avoir réellement vérifiée sur le tracé. La validation signifie « contrôlé », pas « normal ».</Text>

          <View style={styles.guidedList}>
            {steps.map((step, index) => (
              <Pressable key={step.title} onPress={() => toggleGuidedStep(index)} style={[styles.guidedRow, guidedDone[index] && styles.guidedRowDone]}>
                <View style={[styles.guidedNumber, guidedDone[index] && styles.guidedNumberDone]}><Text style={[styles.guidedNumberText, guidedDone[index] && styles.guidedNumberTextDone]}>{guidedDone[index] ? '✓' : index + 1}</Text></View>
                <View style={styles.guidedCopy}><Text style={styles.guidedRowTitle}>{step.title}</Text><Text style={styles.guidedRowText}>{step.text}</Text></View>
                <Ionicons name={guidedDone[index] ? 'checkmark-circle' : 'ellipse-outline'} size={21} color={guidedDone[index] ? colors.teal : colors.muted} />
              </Pressable>
            ))}
          </View>

          {guidedComplete ? (
            <View style={styles.summaryBox}>
              <View style={styles.summaryHead}><Ionicons name="checkmark-done-circle" size={22} color={colors.teal} /><Text style={styles.summaryTitle}>Lecture structurée complète</Text></View>
              <Text style={styles.summaryText}>Les 6 étapes ont été contrôlées. Vous pouvez maintenant rédiger votre synthèse ECG en intégrant les anomalies observées, le contexte clinique et les tracés antérieurs.</Text>
              <Text style={styles.summaryWarning}>Aucun diagnostic n’est généré automatiquement.</Text>
            </View>
          ) : (
            <Pending color={colors.violet} bg={colors.violetSoft} text={`Encore ${steps.length - guidedCount} étape${steps.length - guidedCount > 1 ? 's' : ''} à vérifier avant la synthèse structurée.`} />
          )}
        </Reveal>
      )}

      <Text style={styles.sectionLabel}>OUTILS DE MESURE</Text>
      <Reveal delay={70} style={styles.measureGrid}>
        {measurementTools.map((tool) => (
          <MotionSurface key={tool.id} onPress={() => openTool(tool.id)} accessibilityLabel={`Ouvrir ${tool.title}`} style={[styles.measureCard, activeTool === tool.id && styles.measureCardActive]}>
            <View style={[styles.measureIcon, { backgroundColor: tool.bg }]}><Ionicons name={tool.icon} size={20} color={tool.color} /></View>
            <Text style={styles.measureTitle}>{tool.title}</Text>
            <Text style={styles.measureText}>{tool.text}</Text>
            <View style={styles.liveBadge}><Text style={styles.liveText}>ACTIF</Text></View>
          </MotionSurface>
        ))}
      </Reveal>

      {activeTool === 'rate' && (
        <Reveal style={styles.toolPanel}>
          <PanelHeader icon="speedometer-outline" eyebrow="CALCUL ECG" title="Fréquence cardiaque" color={colors.teal} bg={colors.mint} />
          <Text style={styles.panelIntro}>À 25 mm/s, choisissez une méthode adaptée au rythme. Pour un rythme irrégulier, la méthode sur 10 secondes donne une estimation moyenne.</Text>
          <Segmented options={[{ id: 'regular', label: 'Rythme régulier' }, { id: 'irregular', label: 'Rythme irrégulier' }]} value={rateMode} onChange={(value) => { setRateMode(value as RateMode); setRateText(''); }} activeColor={colors.tealDark} />
          {rateMode === 'regular' && <Segmented options={[{ id: 'large', label: 'Grands carreaux' }, { id: 'small', label: 'Petits carreaux' }]} value={rateUnit} onChange={(value) => { setRateUnit(value as RateUnit); setRateText(''); }} activeColor={colors.teal} />}
          <Text style={styles.inputLabel}>{rateMode === 'irregular' ? 'Nombre de QRS sur 10 secondes' : `Nombre de ${rateUnit === 'large' ? 'grands' : 'petits'} carreaux entre deux ondes R`}</Text>
          <View style={styles.singleInputWrap}><TextInput value={rateText} onChangeText={setRateText} keyboardType="decimal-pad" placeholder={rateMode === 'irregular' ? 'Ex. 12' : rateUnit === 'large' ? 'Ex. 4' : 'Ex. 20'} placeholderTextColor={colors.muted} style={styles.input} /><Text style={[styles.unit, { color: colors.teal }]}>{rateMode === 'irregular' ? 'QRS' : 'carreaux'}</Text></View>
          {rate !== null ? <View style={[styles.resultPanel, { backgroundColor: colors.tealDark }]}><View style={styles.resultColumn}><Text style={styles.resultLabel}>FRÉQUENCE ESTIMÉE</Text><Text style={styles.resultValue}>{rate}<Text style={styles.resultUnit}> bpm</Text></Text></View><Text style={styles.rrText}>{rateMode === 'irregular' ? 'Méthode : QRS sur 10 s × 6' : `Méthode : ${rateUnit === 'large' ? '300 ÷ grands carreaux' : '1500 ÷ petits carreaux'}`}</Text></View> : <Pending color={colors.teal} bg={colors.mint} text={rateMode === 'irregular' ? 'Comptez les QRS sur une bande de 10 secondes.' : 'Renseignez l’intervalle R–R en carreaux sur un tracé à 25 mm/s.'} />}
          <View style={styles.cautionBox}><Ionicons name="warning-outline" size={18} color={colors.amber} /><Text style={styles.cautionText}>Vérifiez toujours la vitesse du papier. Les formules 300/1500 supposent 25 mm/s. En cas de rythme très irrégulier, une seule distance R–R n’est pas représentative.</Text></View>
          <Pressable onPress={() => Linking.openURL('https://litfl.com/ecg-rate-interpretation/')} style={styles.sourceRow}><Ionicons name="library-outline" size={18} color={colors.teal} /><View style={styles.sourceCopy}><Text style={styles.sourceTitle}>Référence de méthode</Text><Text style={styles.sourceText}>Calcul de fréquence ECG à 25 mm/s : grands carreaux, petits carreaux et bande de 10 secondes.</Text></View><Ionicons name="open-outline" size={16} color={colors.muted} /></Pressable>
        </Reveal>
      )}

      {activeTool === 'qtc' && (
        <Reveal style={styles.toolPanel}>
          <PanelHeader icon="timer-outline" eyebrow="CALCUL ECG" title="QT corrigé" color={colors.violet} bg={colors.violetSoft} />
          <Text style={styles.panelIntro}>Saisissez le QT mesuré et la fréquence cardiaque. L’outil calcule simultanément QTc Bazett et QTc Fridericia.</Text>
          <View style={styles.inputRow}><InputBlock label="QT mesuré" value={qtText} onChangeText={setQtText} placeholder="Ex. 410" unit="ms" /><InputBlock label="Fréquence" value={hrText} onChangeText={setHrText} placeholder="Ex. 78" unit="bpm" /></View>
          {qtc ? <View style={styles.resultPanel}><View style={styles.resultColumn}><Text style={styles.resultLabel}>BAZETT</Text><Text style={styles.resultValue}>{qtc.bazett}<Text style={styles.resultUnit}> ms</Text></Text></View><View style={styles.resultDivider} /><View style={styles.resultColumn}><Text style={styles.resultLabel}>FRIDERICIA</Text><Text style={styles.resultValue}>{qtc.fridericia}<Text style={styles.resultUnit}> ms</Text></Text></View><Text style={styles.rrText}>RR calculé : {qtc.rrSeconds.toFixed(2)} s</Text></View> : <Pending color={colors.violet} bg={colors.violetSoft} text="Renseignez un QT entre 150–700 ms et une fréquence entre 20–250 bpm." />}
          <View style={styles.formulaBox}><Text style={styles.formulaTitle}>Formules affichées</Text><Text style={styles.formulaText}>Bazett : QTc = QT / √RR{`\n`}Fridericia : QTc = QT / ∛RR</Text></View>
          <View style={styles.cautionBox}><Ionicons name="warning-outline" size={18} color={colors.amber} /><Text style={styles.cautionText}>La correction dépend de la fréquence et du contexte. Les formules simples peuvent être moins fiables à fréquence extrême, en cas de forte variabilité RR ou si la fin de l’onde T est mal définie.</Text></View>
          <Pressable onPress={() => Linking.openURL('https://pubmed.ncbi.nlm.nih.gov/19228821/')} style={styles.sourceRow}><Ionicons name="library-outline" size={18} color={colors.violet} /><View style={styles.sourceCopy}><Text style={styles.sourceTitle}>Source ECG</Text><Text style={styles.sourceText}>AHA/ACCF/HRS — recommandations sur le QT et la correction selon la fréquence.</Text></View><Ionicons name="open-outline" size={16} color={colors.muted} /></Pressable>
        </Reveal>
      )}

      {activeTool === 'axis' && (
        <Reveal style={styles.toolPanel}>
          <PanelHeader icon="navigate-outline" eyebrow="ASSISTANT ECG" title="Axe QRS frontal" color={colors.blue} bg={colors.blueSoft} />
          <Text style={styles.panelIntro}>Indiquez la polarité dominante du QRS en I et aVF. Si I est positif et aVF négatif, la dérivation II affine la distinction entre axe adulte normal gauche et déviation axiale gauche.</Text>
          <PolaritySelector title="Dérivation I" value={axisI} onChange={setAxisI} />
          <PolaritySelector title="Dérivation aVF" value={axisAvf} onChange={setAxisAvf} />
          {axisI === 'positive' && axisAvf === 'negative' && <PolaritySelector title="Dérivation II" value={axisII} onChange={setAxisII} />}
          {axis ? <View style={[styles.axisResult, { backgroundColor: axis.color }]}><Text style={styles.axisResultLabel}>ESTIMATION</Text><Text style={styles.axisResultTitle}>{axis.title}</Text><Text style={styles.axisResultText}>{axis.detail}</Text></View> : <Pending color={colors.blue} bg={colors.blueSoft} text="Sélectionnez explicitement la polarité du QRS dans les dérivations requises." />}
          <View style={styles.cautionBox}><Ionicons name="warning-outline" size={18} color={colors.amber} /><Text style={styles.cautionText}>Assistant adulte de repérage rapide, pas une mesure au degré près. Un QRS isoélectrique nécessite une analyse hexaxiale/perpendiculaire plus précise.</Text></View>
          <Pressable onPress={() => Linking.openURL('https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191095')} style={styles.sourceRow}><Ionicons name="library-outline" size={18} color={colors.blue} /><View style={styles.sourceCopy}><Text style={styles.sourceTitle}>Source vérifiée</Text><Text style={styles.sourceText}>AHA/ACCF/HRS — axe QRS frontal adulte et définitions des déviations.</Text></View><Ionicons name="open-outline" size={16} color={colors.muted} /></Pressable>
        </Reveal>
      )}

      {activeTool === 'intervals' && (
        <Reveal style={styles.toolPanel}>
          <PanelHeader icon="resize-outline" eyebrow="MESURE ECG" title="Intervalles PR, QRS et QT" color={colors.teal} bg={colors.mint} />
          <Text style={styles.panelIntro}>Saisissez les durées mesurées sur le tracé. Les repères ci-dessous concernent l’adulte et servent à structurer la lecture, pas à interpréter la morphologie à votre place.</Text>

          <View style={styles.inputRow}><InputBlock label="PR" value={prText} onChangeText={setPrText} placeholder="Ex. 160" unit="ms" /><InputBlock label="QRS" value={qrsText} onChangeText={setQrsText} placeholder="Ex. 96" unit="ms" /></View>
          <View style={styles.inputRow}><InputBlock label="QT mesuré" value={intervalQtText} onChangeText={setIntervalQtText} placeholder="Ex. 410" unit="ms" /><InputBlock label="Fréquence" value={intervalHrText} onChangeText={setIntervalHrText} placeholder="Ex. 72" unit="bpm" /></View>

          <View style={styles.intervalResults}>
            <IntervalResult label="PR" value={intervals.pr ? `${intervals.pr.value} ms` : '—'} detail={intervals.pr?.label ?? 'Saisir 60–500 ms'} color={intervals.pr?.tone ?? colors.muted} />
            <IntervalResult label="QRS" value={intervals.qrs ? `${intervals.qrs.value} ms` : '—'} detail={intervals.qrs?.label ?? 'Saisir 40–400 ms'} color={intervals.qrs?.tone ?? colors.muted} />
            <IntervalResult label="QT" value={intervals.qt ? `${intervals.qt} ms` : '—'} detail={intervalQtc ? `QTc Bazett ${intervalQtc.bazett} ms · Fridericia ${intervalQtc.fridericia} ms` : intervals.qt ? 'Ajoutez la fréquence pour calculer QTc' : 'Saisir 150–700 ms'} color={intervalQtc ? colors.violet : colors.muted} />
          </View>

          <View style={styles.formulaBox}><Text style={styles.formulaTitle}>Repères affichés</Text><Text style={styles.formulaText}>PR : 120–200 ms comme plage usuelle adulte.{`\n`}QRS : seuil de 120 ms utilisé pour identifier un complexe élargi.{`\n`}QT : la durée brute dépend de la fréquence ; privilégier une correction QTc contextualisée.</Text></View>
          <View style={styles.cautionBox}><Ionicons name="warning-outline" size={18} color={colors.amber} /><Text style={styles.cautionText}>Une durée seule ne suffit pas : analysez toujours morphologie du QRS, rythme, médicaments, électrolytes, âge, sexe et contexte clinique. Les valeurs pédiatriques nécessitent des repères spécifiques.</Text></View>
          <Pressable onPress={() => Linking.openURL('https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191095')} style={styles.sourceRow}><Ionicons name="library-outline" size={18} color={colors.teal} /><View style={styles.sourceCopy}><Text style={styles.sourceTitle}>Références ECG</Text><Text style={styles.sourceText}>AHA/ACCF/HRS — standardisation de l’ECG, conduction intraventriculaire et mesure des intervalles.</Text></View><Ionicons name="open-outline" size={16} color={colors.muted} /></Pressable>
        </Reveal>
      )}

      <View style={styles.methodCard}>
        <View style={styles.methodHeader}><View style={styles.methodCopy}><Text style={styles.methodTitle}>Lecture structurée</Text><Text style={styles.methodSubtitle}>6 étapes, toujours dans le même ordre</Text></View><Pressable onPress={() => setGuidedOpen(true)} style={styles.guideBadge}><Text style={styles.guideText}>{guidedCount ? `${guidedCount}/6` : 'Ouvrir'}</Text></Pressable></View>
        <View style={styles.methodChips}>{steps.map((step, index) => <View key={step.short} style={[styles.methodChip, guidedDone[index] && styles.methodChipDone]}><Text style={[styles.methodChipText, guidedDone[index] && styles.methodChipTextDone]}>{step.short}</Text></View>)}</View>
      </View>

      <Text style={styles.sectionLabel}>MÉTHODE DÉTAILLÉE</Text>
      <View style={styles.stepsList}>{steps.map((step, index) => <View key={step.title} style={styles.stepCard}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View><View style={styles.stepBody}><Text style={styles.stepTitle}>{step.title}</Text><Text style={styles.stepText}>{step.text}</Text></View></View>)}</View>

      <View style={styles.explainable}><Ionicons name="sparkles" size={17} color={colors.violet} /><Text style={styles.explainableText}>Chaque fonction ECG reste explicable : formule, repère ou méthode visible, et aucune conclusion automatique cachée.</Text></View>
      <View style={styles.disclaimer}><Ionicons name="shield-checkmark-outline" size={18} color={colors.teal} /><Text style={styles.disclaimerText}>Référence pédagogique. Ne remplace pas l’interprétation médicale, la comparaison aux tracés antérieurs ni les recommandations locales.</Text></View>
    </ScrollView>
  );
}

function calculateQtc(qtValue: string, heartRateValue: string) {
  const qt = parseNumber(qtValue);
  const heartRate = parseNumber(heartRateValue);
  if (qt === null || heartRate === null || qt < 150 || qt > 700 || heartRate < 20 || heartRate > 250) return null;
  const rrSeconds = 60 / heartRate;
  return { rrSeconds, bazett: Math.round(qt / Math.sqrt(rrSeconds)), fridericia: Math.round(qt / Math.cbrt(rrSeconds)) };
}

function PanelHeader({ icon, eyebrow, title, color, bg }: { icon: keyof typeof Ionicons.glyphMap; eyebrow: string; title: string; color: string; bg: string }) {
  return <View style={styles.panelHeader}><View style={[styles.panelIcon, { backgroundColor: bg }]}><Ionicons name={icon} size={20} color={color} /></View><View style={styles.panelHeaderCopy}><Text style={[styles.panelEyebrow, { color }]}>{eyebrow}</Text><Text style={styles.panelTitle}>{title}</Text></View><View style={[styles.liveBadge, { backgroundColor: bg }]}><Text style={[styles.liveText, { color }]}>ACTIF</Text></View></View>;
}

function Pending({ color, bg, text }: { color: string; bg: string; text: string }) {
  return <View style={[styles.pendingPanel, { backgroundColor: bg }]}><Ionicons name="information-circle-outline" size={18} color={color} /><Text style={styles.pendingText}>{text}</Text></View>;
}

function InputBlock({ label, value, onChangeText, placeholder, unit }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; unit: string }) {
  return <View style={styles.inputBlock}><Text style={styles.inputLabel}>{label}</Text><View style={styles.inputWrap}><TextInput value={value} onChangeText={onChangeText} keyboardType="decimal-pad" placeholder={placeholder} placeholderTextColor={colors.muted} style={styles.input} /><Text style={styles.unit}>{unit}</Text></View></View>;
}

function IntervalResult({ label, value, detail, color }: { label: string; value: string; detail: string; color: string }) {
  return <View style={styles.intervalResult}><View style={styles.intervalResultTop}><Text style={styles.intervalLabel}>{label}</Text><Text style={[styles.intervalValue, { color }]}>{value}</Text></View><Text style={styles.intervalDetail}>{detail}</Text></View>;
}

function Segmented({ options, value, onChange, activeColor }: { options: { id: string; label: string }[]; value: string; onChange: (value: string) => void; activeColor: string }) {
  return <View style={styles.segmented}>{options.map((option) => { const active = option.id === value; return <Pressable key={option.id} onPress={() => onChange(option.id)} style={[styles.segment, active && { backgroundColor: activeColor }]}><Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option.label}</Text></Pressable>; })}</View>;
}

function PolaritySelector({ title, value, onChange }: { title: string; value: Polarity | null; onChange: (value: Polarity) => void }) {
  const options: { value: Polarity; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'positive', label: 'Positif', icon: 'add-outline' },
    { value: 'negative', label: 'Négatif', icon: 'remove-outline' },
    { value: 'isoelectric', label: 'Isoélectrique', icon: 'swap-horizontal-outline' },
  ];
  return <View style={styles.polarityBlock}><Text style={styles.inputLabel}>{title}</Text><View style={styles.polarityRow}>{options.map((option) => { const active = value === option.value; return <Pressable key={option.value} onPress={() => onChange(option.value)} style={[styles.polarityOption, active && styles.polarityOptionActive]}><Ionicons name={option.icon} size={17} color={active ? colors.white : colors.blue} /><Text style={[styles.polarityText, active && styles.polarityTextActive]}>{option.label}</Text></Pressable>; })}</View></View>;
}

function classifyAxis(leadI: Polarity | null, avf: Polarity | null, leadII: Polarity | null): { title: string; detail: string; color: string } | null {
  if (!leadI || !avf) return null;
  if (leadI === 'isoelectric' || avf === 'isoelectric') return { title: 'Axe à préciser', detail: 'Une dérivation principale est isoélectrique. La méthode des quadrants ne suffit pas : rechercher la dérivation la plus isoélectrique et son axe perpendiculaire.', color: colors.violetDeep };
  if (leadI === 'positive' && avf === 'positive') return { title: 'Axe normal', detail: 'Quadrant estimé entre 0° et +90°.', color: colors.tealDark };
  if (leadI === 'negative' && avf === 'positive') return { title: 'Déviation axiale droite', detail: 'Quadrant estimé entre +90° et +180°.', color: '#31589D' };
  if (leadI === 'negative' && avf === 'negative') return { title: 'Axe extrême', detail: 'Quadrant supérieur droit / axe dit extrême. Vérifier le tracé, le placement des électrodes et le contexte.', color: '#543C72' };
  if (!leadII) return null;
  if (leadII === 'isoelectric') return { title: 'Axe proche de −30°', detail: 'Lead I positif, aVF négatif et II isoélectrique : axe voisin de la limite adulte à −30°.', color: colors.blue };
  if (leadII === 'positive') return { title: 'Axe adulte dans la plage normale', detail: 'Axe gauche entre environ −30° et 0° ; la plage adulte AHA reste normale jusqu’à −30°.', color: colors.tealDark };
  return { title: 'Déviation axiale gauche', detail: 'Lead I positif, aVF négatif et II négatif : axe inférieur à −30°, compatible avec une déviation axiale gauche.', color: '#7B5531' };
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
  heroStep: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' },
  heroStepActive: { backgroundColor: 'rgba(125,229,209,0.18)' },
  heroStepText: { color: '#B0ABD1', fontSize: 10, fontWeight: '900' },
  heroStepTextActive: { color: '#8FF2E0' },
  heroCta: { marginTop: 15, minHeight: 44, paddingHorizontal: 14, borderRadius: 13, backgroundColor: '#F5F0FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  heroCtaText: { color: colors.violetDeep, fontSize: 11, fontWeight: '900' },
  guidedPanel: { marginTop: 16, padding: 17, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#DED8F6', ...shadow },
  guidedTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  guidedTitle: { marginTop: 3, color: colors.ink, fontSize: 20, fontWeight: '900' },
  resetButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.canvas },
  resetText: { color: colors.muted, fontSize: 9, fontWeight: '800' },
  progressTrack: { marginTop: 14, height: 7, borderRadius: 4, backgroundColor: colors.violetSoft, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: colors.violet },
  guidedList: { marginTop: 14, gap: 8 },
  guidedRow: { minHeight: 70, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.canvas },
  guidedRowDone: { borderColor: '#BFE9DE', backgroundColor: '#F3FBF8' },
  guidedNumber: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.violetSoft },
  guidedNumberDone: { backgroundColor: colors.teal },
  guidedNumberText: { color: colors.violet, fontSize: 11, fontWeight: '900' },
  guidedNumberTextDone: { color: colors.white },
  guidedCopy: { flex: 1 },
  guidedRowTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  guidedRowText: { marginTop: 3, color: colors.muted, fontSize: 9, lineHeight: 14 },
  summaryBox: { marginTop: 15, padding: 14, borderRadius: 16, backgroundColor: colors.mint },
  summaryHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryTitle: { color: colors.tealDark, fontSize: 13, fontWeight: '900' },
  summaryText: { marginTop: 8, color: colors.tealDark, fontSize: 10, lineHeight: 16 },
  summaryWarning: { marginTop: 7, color: colors.tealDark, fontSize: 9, fontWeight: '900' },
  sectionLabel: { marginTop: 24, marginBottom: 11, color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  measureCard: { width: '48.5%', minHeight: 142, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  measureCardActive: { borderColor: '#B8AFE8', backgroundColor: '#FCFBFF' },
  measureIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  measureTitle: { marginTop: 11, color: colors.ink, fontSize: 13, fontWeight: '900' },
  measureText: { marginTop: 5, color: colors.muted, fontSize: 9 },
  liveBadge: { marginTop: 11, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.violetSoft },
  liveText: { color: colors.violet, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  toolPanel: { marginTop: 17, padding: 17, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#DED8F6', ...shadow },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  panelIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  panelHeaderCopy: { flex: 1 },
  panelEyebrow: { fontSize: 8, fontWeight: '900', letterSpacing: 0.9 },
  panelTitle: { marginTop: 3, color: colors.ink, fontSize: 20, fontWeight: '900' },
  panelIntro: { marginTop: 11, color: colors.muted, fontSize: 11, lineHeight: 17 },
  segmented: { marginTop: 14, padding: 4, flexDirection: 'row', gap: 4, borderRadius: 14, backgroundColor: colors.canvas },
  segment: { flex: 1, paddingHorizontal: 8, paddingVertical: 9, borderRadius: 11, alignItems: 'center' },
  segmentText: { color: colors.muted, fontSize: 9, fontWeight: '800' },
  segmentTextActive: { color: colors.white },
  inputRow: { marginTop: 15, flexDirection: 'row', gap: 10 },
  inputBlock: { flex: 1 },
  inputLabel: { marginTop: 14, marginBottom: 7, color: colors.ink, fontSize: 10, fontWeight: '800' },
  inputWrap: { minHeight: 50, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.canvas },
  singleInputWrap: { minHeight: 52, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.canvas },
  input: { flex: 1, color: colors.ink, fontSize: 17, fontWeight: '900', paddingVertical: 10 },
  unit: { color: colors.violet, fontSize: 10, fontWeight: '900' },
  resultPanel: { marginTop: 15, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: 15, borderRadius: 18, backgroundColor: colors.violetDeep },
  resultColumn: { flex: 1 },
  resultDivider: { width: 1, height: 42, marginHorizontal: 11, backgroundColor: 'rgba(255,255,255,0.18)' },
  resultLabel: { color: '#C9E5DF', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  resultValue: { marginTop: 4, color: colors.white, fontSize: 25, fontWeight: '900' },
  resultUnit: { color: '#C9C2EE', fontSize: 11 },
  rrText: { width: '100%', marginTop: 11, color: '#C9C2EE', fontSize: 9 },
  pendingPanel: { marginTop: 15, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, backgroundColor: colors.violetSoft },
  pendingText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 15 },
  formulaBox: { marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: colors.canvas },
  formulaTitle: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  formulaText: { marginTop: 5, color: colors.muted, fontSize: 10, lineHeight: 17 },
  cautionBox: { marginTop: 12, flexDirection: 'row', gap: 8, padding: 12, borderRadius: 14, backgroundColor: colors.amberSoft },
  cautionText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 15 },
  sourceRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.line },
  sourceCopy: { flex: 1 },
  sourceTitle: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  sourceText: { marginTop: 2, color: colors.muted, fontSize: 9, lineHeight: 13 },
  polarityBlock: { marginTop: 4 },
  polarityRow: { flexDirection: 'row', gap: 7 },
  polarityOption: { flex: 1, minHeight: 45, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.canvas },
  polarityOptionActive: { borderColor: colors.blue, backgroundColor: colors.blue },
  polarityText: { color: colors.blue, fontSize: 9, fontWeight: '800' },
  polarityTextActive: { color: colors.white },
  axisResult: { marginTop: 15, padding: 15, borderRadius: 18 },
  axisResultLabel: { color: 'rgba(255,255,255,0.72)', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  axisResultTitle: { marginTop: 5, color: colors.white, fontSize: 19, fontWeight: '900' },
  axisResultText: { marginTop: 6, color: 'rgba(255,255,255,0.84)', fontSize: 10, lineHeight: 15 },
  intervalResults: { marginTop: 15, gap: 8 },
  intervalResult: { padding: 13, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.canvas },
  intervalResultTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  intervalLabel: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  intervalValue: { fontSize: 14, fontWeight: '900' },
  intervalDetail: { marginTop: 5, color: colors.muted, fontSize: 9, lineHeight: 14 },
  methodCard: { marginTop: 17, padding: 16, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  methodHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  methodCopy: { flex: 1 },
  methodTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  methodSubtitle: { marginTop: 3, color: colors.muted, fontSize: 10 },
  guideBadge: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.violetSoft },
  guideText: { color: colors.violet, fontSize: 9, fontWeight: '900' },
  methodChips: { marginTop: 13, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  methodChip: { paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, backgroundColor: colors.canvas },
  methodChipDone: { backgroundColor: colors.mint },
  methodChipText: { color: colors.muted, fontSize: 8, fontWeight: '800' },
  methodChipTextDone: { color: colors.tealDark },
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
