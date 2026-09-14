import { z } from 'zod';

const optionSchema = z.object({ value: z.number(), label: z.string().min(1) });
const fieldSchema = z.object({ id: z.string().min(1), label: z.string().min(1), shortLabel: z.string().min(1), options: z.array(optionSchema).min(2) });
const rangeSchema = z.object({ min: z.number(), max: z.number(), label: z.string().min(1) });
const definitionSchema = z.object({ toolId: z.string().min(1), fields: z.array(fieldSchema).min(1), min: z.number(), max: z.number(), ranges: z.array(rangeSchema).optional(), resultHint: z.string().min(1) });

export type CalculatorDefinition = z.infer<typeof definitionSchema>;
export type CalculatorValues = Record<string, number>;

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
}];

export const calculatorDefinitions = definitions.map((definition) => definitionSchema.parse(definition));
export function getCalculatorDefinition(toolId: string) { return calculatorDefinitions.find((definition) => definition.toolId === toolId); }
export function getDefaultValues(definition: CalculatorDefinition): CalculatorValues { return Object.fromEntries(definition.fields.map((field) => [field.id, field.options[0].value])); }

export function calculateAdditiveScore(definition: CalculatorDefinition, values: CalculatorValues) {
  const components = definition.fields.map((field) => {
    const value = values[field.id];
    if (!field.options.some((option) => option.value === value)) throw new Error(`Valeur invalide : ${field.id}`);
    return { id: field.id, label: field.shortLabel, value };
  });
  const total = components.reduce((sum, component) => sum + component.value, 0);
  if (total < definition.min || total > definition.max) throw new Error('Résultat hors limites');
  const interpretation = definition.ranges?.find((range) => total >= range.min && total <= range.max)?.label;
  return { total, notation: components.map((component) => `${component.label}${component.value}`).join(' '), interpretation };
}
