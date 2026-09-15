import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { calculateAdditiveScore, CalculatorValues, getCalculatorDefinition, getEmptyValues, isCalculatorComplete } from '../domain/clinical/definitions';
import { calculateFormula, FormulaChoiceField, FormulaNumberField, getEmptyFormulaValues, getFormulaDefinition, isFormulaComplete } from '../domain/clinical/formulaDefinitions';
import { ClinicalTool } from '../domain/clinical/types';
import { useActivity } from '../state/ActivityContext';
import { colors, radius, shadow, spacing } from '../theme/tokens';

type ScoreChoiceProps = {
  title: string;
  shortLabel: string;
  value: number | null;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
};

function ScoreChoice({ title, shortLabel, value, options, onChange }: ScoreChoiceProps) {
  return (
    <View style={styles.choiceBlock}>
      <Text style={styles.choiceTitle}>{title} <Text style={styles.choiceShort}>({shortLabel})</Text></Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable key={option.value} onPress={() => onChange(option.value)} style={({ pressed }) => [styles.option, selected && styles.optionActive, pressed && styles.pressed]}>
              <View style={[styles.scoreDot, selected && styles.scoreDotActive]}><Text style={[styles.scoreNumber, selected && styles.scoreNumberActive]}>{option.value}</Text></View>
              <Text style={[styles.optionText, selected && styles.optionTextActive]}>{option.label}</Text>
              {selected && <Ionicons name="checkmark-circle" size={20} color={colors.teal} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function FormulaChoice({ field, value, onChange }: { field: FormulaChoiceField; value: number | null; onChange: (value: number) => void }) {
  return (
    <View style={styles.choiceBlock}>
      <Text style={styles.choiceTitle}>{field.label}</Text>
      <View style={styles.options}>
        {field.options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable key={option.value} onPress={() => onChange(option.value)} style={({ pressed }) => [styles.option, selected && styles.optionActive, pressed && styles.pressed]}>
              <Text style={[styles.optionText, selected && styles.optionTextActive]}>{option.label}</Text>
              {selected && <Ionicons name="checkmark-circle" size={20} color={colors.teal} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function FormulaNumber({ field, value, onChange }: { field: FormulaNumberField; value: number | null; onChange: (value: number | null) => void }) {
  const [text, setText] = useState(value === null ? '' : String(value));
  useEffect(() => { if (value === null) setText(''); }, [value]);

  return (
    <View style={styles.choiceBlock}>
      <Text style={styles.choiceTitle}>{field.label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          value={text}
          onChangeText={(next) => {
            setText(next);
            const normalized = next.trim().replace(',', '.');
            if (!normalized) { onChange(null); return; }
            const parsed = Number(normalized);
            onChange(Number.isFinite(parsed) ? parsed : null);
          }}
          keyboardType="decimal-pad"
          placeholder={field.placeholder}
          placeholderTextColor="#82918E"
          style={styles.numberInput}
        />
        {!!field.unit && field.unit !== 'valeur' && <Text style={styles.inputUnit}>{field.unit}</Text>}
      </View>
      <Text style={styles.inputHelp}>Valeur acceptée : {field.min} à {field.max}{field.unit === 'valeur' ? '' : ` ${field.unit}`}</Text>
    </View>
  );
}

export function ToolScreen({ tool, onBack }: { tool: ClinicalTool; onBack: () => void }) {
  const { isFavorite, toggleFavorite } = useActivity();
  const definition = getCalculatorDefinition(tool.id);
  const formulaDefinition = getFormulaDefinition(tool.id);
  const [values, setValues] = useState<CalculatorValues>(() => definition ? getEmptyValues(definition) : formulaDefinition ? getEmptyFormulaValues(formulaDefinition) : {});
  const fields = definition?.fields ?? formulaDefinition?.fields ?? [];
  const answered = fields.filter((field) => values[field.id] !== null && values[field.id] !== undefined).length;
  const complete = definition ? isCalculatorComplete(definition, values) : formulaDefinition ? isFormulaComplete(formulaDefinition, values) : false;
  const additiveResult = useMemo(() => definition && complete ? calculateAdditiveScore(definition, values) : null, [definition, complete, values]);
  const formulaState = useMemo(() => {
    if (!formulaDefinition || !complete) return { result: null, error: null };
    try { return { result: calculateFormula(formulaDefinition, values), error: null }; }
    catch (error) { return { result: null, error: error instanceof Error ? error.message : 'Valeur invalide' }; }
  }, [formulaDefinition, complete, values]);
  const reset = () => definition ? setValues(getEmptyValues(definition)) : formulaDefinition ? setValues(getEmptyFormulaValues(formulaDefinition)) : undefined;
  const usable = tool.available && (!!definition || !!formulaDefinition);
  const remaining = Math.max(fields.length - answered, 0);
  const progress = fields.length ? Math.round((answered / fields.length) * 100) : 0;
  const progressWidth = `${progress}%` as `${number}%`;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.top}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.backLink, pressed && styles.pressed]} accessibilityLabel="Retour aux scores">
          <Ionicons name="chevron-back" size={18} color={colors.ink} />
          <Text style={styles.backText}>Scores</Text>
        </Pressable>
        <Pressable onPress={() => void toggleFavorite(tool.id)} style={({ pressed }) => [styles.favorite, pressed && styles.pressed]} accessibilityLabel={isFavorite(tool.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
          <Ionicons name={isFavorite(tool.id) ? 'heart' : 'heart-outline'} size={20} color={isFavorite(tool.id) ? colors.danger : colors.muted} />
        </Pressable>
      </View>

      <View style={styles.identity}>
        <View style={[styles.toolIcon, { backgroundColor: tool.surfaceColor }]}><Ionicons name={tool.icon as keyof typeof Ionicons.glyphMap} size={24} color={tool.color} /></View>
        <View style={styles.identityCopy}>
          <Text style={styles.title}>{tool.name}</Text>
          <Text style={styles.kicker}>{tool.specialty}</Text>
        </View>
        <View style={styles.offline}><Text style={styles.offlineText}>HORS LIGNE</Text></View>
      </View>
      <Text style={styles.summary}>{tool.summary}</Text>

      {!usable ? (
        <View style={styles.unavailable}>
          <Ionicons name="construct-outline" size={23} color={colors.amber} />
          <View style={styles.unavailableCopy}><Text style={styles.unavailableTitle}>Fiche en validation</Text><Text style={styles.unavailableText}>Le calcul sera activé après revue des sources et tests cliniques.</Text></View>
        </View>
      ) : (
        <>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>{complete ? (formulaDefinition?.resultLabel ?? 'SCORE CALCULÉ') : 'CRITÈRES RENSEIGNÉS'}</Text>
            {complete ? (
              definition && additiveResult ? (
                <>
                  <Text style={styles.resultValue}>{additiveResult.total}<Text style={styles.resultMax}> / {definition.max}</Text></Text>
                  {!!additiveResult.notation && <Text style={styles.notation}>{additiveResult.notation}</Text>}
                  {!!additiveResult.interpretation && <Text style={styles.interpretation}>{additiveResult.interpretation}</Text>}
                  <Text style={styles.resultHint}>{definition.resultHint}</Text>
                </>
              ) : formulaState.result ? (
                <>
                  <Text style={styles.formulaValue}>{formulaState.result.display}</Text>
                  {!!formulaState.result.interpretation && <Text style={styles.interpretation}>{formulaState.result.interpretation}</Text>}
                  {!!formulaState.result.detail && <Text style={styles.formulaDetail}>{formulaState.result.detail}</Text>}
                  <Text style={styles.resultHint}>{formulaDefinition?.resultHint}</Text>
                </>
              ) : (
                <><Text style={styles.formulaErrorTitle}>Valeur à vérifier</Text><Text style={styles.pendingText}>{formulaState.error}</Text></>
              )
            ) : (
              <>
                <Text style={styles.progressValue}>{answered} / {fields.length}</Text>
                <Text style={styles.pendingText}>Complétez tous les critères pour obtenir le résultat.</Text>
              </>
            )}
          </View>

          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: progressWidth }]} /></View>
          <View style={styles.resetRow}>
            <Text style={styles.progressText}>{complete ? 'Calcul complet' : `${remaining} critère${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`}</Text>
            <Pressable onPress={reset} hitSlop={8}><Text style={styles.resetText}>Réinitialiser</Text></Pressable>
          </View>

          {definition?.fields.map((field) => (
            <ScoreChoice key={field.id} title={field.label} shortLabel={field.shortLabel} value={values[field.id] ?? null} options={field.options} onChange={(value) => setValues((current) => ({ ...current, [field.id]: value }))} />
          ))}
          {formulaDefinition?.fields.map((field) => field.kind === 'choice'
            ? <FormulaChoice key={field.id} field={field} value={values[field.id] ?? null} onChange={(value) => setValues((current) => ({ ...current, [field.id]: value }))} />
            : <FormulaNumber key={field.id} field={field} value={values[field.id] ?? null} onChange={(value) => setValues((current) => ({ ...current, [field.id]: value }))} />)}

          {!complete && remaining > 0 && (
            <View style={styles.remainingCard}>
              <Text style={styles.remainingTitle}>{remaining} critère{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''}</Text>
              <Text style={styles.remainingText}>Aucune valeur n’est présélectionnée : chaque réponse doit être renseignée explicitement.</Text>
            </View>
          )}
        </>
      )}

      <Info title="Quand l’utiliser ?" icon="help-circle-outline" items={tool.indications} />
      <Info title="Limites et vigilance" icon="warning-outline" items={tool.limitations} warning />

      {!!tool.sources.length && (
        <View style={styles.sourceCard}>
          <View style={styles.sourceHeader}><Ionicons name="checkmark-circle" size={19} color={colors.teal} /><Text style={styles.sourceHeading}>Source vérifiée</Text></View>
          {tool.sources.map((source) => (
            <Pressable key={source.url} onPress={() => Linking.openURL(source.url)} style={({ pressed }) => pressed && styles.pressed} accessibilityRole="link">
              <Text style={styles.sourceTitle}>{source.title}</Text>
              <Text style={styles.sourceText}>{source.citation}</Text>
              <Text style={styles.sourceMeta}>Consultée le {source.accessedAt} · Fiche v{tool.version}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.disclaimer}>Outil pédagogique et d’aide à la décision. Ne remplace pas l’évaluation clinique ni les protocoles locaux.</Text>
    </ScrollView>
  );
}

function Info({ title, icon, items, warning = false }: { title: string; icon: keyof typeof Ionicons.glyphMap; items: string[]; warning?: boolean }) {
  if (!items.length) return null;
  return (
    <View style={[styles.info, warning && styles.infoWarning]}>
      <View style={styles.infoTitleRow}><Ionicons name={icon} size={19} color={warning ? colors.amber : colors.teal} /><Text style={styles.infoTitle}>{title}</Text></View>
      {items.map((item) => <View key={item} style={styles.bulletRow}><View style={[styles.bullet, warning && styles.bulletWarning]} /><Text style={styles.infoText}>{item}</Text></View>)}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, paddingBottom: 50 },
  pressed: { opacity: 0.72 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 7 },
  backText: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  favorite: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  identity: { marginTop: 15, flexDirection: 'row', alignItems: 'center', gap: 11 },
  toolIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  identityCopy: { flex: 1 },
  title: { color: colors.ink, fontSize: 24, lineHeight: 29, fontWeight: '900', letterSpacing: -0.5 },
  kicker: { marginTop: 2, color: colors.teal, fontSize: 10, fontWeight: '800' },
  offline: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.mint },
  offlineText: { color: colors.tealDark, fontSize: 8, fontWeight: '900' },
  summary: { marginTop: 12, color: colors.muted, fontSize: 13, lineHeight: 19 },
  resultCard: { marginTop: 20, paddingHorizontal: 18, paddingVertical: 21, borderRadius: 24, backgroundColor: colors.tealDark, ...shadow },
  resultLabel: { color: '#B8E5DB', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  resultValue: { marginTop: 7, color: colors.white, fontSize: 42, fontWeight: '900' },
  resultMax: { fontSize: 19, color: '#BDE6DD' },
  formulaValue: { marginTop: 9, color: colors.white, fontSize: 29, lineHeight: 35, fontWeight: '900' },
  formulaDetail: { marginTop: 7, color: '#BDE6DD', fontSize: 10 },
  formulaErrorTitle: { marginTop: 9, color: colors.white, fontSize: 22, fontWeight: '900' },
  progressValue: { marginTop: 7, color: colors.white, fontSize: 36, fontWeight: '900' },
  pendingText: { marginTop: 8, color: '#CCE5E0', fontSize: 11, lineHeight: 17 },
  notation: { marginTop: 3, color: colors.white, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  interpretation: { marginTop: 11, color: colors.white, fontSize: 13, lineHeight: 18, fontWeight: '800' },
  resultHint: { marginTop: 10, color: '#CBE2DD', fontSize: 10, lineHeight: 15 },
  progressTrack: { marginTop: 15, height: 5, borderRadius: 3, backgroundColor: '#D4E0DB', overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: colors.teal },
  resetRow: { marginTop: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressText: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  resetText: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  choiceBlock: { marginTop: 22 },
  choiceTitle: { marginBottom: 10, color: colors.ink, fontSize: 15, fontWeight: '900' },
  choiceShort: { color: colors.muted, fontWeight: '700' },
  options: { gap: 8 },
  option: { minHeight: 52, paddingHorizontal: 13, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 11 },
  optionActive: { borderColor: colors.teal, backgroundColor: '#F2FBF8' },
  scoreDot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  scoreDotActive: { backgroundColor: colors.teal },
  scoreNumber: { color: colors.muted, fontWeight: '900' },
  scoreNumberActive: { color: colors.white },
  optionText: { flex: 1, color: colors.ink, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  optionTextActive: { color: colors.tealDark, fontWeight: '800' },
  inputWrap: { minHeight: 54, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 10 },
  numberInput: { flex: 1, color: colors.ink, fontSize: 18, fontWeight: '800', paddingVertical: 12 },
  inputUnit: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  inputHelp: { marginTop: 7, color: colors.muted, fontSize: 9 },
  remainingCard: { marginTop: 20, padding: 14, borderRadius: radius.md, backgroundColor: colors.amberSoft },
  remainingTitle: { color: colors.amber, fontSize: 11, fontWeight: '900' },
  remainingText: { marginTop: 5, color: colors.muted, fontSize: 10, lineHeight: 15 },
  unavailable: { marginTop: 22, padding: 17, borderRadius: radius.md, backgroundColor: colors.amberSoft, flexDirection: 'row', gap: 12 },
  unavailableCopy: { flex: 1 },
  unavailableTitle: { color: colors.ink, fontWeight: '900' },
  unavailableText: { marginTop: 3, color: colors.muted, fontSize: 11, lineHeight: 16 },
  info: { marginTop: 22, padding: 16, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  infoWarning: { backgroundColor: colors.amberSoft, borderColor: '#F1D5A9' },
  infoTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  infoTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  bulletRow: { flexDirection: 'row', gap: 9, marginTop: 7 },
  bullet: { width: 5, height: 5, borderRadius: 3, marginTop: 6, backgroundColor: colors.teal },
  bulletWarning: { backgroundColor: colors.amber },
  infoText: { flex: 1, color: colors.muted, lineHeight: 18, fontSize: 12 },
  sourceCard: { marginTop: 22, padding: 16, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  sourceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sourceHeading: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  sourceTitle: { color: colors.teal, fontSize: 12, fontWeight: '900' },
  sourceText: { marginTop: 4, color: colors.muted, fontSize: 11, lineHeight: 16 },
  sourceMeta: { marginTop: 7, color: colors.muted, fontSize: 9 },
  disclaimer: { marginTop: 22, color: colors.muted, fontSize: 9, lineHeight: 14, textAlign: 'center' },
});
