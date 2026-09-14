import { z } from 'zod';

const optionSchema = z.object({ value: z.number().int(), label: z.string().min(1) });
const fieldSchema = z.object({ id: z.string().min(1), label: z.string().min(1), shortLabel: z.string().min(1), options: z.array(optionSchema).min(2) });
const definitionSchema = z.object({ toolId: z.string().min(1), fields: z.array(fieldSchema).min(1), min: z.number(), max: z.number() });

export type CalculatorDefinition = z.infer<typeof definitionSchema>;
export type CalculatorValues = Record<string, number>;

const definitions: CalculatorDefinition[] = [{
  toolId: 'glasgow-coma-scale', min: 3, max: 15,
  fields: [
    { id: 'eye', label: 'Ouverture des yeux', shortLabel: 'E', options: [{ value: 4, label: 'Spontanée' }, { value: 3, label: 'Au son' }, { value: 2, label: 'À la pression' }, { value: 1, label: 'Aucune' }] },
    { id: 'verbal', label: 'Réponse verbale', shortLabel: 'V', options: [{ value: 5, label: 'Orientée' }, { value: 4, label: 'Confuse' }, { value: 3, label: 'Mots' }, { value: 2, label: 'Sons' }, { value: 1, label: 'Aucune' }] },
    { id: 'motor', label: 'Réponse motrice', shortLabel: 'M', options: [{ value: 6, label: 'Obéit aux consignes' }, { value: 5, label: 'Localise' }, { value: 4, label: 'Flexion normale' }, { value: 3, label: 'Flexion anormale' }, { value: 2, label: 'Extension' }, { value: 1, label: 'Aucune' }] },
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
  return { total, notation: components.map((component) => `${component.label}${component.value}`).join(' ') };
}
