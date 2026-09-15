import { describe, expect, it } from 'vitest';
import { calculateFormula, formulaDefinitions, getEmptyFormulaValues, isFormulaComplete } from './formulaDefinitions';

describe('moteur de formules', () => {
  const ckd = formulaDefinitions.find((item) => item.toolId === 'ckd-epi-2021')!;

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
});
