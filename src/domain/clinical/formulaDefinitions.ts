export type FormulaValues = Record<string, number | null>;

export type FormulaNumberField = {
  kind: 'number';
  id: string;
  label: string;
  shortLabel: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
};

export type FormulaChoiceField = {
  kind: 'choice';
  id: string;
  label: string;
  shortLabel: string;
  options: { value: number; label: string }[];
};

export type FormulaField = FormulaNumberField | FormulaChoiceField;

export type FormulaResult = {
  value: number;
  display: string;
  interpretation?: string;
  detail?: string;
};

export type FormulaDefinition = {
  toolId: string;
  resultLabel: string;
  resultHint: string;
  fields: FormulaField[];
  calculate: (values: FormulaValues) => FormulaResult;
};

const ckdEpi2021: FormulaDefinition = {
  toolId: 'ckd-epi-2021',
  resultLabel: 'DFG ESTIMÉ',
  resultHint: 'Le DFG estimé doit être interprété avec la chronicité, l’albuminurie, le contexte clinique et les limites de la créatinine.',
  fields: [
    { kind: 'number', id: 'age', label: 'Âge', shortLabel: 'Âge', unit: 'ans', min: 18, max: 120, step: 1, placeholder: 'Ex. 64' },
    { kind: 'choice', id: 'sex', label: 'Sexe utilisé par l’équation', shortLabel: 'Sexe', options: [{ value: 0, label: 'Homme' }, { value: 1, label: 'Femme' }] },
    { kind: 'number', id: 'creatinine', label: 'Créatinine sérique', shortLabel: 'Créat', unit: 'valeur', min: 0.1, max: 3000, step: 0.1, placeholder: 'Ex. 1,1 ou 97' },
    { kind: 'choice', id: 'creatinineUnit', label: 'Unité de créatinine', shortLabel: 'Unité', options: [{ value: 0, label: 'mg/dL' }, { value: 1, label: 'µmol/L' }] },
  ],
  calculate(values) {
    const age = required(values.age, 'age');
    const sex = required(values.sex, 'sex');
    const rawCreatinine = required(values.creatinine, 'creatinine');
    const unit = required(values.creatinineUnit, 'creatinineUnit');
    const creatinineMgDl = unit === 1 ? rawCreatinine / 88.4 : rawCreatinine;
    if (age < 18 || age > 120) throw new Error('Âge hors limites');
    if (creatinineMgDl <= 0 || creatinineMgDl > 30) throw new Error('Créatinine hors limites plausibles');

    const female = sex === 1;
    const kappa = female ? 0.7 : 0.9;
    const alpha = female ? -0.241 : -0.302;
    const ratio = creatinineMgDl / kappa;
    const egfr = 142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2) * Math.pow(0.9938, age) * (female ? 1.012 : 1);
    const rounded = Math.round(egfr);
    return {
      value: rounded,
      display: `${rounded} mL/min/1,73 m²`,
      interpretation: classifyGfr(rounded),
      detail: `Créatinine utilisée : ${creatinineMgDl.toFixed(2)} mg/dL`,
    };
  },
};

export const formulaDefinitions: FormulaDefinition[] = [ckdEpi2021];

export function getFormulaDefinition(toolId: string) {
  return formulaDefinitions.find((definition) => definition.toolId === toolId);
}

export function getEmptyFormulaValues(definition: FormulaDefinition): FormulaValues {
  return Object.fromEntries(definition.fields.map((field) => [field.id, null]));
}

export function isFormulaComplete(definition: FormulaDefinition, values: FormulaValues) {
  return definition.fields.every((field) => values[field.id] !== null && values[field.id] !== undefined);
}

export function calculateFormula(definition: FormulaDefinition, values: FormulaValues) {
  if (!isFormulaComplete(definition, values)) throw new Error('Tous les champs doivent être renseignés');
  for (const field of definition.fields) {
    const value = values[field.id];
    if (value === null || value === undefined) throw new Error(`Valeur manquante : ${field.id}`);
    if (field.kind === 'number' && (value < field.min || value > field.max)) throw new Error(`Valeur hors limites : ${field.id}`);
    if (field.kind === 'choice' && !field.options.some((option) => option.value === value)) throw new Error(`Valeur invalide : ${field.id}`);
  }
  return definition.calculate(values);
}

function required(value: number | null | undefined, id: string) {
  if (value === null || value === undefined || !Number.isFinite(value)) throw new Error(`Valeur invalide : ${id}`);
  return value;
}

function classifyGfr(value: number) {
  if (value >= 90) return 'Catégorie G1 (≥ 90) — une maladie rénale chronique ne se diagnostique pas sur ce chiffre seul.';
  if (value >= 60) return 'Catégorie G2 (60–89) — interpréter avec albuminurie et autres marqueurs rénaux.';
  if (value >= 45) return 'Catégorie G3a (45–59).';
  if (value >= 30) return 'Catégorie G3b (30–44).';
  if (value >= 15) return 'Catégorie G4 (15–29).';
  return 'Catégorie G5 (< 15).';
}
