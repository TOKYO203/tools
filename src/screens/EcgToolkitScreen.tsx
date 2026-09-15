import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MotionSurface, Reveal } from '../components/MotionSurface';
import {
  calculateHeartRate,
  calculateQtc,
  classifyAxis,
  classifyPr,
  classifyQrs,
  getCalibration,
  summarizeRhythm,
  type Polarity,
  type PWavePattern,
  type RateMode,
  type RateUnit,
  type RhythmAnswer,
} from '../domain/ecg/calculations';
import { colors, radius, shadow, spacing } from '../theme/tokens';

const steps = [
  ['Qualité', 'Vérifier identité, artefacts, vitesse et calibration.'],
  ['Rythme', 'Décrire régularité, ondes P et relation P–QRS.'],
  ['Fréquence', 'Mesurer la fréquence ventriculaire.'],
  ['Axe', 'Estimer l’axe frontal du QRS.'],
  ['Intervalles', 'Mesurer PR, QRS, QT et QTc.'],
  ['ST-T', 'Analyser morphologie, progression R, ST et T.'],
] as const;

type ToolId = 'calibration' | 'rhythm' | 'rate' | 'qtc' | 'axis' | 'intervals';

const tools: { id: ToolId; title: string; text: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }[] = [
  { id: 'calibration', title: 'Calibration', text: '25/50 mm/s · gain', icon: 'options-outline', color: colors.teal, bg: colors.mint },
  { id: 'rhythm', title: 'Rythme', text: 'Assistant descriptif', icon: 'pulse-outline', color: colors.violet, bg: colors.violetSoft },
  { id: 'rate', title: 'Fréquence', text: 'FC instantanée', icon: 'speedometer-outline', color: colors.teal, bg: colors.mint },
  { id: 'qtc', title: 'QT / QTc', text: 'Bazett · Fridericia', icon: 'timer-outline', color: colors.violet, bg: colors.violetSoft },
  { id: 'axis', title: 'Axe', text: 'Orientation QRS', icon: 'navigate-outline', color: colors.blue, bg: colors.blueSoft },
  { id: 'intervals', title: 'Intervalles', text: 'PR · QRS · QT', icon: 'resize-outline', color: colors.teal, bg: colors.mint },
];

function num(value: string) {
  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export function EcgToolkitScreen() {
  const [active, setActive] = useState<ToolId | null>(null);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [done, setDone] = useState(steps.map(() => false));

  const [speed, setSpeed] = useState<25 | 50>(25);
  const [gain, setGain] = useState<5 | 10 | 20>(10);

  const [regular, setRegular] = useState<RhythmAnswer>('unknown');
  const [pBefore, setPBefore] = useState<RhythmAnswer>('unknown');
  const [qrsAfter, setQrsAfter] = useState<RhythmAnswer>('unknown');
  const [prConstant, setPrConstant] = useState<RhythmAnswer>('unknown');
  const [pPattern, setPPattern] = useState<PWavePattern>('unknown');

  const [rateMode, setRateMode] = useState<RateMode>('regular');
  const [rateUnit, setRateUnit] = useState<RateUnit>('large');
  const [rateValue, setRateValue] = useState('');

  const [qt, setQt] = useState('');
  const [hr, setHr] = useState('');

  const [leadI, setLeadI] = useState<Polarity | null>(null);
  const [avf, setAvf] = useState<Polarity | null>(null);
  const [leadII, setLeadII] = useState<Polarity | null>(null);

  const [pr, setPr] = useState('');
  const [qrs, setQrs] = useState('');
  const [intervalQt, setIntervalQt] = useState('');
  const [intervalHr, setIntervalHr] = useState('');

  const calibration = getCalibration(speed, gain);
  const rhythm = summarizeRhythm({ regular, pBeforeEachQrs: pBefore, qrsAfterEachP: qrsAfter, prConstant, pPattern });
  const rate = useMemo(() => {
    const value = num(rateValue);
    return value === null ? null : calculateHeartRate(rateMode, value, rateUnit);
  }, [rateMode, rateUnit, rateValue]);
  const qtc = useMemo(() => {
    const q = num(qt); const h = num(hr);
    return q === null || h === null ? null : calculateQtc(q, h);
  }, [qt, hr]);
  const axis = useMemo(() => classifyAxis(leadI, avf, leadII), [leadI, avf, leadII]);
  const prLabel = useMemo(() => { const v = num(pr); return v === null ? null : classifyPr(v); }, [pr]);
  const qrsLabel = useMemo(() => { const v = num(qrs); return v === null ? null : classifyQrs(v); }, [qrs]);
  const intervalQtc = useMemo(() => {
    const q = num(intervalQt); const h = num(intervalHr);
    return q === null || h === null ? null : calculateQtc(q, h);
  }, [intervalQt, intervalHr]);
  const complete = done.filter(Boolean).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Text style={styles.kicker}>ECG TOOLKIT</Text>
      <Text style={styles.title}>Lire. Mesurer. Vérifier.</Text>
      <Text style={styles.subtitle}>Six assistants ECG explicables, avec une lecture guidée qui structure le raisonnement sans générer de diagnostic automatique.</Text>

      <Reveal>
        <LinearGradient colors={[colors.violetDeep, '#403075']} style={styles.hero}>
          <View style={styles.heroTop}><View style={styles.heroCopy}><Text style={styles.heroTitle}>Lecture guidée ECG</Text><Text style={styles.heroMeta}>{complete}/6 étapes vérifiées</Text></View><View style={styles.premium}><Text style={styles.premiumText}>PREMIUM</Text></View></View>
          <View style={styles.wave}><View style={styles.waveLine} /><Ionicons name="pulse" size={70} color="#72E2CF" /><View style={styles.waveLine} /></View>
          <View style={styles.dots}>{steps.map((_, i) => <View key={i} style={[styles.dot, done[i] && styles.dotDone]}><Text style={[styles.dotText, done[i] && styles.dotTextDone]}>{done[i] ? '✓' : i + 1}</Text></View>)}</View>
          <Pressable onPress={() => setGuidedOpen(v => !v)} style={styles.heroButton}><Text style={styles.heroButtonText}>{guidedOpen ? 'Masquer le guide' : complete ? `Reprendre · ${complete}/6` : 'Démarrer la lecture guidée'}</Text><Ionicons name={guidedOpen ? 'chevron-up' : 'arrow-forward'} size={17} color={colors.violetDeep} /></Pressable>
        </LinearGradient>
      </Reveal>

      {guidedOpen && <Reveal style={styles.panel}>
        <View style={styles.panelTop}><View><Text style={styles.panelEyebrow}>LECTURE GUIDÉE</Text><Text style={styles.panelTitle}>Toujours dans le même ordre</Text></View><Pressable onPress={() => setDone(steps.map(() => false))}><Text style={styles.reset}>Réinitialiser</Text></Pressable></View>
        <View style={styles.progress}><View style={[styles.progressFill, { width: `${complete / 6 * 100}%` }]} /></View>
        {steps.map(([name, text], i) => <Pressable key={name} onPress={() => setDone(cur => cur.map((v, j) => j === i ? !v : v))} style={[styles.guideRow, done[i] && styles.guideRowDone]}><View style={[styles.guideNumber, done[i] && styles.guideNumberDone]}><Text style={[styles.guideNumberText, done[i] && styles.guideNumberTextDone]}>{done[i] ? '✓' : i + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.guideTitle}>{name}</Text><Text style={styles.guideText}>{text}</Text></View></Pressable>)}
        <Info tone="violet" text={complete === 6 ? 'Lecture structurée complète. Rédigez ensuite votre synthèse à partir de vos propres observations.' : 'Une étape cochée signifie “vérifiée”, pas “normale”.'} />
      </Reveal>}

      <Text style={styles.sectionLabel}>OUTILS ECG</Text>
      <View style={styles.grid}>{tools.map(tool => <MotionSurface key={tool.id} onPress={() => setActive(v => v === tool.id ? null : tool.id)} style={[styles.card, active === tool.id && styles.cardActive]} accessibilityLabel={`Ouvrir ${tool.title}`}><View style={[styles.icon, { backgroundColor: tool.bg }]}><Ionicons name={tool.icon} size={21} color={tool.color} /></View><Text style={styles.cardTitle}>{tool.title}</Text><Text style={styles.cardText}>{tool.text}</Text><View style={styles.activeBadge}><Text style={styles.activeText}>ACTIF</Text></View></MotionSurface>)}</View>

      {active === 'calibration' && <ToolPanel icon="options-outline" title="Calibration & échelle" eyebrow="QUALITÉ DU TRACÉ" color={colors.teal} bg={colors.mint}>
        <Text style={styles.intro}>Vérifiez vitesse et gain avant toute mesure. Les dimensions des carreaux changent avec ces réglages.</Text>
        <Text style={styles.label}>Vitesse papier</Text><Segmented options={[['25','25 mm/s'],['50','50 mm/s']]} value={String(speed)} onChange={v => setSpeed(v === '50' ? 50 : 25)} color={colors.tealDark} />
        <Text style={styles.label}>Gain</Text><Segmented options={[['5','5 mm/mV'],['10','10 mm/mV'],['20','20 mm/mV']]} value={String(gain)} onChange={v => setGain(Number(v) as 5|10|20)} color={colors.teal} />
        <View style={styles.metricGrid}><Metric value={`${calibration.smallBoxMs} ms`} label="1 petit carreau horizontal" /><Metric value={`${calibration.largeBoxMs} ms`} label="1 grand carreau horizontal" /><Metric value={`${calibration.smallBoxMv.toFixed(2)} mV`} label="1 mm vertical" /><Metric value={`${calibration.tenMmMv.toFixed(1)} mV`} label="10 mm vertical" /></View>
        <Info text="Le réglage standard courant est 25 mm/s et 10 mm/mV. Si le tracé utilise un autre réglage, adaptez toutes les mesures." />
        <Source href="https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.106.180200" title="AHA/ACCF/HRS — technologie et standardisation ECG" />
      </ToolPanel>}

      {active === 'rhythm' && <ToolPanel icon="pulse-outline" title="Assistant rythme" eyebrow="DESCRIPTION ECG" color={colors.violet} bg={colors.violetSoft}>
        <Text style={styles.intro}>Décrivez le rythme à partir de critères visibles. L’assistant ne remplace pas l’analyse complète du tracé.</Text>
        <TriState label="Rythme régulier ?" value={regular} onChange={setRegular} />
        <TriState label="Une onde P avant chaque QRS ?" value={pBefore} onChange={setPBefore} />
        <TriState label="Un QRS après chaque onde P ?" value={qrsAfter} onChange={setQrsAfter} />
        <TriState label="Intervalle PR constant ?" value={prConstant} onChange={setPrConstant} />
        <Text style={styles.label}>Morphologie des ondes P</Text><Segmented options={[['sinus-compatible','Compatible sinus'],['atypical','Atypique'],['unknown','À préciser']]} value={pPattern} onChange={v => setPPattern(v as PWavePattern)} color={colors.violet} />
        <View style={[styles.rhythmResult, rhythm.level === 'compatible' ? styles.okBox : rhythm.level === 'review' ? styles.warnBox : styles.pendingBox]}><Text style={styles.rhythmTitle}>{rhythm.title}</Text><Text style={styles.rhythmText}>{rhythm.detail}</Text></View>
        <Info tone="violet" text="Un profil compatible avec un rythme sinusal doit encore être confirmé sur le tracé complet et replacé dans le contexte clinique." />
      </ToolPanel>}

      {active === 'rate' && <ToolPanel icon="speedometer-outline" title="Fréquence cardiaque" eyebrow="CALCUL ECG" color={colors.teal} bg={colors.mint}>
        <Segmented options={[['regular','Régulier'],['irregular','Irrégulier']]} value={rateMode} onChange={v => { setRateMode(v as RateMode); setRateValue(''); }} color={colors.tealDark} />
        {rateMode === 'regular' && <Segmented options={[['large','Grands carreaux'],['small','Petits carreaux']]} value={rateUnit} onChange={v => { setRateUnit(v as RateUnit); setRateValue(''); }} color={colors.teal} />}
        <Text style={styles.label}>{rateMode === 'irregular' ? 'QRS sur 10 secondes' : `Nombre de ${rateUnit === 'large' ? 'grands' : 'petits'} carreaux entre R–R`}</Text><Field value={rateValue} onChange={setRateValue} placeholder="Ex. 4" unit={rateMode === 'irregular' ? 'QRS' : 'carreaux'} />
        {rate ? <Result title="FRÉQUENCE ESTIMÉE" value={`${rate} bpm`} subtitle={rateMode === 'irregular' ? 'QRS sur 10 s × 6' : rateUnit === 'large' ? '300 ÷ grands carreaux' : '1500 ÷ petits carreaux'} /> : <Info text="Renseignez une mesure valide sur un tracé à 25 mm/s." />}
      </ToolPanel>}

      {active === 'qtc' && <ToolPanel icon="timer-outline" title="QT corrigé" eyebrow="CALCUL ECG" color={colors.violet} bg={colors.violetSoft}>
        <View style={styles.row}><FieldBlock label="QT mesuré" value={qt} onChange={setQt} placeholder="410" unit="ms" /><FieldBlock label="Fréquence" value={hr} onChange={setHr} placeholder="78" unit="bpm" /></View>
        {qtc ? <View style={styles.resultPair}><Metric value={`${qtc.bazett} ms`} label="QTc Bazett" dark /><Metric value={`${qtc.fridericia} ms`} label="QTc Fridericia" dark /></View> : <Info tone="violet" text="Renseignez QT et fréquence pour calculer les deux corrections." />}
        <Info tone="violet" text="Bazett peut être moins fiable aux fréquences extrêmes. Fridericia est affichée en parallèle pour comparaison." />
      </ToolPanel>}

      {active === 'axis' && <ToolPanel icon="navigate-outline" title="Axe QRS frontal" eyebrow="ASSISTANT ECG" color={colors.blue} bg={colors.blueSoft}>
        <PolaritySelector label="Dérivation I" value={leadI} onChange={setLeadI} />
        <PolaritySelector label="Dérivation aVF" value={avf} onChange={setAvf} />
        {leadI === 'positive' && avf === 'negative' && <PolaritySelector label="Dérivation II" value={leadII} onChange={setLeadII} />}
        {axis ? <View style={styles.axisBox}><Text style={styles.axisTitle}>{axis.title}</Text><Text style={styles.axisText}>{axis.detail}</Text></View> : <Info text="Sélectionnez les polarités nécessaires pour estimer le quadrant." />}
      </ToolPanel>}

      {active === 'intervals' && <ToolPanel icon="resize-outline" title="Intervalles PR, QRS et QT" eyebrow="MESURE ECG" color={colors.teal} bg={colors.mint}>
        <View style={styles.row}><FieldBlock label="PR" value={pr} onChange={setPr} placeholder="160" unit="ms" /><FieldBlock label="QRS" value={qrs} onChange={setQrs} placeholder="96" unit="ms" /></View>
        <View style={styles.row}><FieldBlock label="QT" value={intervalQt} onChange={setIntervalQt} placeholder="410" unit="ms" /><FieldBlock label="Fréquence" value={intervalHr} onChange={setIntervalHr} placeholder="72" unit="bpm" /></View>
        <View style={styles.intervalList}><Interval label="PR" detail={prLabel ?? 'Repère usuel adulte : 120–200 ms'} /><Interval label="QRS" detail={qrsLabel ?? 'Seuil d’élargissement utilisé : 120 ms'} /><Interval label="QT/QTc" detail={intervalQtc ? `Bazett ${intervalQtc.bazett} ms · Fridericia ${intervalQtc.fridericia} ms` : 'Ajouter QT + fréquence pour corriger'} /></View>
        <Info text="Les durées doivent toujours être interprétées avec la morphologie, le rythme, les médicaments, les électrolytes et le contexte clinique." />
      </ToolPanel>}

      <View style={styles.disclaimer}><Ionicons name="shield-checkmark-outline" size={19} color={colors.teal} /><Text style={styles.disclaimerText}>Outil pédagogique et d’aide à la mesure. Il ne remplace pas l’interprétation médicale, les tracés antérieurs ni les recommandations locales.</Text></View>
    </ScrollView>
  );
}

function ToolPanel({ children, icon, title, eyebrow, color, bg }: { children: React.ReactNode; icon: keyof typeof Ionicons.glyphMap; title: string; eyebrow: string; color: string; bg: string }) {
  return <Reveal style={styles.panel}><View style={styles.panelTop}><View style={[styles.panelIcon,{ backgroundColor:bg }]}><Ionicons name={icon} size={21} color={color} /></View><View style={{ flex:1 }}><Text style={[styles.panelEyebrow,{ color }]}>{eyebrow}</Text><Text style={styles.panelTitle}>{title}</Text></View><View style={[styles.activeBadge,{ backgroundColor:bg }]}><Text style={[styles.activeText,{ color }]}>ACTIF</Text></View></View>{children}</Reveal>;
}
function Segmented({ options, value, onChange, color }: { options:[string,string][]; value:string; onChange:(v:string)=>void; color:string }) { return <View style={styles.segmented}>{options.map(([id,label]) => <Pressable key={id} onPress={()=>onChange(id)} style={[styles.segment,value===id&&{backgroundColor:color}]}><Text style={[styles.segmentText,value===id&&styles.segmentTextActive]}>{label}</Text></Pressable>)}</View>; }
function TriState({ label, value, onChange }: { label:string; value:RhythmAnswer; onChange:(v:RhythmAnswer)=>void }) { return <View><Text style={styles.label}>{label}</Text><Segmented options={[['yes','Oui'],['no','Non'],['unknown','À préciser']]} value={value} onChange={v=>onChange(v as RhythmAnswer)} color={colors.violet} /></View>; }
function Field({ value, onChange, placeholder, unit }: { value:string; onChange:(v:string)=>void; placeholder:string; unit:string }) { return <View style={styles.field}><TextInput value={value} onChangeText={onChange} keyboardType="decimal-pad" placeholder={placeholder} placeholderTextColor={colors.muted} style={styles.input}/><Text style={styles.unit}>{unit}</Text></View>; }
function FieldBlock({ label, ...props }: { label:string; value:string; onChange:(v:string)=>void; placeholder:string; unit:string }) { return <View style={{flex:1}}><Text style={styles.label}>{label}</Text><Field {...props}/></View>; }
function Metric({ value, label, dark=false }: { value:string; label:string; dark?:boolean }) { return <View style={[styles.metric,dark&&styles.metricDark]}><Text style={[styles.metricValue,dark&&styles.metricValueDark]}>{value}</Text><Text style={[styles.metricLabel,dark&&styles.metricLabelDark]}>{label}</Text></View>; }
function Result({ title, value, subtitle }: { title:string; value:string; subtitle:string }) { return <View style={styles.result}><Text style={styles.resultLabel}>{title}</Text><Text style={styles.resultValue}>{value}</Text><Text style={styles.resultSub}>{subtitle}</Text></View>; }
function Info({ text, tone='teal' }: { text:string; tone?:'teal'|'violet' }) { return <View style={[styles.info,tone==='violet'&&styles.infoViolet]}><Ionicons name="information-circle-outline" size={18} color={tone==='violet'?colors.violet:colors.teal}/><Text style={styles.infoText}>{text}</Text></View>; }
function Source({ href, title }: { href:string; title:string }) { return <Pressable onPress={()=>Linking.openURL(href)} style={styles.source}><Ionicons name="library-outline" size={18} color={colors.teal}/><Text style={styles.sourceText}>{title}</Text><Ionicons name="open-outline" size={16} color={colors.muted}/></Pressable>; }
function Interval({ label, detail }: { label:string; detail:string }) { return <View style={styles.interval}><Text style={styles.intervalLabel}>{label}</Text><Text style={styles.intervalText}>{detail}</Text></View>; }
function PolaritySelector({ label, value, onChange }: { label:string; value:Polarity|null; onChange:(v:Polarity)=>void }) { return <View><Text style={styles.label}>{label}</Text><View style={styles.polarity}>{(['positive','negative','isoelectric'] as Polarity[]).map(v=><Pressable key={v} onPress={()=>onChange(v)} style={[styles.polarityButton,value===v&&styles.polarityActive]}><Text style={[styles.polarityText,value===v&&styles.polarityTextActive]}>{v==='positive'?'Positif':v==='negative'?'Négatif':'Isoélectrique'}</Text></Pressable>)}</View></View>; }

const styles=StyleSheet.create({
  screen:{flex:1,backgroundColor:colors.canvas},content:{padding:spacing.lg,paddingBottom:42},kicker:{color:colors.violet,fontSize:10,fontWeight:'900',letterSpacing:1.2},title:{marginTop:12,color:colors.ink,fontSize:31,lineHeight:36,fontWeight:'900',letterSpacing:-.7},subtitle:{marginTop:9,color:colors.muted,fontSize:13,lineHeight:19},hero:{marginTop:18,padding:19,borderRadius:radius.lg,...shadow},heroTop:{flexDirection:'row',alignItems:'center',gap:10},heroCopy:{flex:1},heroTitle:{color:colors.white,fontSize:18,fontWeight:'900'},heroMeta:{marginTop:3,color:'#D1CCF0',fontSize:10},premium:{paddingHorizontal:9,paddingVertical:6,borderRadius:999,backgroundColor:'#5E4A9E'},premiumText:{color:'#F0E5FF',fontSize:8,fontWeight:'900'},wave:{height:74,flexDirection:'row',alignItems:'center'},waveLine:{flex:1,height:2,backgroundColor:'#72E2CF'},dots:{flexDirection:'row',gap:7},dot:{flex:1,paddingVertical:8,alignItems:'center',borderRadius:10,backgroundColor:'rgba(255,255,255,.06)'},dotDone:{backgroundColor:'rgba(114,226,207,.18)'},dotText:{color:'#AFA9CF',fontSize:10,fontWeight:'900'},dotTextDone:{color:'#8FF2E0'},heroButton:{marginTop:14,minHeight:46,borderRadius:14,backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},heroButtonText:{color:colors.violetDeep,fontSize:12,fontWeight:'900'},sectionLabel:{marginTop:25,marginBottom:11,color:colors.muted,fontSize:10,fontWeight:'900',letterSpacing:1},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},card:{width:'48.5%',minHeight:138,padding:14,borderRadius:radius.md,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line},cardActive:{borderColor:'#B8AFE8',backgroundColor:'#FCFBFF'},icon:{width:39,height:39,borderRadius:13,alignItems:'center',justifyContent:'center'},cardTitle:{marginTop:10,color:colors.ink,fontSize:13,fontWeight:'900'},cardText:{marginTop:4,color:colors.muted,fontSize:9},activeBadge:{marginTop:10,alignSelf:'flex-start',paddingHorizontal:7,paddingVertical:4,borderRadius:999,backgroundColor:colors.violetSoft},activeText:{color:colors.violet,fontSize:8,fontWeight:'900'},panel:{marginTop:16,padding:17,borderRadius:radius.lg,backgroundColor:colors.surface,borderWidth:1,borderColor:'#DDD7F4',...shadow},panelTop:{flexDirection:'row',alignItems:'center',gap:10},panelIcon:{width:42,height:42,borderRadius:14,alignItems:'center',justifyContent:'center'},panelEyebrow:{fontSize:8,fontWeight:'900',letterSpacing:.8},panelTitle:{marginTop:3,color:colors.ink,fontSize:19,fontWeight:'900'},intro:{marginTop:11,color:colors.muted,fontSize:11,lineHeight:17},label:{marginTop:13,marginBottom:6,color:colors.ink,fontSize:10,fontWeight:'800'},segmented:{padding:4,flexDirection:'row',gap:4,borderRadius:14,backgroundColor:colors.canvas},segment:{flex:1,paddingHorizontal:6,paddingVertical:9,borderRadius:10,alignItems:'center'},segmentText:{color:colors.muted,fontSize:9,fontWeight:'800'},segmentTextActive:{color:colors.white},metricGrid:{marginTop:14,flexDirection:'row',flexWrap:'wrap',gap:9},metric:{width:'48%',padding:13,borderRadius:14,backgroundColor:colors.canvas},metricDark:{backgroundColor:colors.violetDeep},metricValue:{color:colors.ink,fontSize:17,fontWeight:'900'},metricValueDark:{color:colors.white},metricLabel:{marginTop:3,color:colors.muted,fontSize:9,lineHeight:13},metricLabelDark:{color:'#C9C2EE'},info:{marginTop:13,flexDirection:'row',gap:8,padding:12,borderRadius:14,backgroundColor:colors.mint},infoViolet:{backgroundColor:colors.violetSoft},infoText:{flex:1,color:colors.muted,fontSize:10,lineHeight:15},source:{marginTop:12,flexDirection:'row',alignItems:'center',gap:8,padding:12,borderRadius:14,borderWidth:1,borderColor:colors.line},sourceText:{flex:1,color:colors.ink,fontSize:10,fontWeight:'800'},rhythmResult:{marginTop:14,padding:14,borderRadius:16},okBox:{backgroundColor:colors.mint},warnBox:{backgroundColor:colors.amberSoft},pendingBox:{backgroundColor:colors.violetSoft},rhythmTitle:{color:colors.ink,fontSize:14,fontWeight:'900'},rhythmText:{marginTop:5,color:colors.muted,fontSize:10,lineHeight:15},field:{minHeight:50,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:7,borderRadius:14,borderWidth:1,borderColor:colors.line,backgroundColor:colors.canvas},input:{flex:1,color:colors.ink,fontSize:17,fontWeight:'900'},unit:{color:colors.violet,fontSize:10,fontWeight:'900'},row:{marginTop:2,flexDirection:'row',gap:10},result:{marginTop:14,padding:15,borderRadius:17,backgroundColor:colors.tealDark},resultLabel:{color:'#C9E5DF',fontSize:8,fontWeight:'900',letterSpacing:.7},resultValue:{marginTop:4,color:colors.white,fontSize:26,fontWeight:'900'},resultSub:{marginTop:5,color:'#C9E5DF',fontSize:9},resultPair:{marginTop:14,flexDirection:'row',gap:9},axisBox:{marginTop:14,padding:15,borderRadius:17,backgroundColor:colors.blue},axisTitle:{color:colors.white,fontSize:17,fontWeight:'900'},axisText:{marginTop:5,color:'#E4EAFF',fontSize:10,lineHeight:15},intervalList:{marginTop:14,gap:8},interval:{padding:12,borderRadius:13,backgroundColor:colors.canvas},intervalLabel:{color:colors.teal,fontSize:10,fontWeight:'900'},intervalText:{marginTop:3,color:colors.muted,fontSize:10,lineHeight:14},polarity:{flexDirection:'row',gap:6},polarityButton:{flex:1,minHeight:42,borderRadius:11,borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center',backgroundColor:colors.canvas},polarityActive:{backgroundColor:colors.blue,borderColor:colors.blue},polarityText:{color:colors.blue,fontSize:9,fontWeight:'800'},polarityTextActive:{color:colors.white},progress:{marginTop:14,height:7,borderRadius:4,overflow:'hidden',backgroundColor:colors.canvas},progressFill:{height:'100%',backgroundColor:colors.teal},reset:{color:colors.violet,fontSize:9,fontWeight:'900'},guideRow:{marginTop:9,flexDirection:'row',gap:10,padding:12,borderRadius:14,borderWidth:1,borderColor:colors.line,backgroundColor:colors.canvas},guideRowDone:{backgroundColor:colors.mint,borderColor:colors.mintStrong},guideNumber:{width:32,height:32,borderRadius:16,alignItems:'center',justifyContent:'center',backgroundColor:colors.violetSoft},guideNumberDone:{backgroundColor:colors.teal},guideNumberText:{color:colors.violet,fontSize:11,fontWeight:'900'},guideNumberTextDone:{color:colors.white},guideTitle:{color:colors.ink,fontSize:11,fontWeight:'900'},guideText:{marginTop:3,color:colors.muted,fontSize:9,lineHeight:13},disclaimer:{marginTop:20,flexDirection:'row',gap:9,padding:14,borderRadius:radius.md,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line},disclaimerText:{flex:1,color:colors.muted,fontSize:10,lineHeight:16}
});
