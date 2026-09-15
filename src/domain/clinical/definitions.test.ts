import { describe, expect, it } from 'vitest';
import { calculateAdditiveScore, calculatorDefinitions, getEmptyValues, isCalculatorComplete } from './definitions';
import { formulaDefinitions } from './formulaDefinitions';
import { clinicalRegistry } from './registry';

describe('registre clinique', () => {
  it('ne contient aucun identifiant dupliqué', () => expect(new Set(clinicalRegistry.map((tool) => tool.id)).size).toBe(clinicalRegistry.length));
  it('exige une définition et une source pour chaque outil actif', () => {
    const definitionIds = new Set([...calculatorDefinitions.map((item) => item.toolId), ...formulaDefinitions.map((item) => item.toolId)]);
    for (const tool of clinicalRegistry.filter((item) => item.available)) {
      expect(definitionIds.has(tool.id)).toBe(true);
      expect(tool.sources.length).toBeGreaterThan(0);
      expect(tool.status).toBe('validated');
    }
  });
});

describe('moteur additif', () => {
  const definition = calculatorDefinitions[0];
  it('démarre sans réponse implicite', () => {
    const values = getEmptyValues(definition);
    expect(isCalculatorComplete(definition, values)).toBe(false);
    expect(() => calculateAdditiveScore(definition, values)).toThrow('Tous les critères');
  });
  it('rejette une option absente de la définition', () => expect(() => calculateAdditiveScore(definition, { eye: 9, verbal: 5, motor: 6 })).toThrow());
  it.each([
    ['cha2ds2-vasc', 9],
    ['cha2ds2-va', 8],
    ['has-bled', 9],
    ['curb-65', 5],
    ['wells-pe', 12.5],
    ['qsofa', 3],
    ['perc', 8],
    ['heart-score', 10],
    ['abcd2', 7],
    ['rcri', 6],
    ['nihss', 42],
  ])('atteint le maximum documenté pour %s', (toolId, maximum) => {
    const item = calculatorDefinitions.find((candidate) => candidate.toolId === toolId)!;
    const values = Object.fromEntries(item.fields.map((field) => [field.id, Math.max(...field.options.map((option) => option.value))]));
    expect(calculateAdditiveScore(item, values).total).toBe(maximum);
  });
  it('gère la pondération négative de l’âge dans McIsaac', () => {
    const item = calculatorDefinitions.find((candidate) => candidate.toolId === 'mcisaac')!;
    const zeroClinical = { fever: 0, tonsils: 0, nodes: 0, cough: 0, age: -1 };
    expect(calculateAdditiveScore(item, zeroClinical).total).toBe(-1);
    expect(calculateAdditiveScore(item, { fever: 1, tonsils: 1, nodes: 1, cough: 1, age: 1 }).total).toBe(5);
  });
  it('interprète le modèle de Wells à deux niveaux', () => {
    const item = calculatorDefinitions.find((candidate) => candidate.toolId === 'wells-pe')!;
    const improbable = Object.fromEntries(item.fields.map((field) => [field.id, field.options[0].value]));
    expect(calculateAdditiveScore(item, improbable).interpretation).toContain('improbable');
    const probable = { ...improbable, dvtSigns: 3, alternative: 3 };
    expect(calculateAdditiveScore(item, probable).interpretation).toContain('probable');
  });
  it('rend PERC négatif uniquement si aucun critère n’est positif', () => {
    const item = calculatorDefinitions.find((candidate) => candidate.toolId === 'perc')!;
    const negative = Object.fromEntries(item.fields.map((field) => [field.id, 0]));
    expect(calculateAdditiveScore(item, negative).interpretation).toContain('négatif');
    expect(calculateAdditiveScore(item, { ...negative, age: 1 }).interpretation).toContain('positif');
  });
  it('classe HEART en trois groupes', () => {
    const item = calculatorDefinitions.find((candidate) => candidate.toolId === 'heart-score')!;
    const zero = Object.fromEntries(item.fields.map((field) => [field.id, 0]));
    expect(calculateAdditiveScore(item, zero).interpretation).toContain('faible');
    expect(calculateAdditiveScore(item, { ...zero, history: 2, ecg: 2 }).interpretation).toContain('intermédiaire');
    expect(calculateAdditiveScore(item, { ...zero, history: 2, ecg: 2, age: 2, riskFactors: 1 }).interpretation).toContain('élevé');
  });
});
