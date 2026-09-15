import { describe, expect, it } from 'vitest';
import { calculateFormula, formulaDefinitions, getEmptyFormulaValues, isFormulaComplete } from './formulaDefinitions';

describe('moteur de formules', () => {
  const ckd = formulaDefinitions.find((item) => item.toolId === 'ckd-epi-2021')!;
  const psi = formulaDefinitions.find((item) => item.toolId === 'psi-port')!;

  it('ne présélectionne aucune donnée', () => {
    const values = getEmptyFormulaValues(ckd);
    expect(isFormulaComplete(ckd, values)).toBe(false);
    expect(() => calculateFormula(ckd, values)).toThrow('Tous les champs');
  });

  it('calcule CKD-EPI 2021 en mg/dL', () => {
    const result = calculateFormula(ckd, { age: 60, sex: 0, creatinine: 1, creatinineUnit: 0 });
    expect(result.value).toBe(86);
  });

  it('convertit correctement la créatinine µmol/L', () => {
    const result = calculateFormula(ckd, { age: 40, sex: 0, creatinine: 97, creatinineUnit: 1 });
    expect(result.value).toBe(87);
    expect(result.detail).toContain('1.10 mg/dL');
  });

  it('applique le coefficient féminin de l’équation 2021', () => {
    const result = calculateFormula(ckd, { age: 60, sex: 1, creatinine: 1, creatinineUnit: 0 });
    expect(result.value).toBe(64);
  });

  it('classe un adulte jeune sans facteur défavorable en PSI classe I', () => {
    const values = Object.fromEntries(psi.fields.map((field) => [field.id, field.kind === 'number' ? 40 : 0]));
    const result = calculateFormula(psi, values);
    expect(result.display).toBe('Classe I');
  });

  it('classe un PSI numérique selon les seuils PORT', () => {
    const values = Object.fromEntries(psi.fields.map((field) => [field.id, field.kind === 'number' ? 80 : 0]));
    const result = calculateFormula(psi, values);
    expect(result.value).toBe(80);
    expect(result.display).toContain('Classe III');
  });

  it('classe un PSI très élevé en classe V', () => {
    const values = Object.fromEntries(psi.fields.map((field) => [field.id, field.kind === 'number' ? 80 : 0]));
    const result = calculateFormula(psi, { ...values, neoplastic: 1, ph: 1, bun: 1 });
    expect(result.value).toBe(160);
    expect(result.display).toContain('Classe V');
  });
});
