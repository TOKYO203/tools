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

const yesNo = [{ value: 0, label: 'Non' }, { value: 1, label: 'Oui' }];

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

const psiPort: FormulaDefinition = {
  toolId: 'psi-port',
  resultLabel: 'PSI / PORT',
  resultHint: 'Le PSI estime le risque pronostique d’une pneumonie communautaire. Il complète, sans remplacer, l’évaluation de la gravité immédiate et le jugement clinique.',
  fields: [
    { kind: 'number', id: 'age', label: 'Âge', shortLabel: 'Âge', unit: 'ans', min: 18, max: 120, step: 1, placeholder: 'Ex. 72' },
    { kind: 'choice', id: 'sex', label: 'Sexe', shortLabel: 'Sexe', options: [{ value: 0, label: 'Homme' }, { value: 1, label: 'Femme' }] },
    { kind: 'choice', id: 'nursingHome', label: 'Résident en institution / maison de retraite', shortLabel: 'Institution', options: yesNo },
    { kind: 'choice', id: 'neoplastic', label: 'Maladie néoplasique', shortLabel: 'Cancer', options: yesNo },
    { kind: 'choice', id: 'liver', label: 'Maladie hépatique', shortLabel: 'Foie', options: yesNo },
    { kind: 'choice', id: 'heartFailure', label: 'Insuffisance cardiaque congestive', shortLabel: 'IC', options: yesNo },
    { kind: 'choice', id: 'cerebrovascular', label: 'Maladie cérébrovasculaire', shortLabel: 'Cérébro', options: yesNo },
    { kind: 'choice', id: 'renal', label: 'Maladie rénale', shortLabel: 'Rein', options: yesNo },
    { kind: 'choice', id: 'alteredMental', label: 'Altération de l’état mental', shortLabel: 'Mental', options: yesNo },
    { kind: 'choice', id: 'rr30', label: 'Fréquence respiratoire ≥ 30/min', shortLabel: 'FR', options: yesNo },
    { kind: 'choice', id: 'sbp90', label: 'Pression artérielle systolique < 90 mmHg', shortLabel: 'PAS', options: yesNo },
    { kind: 'choice', id: 'temperature', label: 'Température < 35 °C ou ≥ 40 °C', shortLabel: 'T°', options: yesNo },
    { kind: 'choice', id: 'pulse125', label: 'Fréquence cardiaque ≥ 125/min', shortLabel: 'FC', options: yesNo },
    { kind: 'choice', id: 'ph', label: 'pH artériel < 7,35', shortLabel: 'pH', options: yesNo },
    { kind: 'choice', id: 'bun', label: 'Urée sanguine ≥ 30 mg/dL (≈ 10,7 mmol/L)', shortLabel: 'Urée', options: yesNo },
    { kind: 'choice', id: 'sodium', label: 'Sodium < 130 mmol/L', shortLabel: 'Na', options: yesNo },
    { kind: 'choice', id: 'glucose', label: 'Glucose ≥ 250 mg/dL (≈ 13,9 mmol/L)', shortLabel: 'Glu', options: yesNo },
    { kind: 'choice', id: 'hematocrit', label: 'Hématocrite < 30 %', shortLabel: 'Ht', options: yesNo },
    { kind: 'choice', id: 'oxygen', label: 'PaO₂ < 60 mmHg ou SpO₂ < 90 %', shortLabel: 'O₂', options: yesNo },
    { kind: 'choice', id: 'pleuralEffusion', label: 'Épanchement pleural', shortLabel: 'Plèvre', options: yesNo },
  ],
  calculate(values) {
    const age = required(values.age, 'age');
    const female = required(values.sex, 'sex') === 1;
    const classI = age < 50
      && required(values.neoplastic, 'neoplastic') === 0
      && required(values.liver, 'liver') === 0
      && required(values.heartFailure, 'heartFailure') === 0
      && required(values.cerebrovascular, 'cerebrovascular') === 0
      && required(values.renal, 'renal') === 0
      && required(values.alteredMental, 'alteredMental') === 0
      && required(values.rr30, 'rr30') === 0
      && required(values.sbp90, 'sbp90') === 0
      && required(values.temperature, 'temperature') === 0
      && required(values.pulse125, 'pulse125') === 0;

    if (classI) {
      return { value: 0, display: 'Classe I', interpretation: 'Classe de risque I selon l’étape clinique initiale du PSI.', detail: 'Le calcul numérique complet n’est pas requis pour attribuer la classe I.' };
    }

    let score = age - (female ? 10 : 0);
    score += required(values.nursingHome, 'nursingHome') * 10;
    score += required(values.neoplastic, 'neoplastic') * 30;
    score += required(values.liver, 'liver') * 20;
    score += required(values.heartFailure, 'heartFailure') * 10;
    score += required(values.cerebrovascular, 'cerebrovascular') * 10;
    score += required(values.renal, 'renal') * 10;
    score += required(values.alteredMental, 'alteredMental') * 20;
    score += required(values.rr30, 'rr30') * 20;
    score += required(values.sbp90, 'sbp90') * 20;
    score += required(values.temperature, 'temperature') * 15;
    score += required(values.pulse125, 'pulse125') * 10;
    score += required(values.ph, 'ph') * 30;
    score += required(values.bun, 'bun') * 20;
    score += required(values.sodium, 'sodium') * 20;
    score += required(values.glucose, 'glucose') * 10;
    score += required(values.hematocrit, 'hematocrit') * 10;
    score += required(values.oxygen, 'oxygen') * 10;
    score += required(values.pleuralEffusion, 'pleuralEffusion') * 10;
    const rounded = Math.round(score);
    const riskClass = rounded <= 70 ? 'II' : rounded <= 90 ? 'III' : rounded <= 130 ? 'IV' : 'V';
    return { value: rounded, display: `${rounded} points · Classe ${riskClass}`, interpretation: `Classe de risque ${riskClass} selon le Pneumonia Severity Index.` };
  },
};

export const formulaDefinitions: FormulaDefinition[] = [ckdEpi2021, psiPort];

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
