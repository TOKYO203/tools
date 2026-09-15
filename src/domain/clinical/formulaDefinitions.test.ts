import { describe, expect, it } from 'vitest';
import { calculateFormula, formulaDefinitions, getEmptyFormulaValues, isFormulaComplete } from './formulaDefinitions';

describe('moteur de formules', () => {
  const ckd = formulaDefinitions.find((item) => item.toolId === 'ckd-epi-2021')!;
  const psi = formulaDefinitions.find((item) => item.toolId === 'psi-port')!;
  const bisap = formulaDefinitions.find((item) => item.toolId === 'bisap')!;
  const alvarado = formulaDefinitions.find((item) => item.toolId === 'alvarado')!;
  const timi = formulaDefinitions.find((item) => item.toolId === 'timi-ua-nstemi')!;

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

  it('calcule BISAP de 0 à 5', () => {
    const zero = Object.fromEntries(bisap.fields.map((field) => [field.id, 0]));
    const max = Object.fromEntries(bisap.fields.map((field) => [field.id, 1]));
    expect(calculateFormula(bisap, zero).value).toBe(0);
    expect(calculateFormula(bisap, max).value).toBe(5);
  });

  it('respecte les pondérations du score d’Alvarado', () => {
    const zero = Object.fromEntries(alvarado.fields.map((field) => [field.id, 0]));
    const result = calculateFormula(alvarado, { ...zero, tenderness: 2, leukocytosis: 2, migration: 1, anorexia: 1, nausea: 1, rebound: 1, fever: 1, leftShift: 1 });
    expect(result.value).toBe(10);
    expect(result.interpretation).toContain('élevée');
  });

  it('calcule TIMI UA/NSTEMI de 0 à 7', () => {
    const zero = Object.fromEntries(timi.fields.map((field) => [field.id, 0]));
    const max = Object.fromEntries(timi.fields.map((field) => [field.id, 1]));
    expect(calculateFormula(timi, zero).value).toBe(0);
    expect(calculateFormula(timi, max).value).toBe(7);
  });
});
