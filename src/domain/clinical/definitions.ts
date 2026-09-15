import { z } from 'zod';

const optionSchema = z.object({ value: z.number(), label: z.string().min(1) });
const fieldSchema = z.object({ id: z.string().min(1), label: z.string().min(1), shortLabel: z.string().min(1), options: z.array(optionSchema).min(2) });
const rangeSchema = z.object({ min: z.number(), max: z.number(), label: z.string().min(1) });
const definitionSchema = z.object({ toolId: z.string().min(1), fields: z.array(fieldSchema).min(1), min: z.number(), max: z.number(), ranges: z.array(rangeSchema).optional(), resultHint: z.string().min(1) });

export type CalculatorDefinition = z.infer<typeof definitionSchema>;
export type CalculatorValues = Record<string, number | null>;

const definitions: CalculatorDefinition[] = [{
  toolId: 'glasgow-coma-scale', min: 3, max: 15, resultHint: 'Toujours communiquer les composantes avec le total.',
  fields: [
    { id: 'eye', label: 'Ouverture des yeux', shortLabel: 'E', options: [{ value: 4, label: 'Spontanée' }, { value: 3, label: 'Au son' }, { value: 2, label: 'À la pression' }, { value: 1, label: 'Aucune' }] },
    { id: 'verbal', label: 'Réponse verbale', shortLabel: 'V', options: [{ value: 5, label: 'Orientée' }, { value: 4, label: 'Confuse' }, { value: 3, label: 'Mots' }, { value: 2, label: 'Sons' }, { value: 1, label: 'Aucune' }] },
    { id: 'motor', label: 'Réponse motrice', shortLabel: 'M', options: [{ value: 6, label: 'Obéit aux consignes' }, { value: 5, label: 'Localise' }, { value: 4, label: 'Flexion normale' }, { value: 3, label: 'Flexion anormale' }, { value: 2, label: 'Extension' }, { value: 1, label: 'Aucune' }] },
  ],
}, {
  toolId: 'cha2ds2-vasc', min: 0, max: 9, resultHint: 'Ce total ne constitue pas, à lui seul, une indication thérapeutique.',
  fields: [
    { id: 'heartFailure', label: 'Insuffisance cardiaque', shortLabel: 'C', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'hypertension', label: 'Hypertension artérielle', shortLabel: 'H', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'age', label: 'Âge', shortLabel: 'A', options: [{ value: 0, label: 'Moins de 65 ans' }, { value: 1, label: '65 à 74 ans' }, { value: 2, label: '75 ans ou plus' }] },
    { id: 'diabetes', label: 'Diabète', shortLabel: 'D', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'stroke', label: 'AVC, AIT ou embolie systémique antérieur', shortLabel: 'S₂', options: [{ value: 0, label: 'Non' }, { value: 2, label: 'Oui' }] },
    { id: 'vascular', label: 'Maladie vasculaire', shortLabel: 'V', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'sex', label: 'Sexe féminin', shortLabel: 'Sc', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
  ],
}, {
  toolId: 'cha2ds2-va', min: 0, max: 8, resultHint: 'Le score aide à structurer le risque thromboembolique en fibrillation atriale ; la décision reste clinique et individualisée.',
  ranges: [
    { min: 0, max: 0, label: 'CHA₂DS₂-VA = 0' },
    { min: 1, max: 1, label: 'CHA₂DS₂-VA = 1' },
    { min: 2, max: 8, label: 'CHA₂DS₂-VA ≥ 2' },
  ],
  fields: [
    { id: 'heartFailure', label: 'Insuffisance cardiaque', shortLabel: 'C', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'hypertension', label: 'Hypertension artérielle', shortLabel: 'H', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'age', label: 'Âge', shortLabel: 'A', options: [{ value: 0, label: 'Moins de 65 ans' }, { value: 1, label: '65 à 74 ans' }, { value: 2, label: '75 ans ou plus' }] },
    { id: 'diabetes', label: 'Diabète', shortLabel: 'D', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'stroke', label: 'AVC, AIT ou embolie systémique antérieur', shortLabel: 'S₂', options: [{ value: 0, label: 'Non' }, { value: 2, label: 'Oui' }] },
    { id: 'vascular', label: 'Maladie vasculaire', shortLabel: 'V', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
  ],
}, {
  toolId: 'curb-65', min: 0, max: 5, resultHint: 'Interpréter avec le contexte clinique et les protocoles locaux.',
  fields: [
    { id: 'confusion', label: 'Confusion nouvelle', shortLabel: 'C', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'urea', label: 'Urée sanguine > 7 mmol/L', shortLabel: 'U', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'respiratoryRate', label: 'Fréquence respiratoire ≥ 30/min', shortLabel: 'R', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'bloodPressure', label: 'PAS < 90 ou PAD ≤ 60 mmHg', shortLabel: 'B', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'age65', label: 'Âge ≥ 65 ans', shortLabel: '65', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
  ],
}, {
  toolId: 'wells-pe', min: 0, max: 12.5, resultHint: 'Modèle à deux niveaux : le score ne confirme ni n’exclut seul une EP.',
  ranges: [{ min: 0, max: 4, label: 'EP improbable (modèle à deux niveaux)' }, { min: 4.000001, max: 12.5, label: 'EP probable (modèle à deux niveaux)' }],
  fields: [
    { id: 'dvtSigns', label: 'Signes cliniques de TVP', shortLabel: 'TVP', options: [{ value: 0, label: 'Non' }, { value: 3, label: 'Oui' }] },
    { id: 'alternative', label: 'EP plus probable qu’un autre diagnostic', shortLabel: 'EP', options: [{ value: 0, label: 'Non' }, { value: 3, label: 'Oui' }] },
    { id: 'heartRate', label: 'Fréquence cardiaque > 100/min', shortLabel: 'FC', options: [{ value: 0, label: 'Non' }, { value: 1.5, label: 'Oui' }] },
    { id: 'immobilization', label: 'Immobilisation ≥ 3 jours ou chirurgie dans les 4 semaines', shortLabel: 'Imm', options: [{ value: 0, label: 'Non' }, { value: 1.5, label: 'Oui' }] },
    { id: 'previous', label: 'Antécédent de TVP ou EP', shortLabel: 'ATCD', options: [{ value: 0, label: 'Non' }, { value: 1.5, label: 'Oui' }] },
    { id: 'hemoptysis', label: 'Hémoptysie', shortLabel: 'Hém', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'malignancy', label: 'Cancer actif', shortLabel: 'K', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
  ],
}, {
  toolId: 'qsofa', min: 0, max: 3, resultHint: 'qSOFA n’est pas un diagnostic de sepsis et ne doit pas être utilisé seul comme outil de dépistage.',
  ranges: [
    { min: 0, max: 1, label: 'qSOFA < 2' },
    { min: 2, max: 3, label: 'qSOFA ≥ 2 : risque accru de mauvaise évolution chez un adulte avec infection suspectée' },
  ],
  fields: [
    { id: 'respiratoryRate', label: 'Fréquence respiratoire ≥ 22/min', shortLabel: 'FR', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'bloodPressure', label: 'Pression artérielle systolique ≤ 100 mmHg', shortLabel: 'PAS', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'mentation', label: 'Altération de l’état mental', shortLabel: 'Mental', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
  ],
}, {
  toolId: 'perc', min: 0, max: 8, resultHint: 'PERC ne s’applique qu’après identification d’une faible probabilité clinique pré-test d’EP.',
  ranges: [
    { min: 0, max: 0, label: 'PERC négatif : aucun critère positif' },
    { min: 1, max: 8, label: 'PERC positif : l’EP n’est pas exclue par cette règle' },
  ],
  fields: [
    { id: 'age', label: 'Âge ≥ 50 ans', shortLabel: 'Âge', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'heartRate', label: 'Fréquence cardiaque ≥ 100/min', shortLabel: 'FC', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'oxygen', label: 'SpO₂ < 95 % en air ambiant', shortLabel: 'SpO₂', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'unilateralLegSwelling', label: 'Œdème unilatéral d’un membre inférieur', shortLabel: 'OMI', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'hemoptysis', label: 'Hémoptysie', shortLabel: 'Hém', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'recentSurgeryTrauma', label: 'Chirurgie ou traumatisme récent nécessitant hospitalisation, dans les 4 semaines', shortLabel: 'Chir/Trauma', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'previousVte', label: 'Antécédent de TVP ou EP', shortLabel: 'ATCD', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
    { id: 'estrogen', label: 'Traitement estrogénique', shortLabel: 'Œst', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }] },
  ],
}, {
  toolId: 'heart-score', min: 0, max: 10, resultHint: 'Le HEART score conventionnel doit être interprété avec le protocole local de douleur thoracique et le dosage de troponine utilisé.',
  ranges: [
    { min: 0, max: 3, label: 'Risque faible (HEART 0–3)' },
    { min: 4, max: 6, label: 'Risque intermédiaire (HEART 4–6)' },
    { min: 7, max: 10, label: 'Risque élevé (HEART 7–10)' },
  ],
  fields: [
    { id: 'history', label: 'Anamnèse', shortLabel: 'H', options: [{ value: 0, label: 'Peu ou non suspecte' }, { value: 1, label: 'Modérément suspecte' }, { value: 2, label: 'Très suspecte' }] },
    { id: 'ecg', label: 'ECG', shortLabel: 'E', options: [{ value: 0, label: 'Normal' }, { value: 1, label: 'Troubles non spécifiques de repolarisation' }, { value: 2, label: 'Sous-décalage ST significatif' }] },
    { id: 'age', label: 'Âge', shortLabel: 'A', options: [{ value: 0, label: 'Moins de 45 ans' }, { value: 1, label: '45 à 64 ans' }, { value: 2, label: '65 ans ou plus' }] },
    { id: 'riskFactors', label: 'Facteurs de risque cardiovasculaire', shortLabel: 'R', options: [{ value: 0, label: 'Aucun facteur connu' }, { value: 1, label: '1 à 2 facteurs' }, { value: 2, label: '≥ 3 facteurs ou antécédent athéroscléreux' }] },
    { id: 'troponin', label: 'Troponine par rapport à la limite supérieure de la normale', shortLabel: 'T', options: [{ value: 0, label: '≤ limite normale' }, { value: 1, label: '> 1 à < 3 × la limite normale' }, { value: 2, label: '≥ 3 × la limite normale' }] },
  ],
}];

export const calculatorDefinitions = definitions.map((definition) => definitionSchema.parse(definition));
export function getCalculatorDefinition(toolId: string) { return calculatorDefinitions.find((definition) => definition.toolId === toolId); }
export function getEmptyValues(definition: CalculatorDefinition): CalculatorValues { return Object.fromEntries(definition.fields.map((field) => [field.id, null])); }
export function isCalculatorComplete(definition: CalculatorDefinition, values: CalculatorValues) { return definition.fields.every((field) => values[field.id] !== null && values[field.id] !== undefined); }

export function calculateAdditiveScore(definition: CalculatorDefinition, values: CalculatorValues) {
  if (!isCalculatorComplete(definition, values)) throw new Error('Tous les critères doivent être renseignés');
  const components = definition.fields.map((field) => {
    const value = values[field.id];
    if (value === null || value === undefined || !field.options.some((option) => option.value === value)) throw new Error(`Valeur invalide : ${field.id}`);
    return { id: field.id, label: field.shortLabel, value };
  });
  const total = components.reduce((sum, component) => sum + component.value, 0);
  if (total < definition.min || total > definition.max) throw new Error('Résultat hors limites');
  const interpretation = definition.ranges?.find((range) => total >= range.min && total <= range.max)?.label;
  return { total, notation: components.map((component) => `${component.label}${component.value}`).join(' '), interpretation };
}
