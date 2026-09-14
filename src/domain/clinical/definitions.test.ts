import { describe, expect, it } from 'vitest';
import { calculateAdditiveScore, calculatorDefinitions, getEmptyValues, isCalculatorComplete } from './definitions';
import { clinicalRegistry } from './registry';

describe('registre clinique', () => {
  it('ne contient aucun identifiant dupliqué', () => expect(new Set(clinicalRegistry.map((tool) => tool.id)).size).toBe(clinicalRegistry.length));
  it('exige une définition et une source pour chaque outil actif', () => {
    const definitionIds = new Set(calculatorDefinitions.map((item) => item.toolId));
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
    ['curb-65', 5],
    ['wells-pe', 12.5],
  ])('atteint le maximum documenté pour %s', (toolId, maximum) => {
    const item = calculatorDefinitions.find((candidate) => candidate.toolId === toolId)!;
    const values = Object.fromEntries(item.fields.map((field) => [field.id, field.options.at(-1)!.value]));
    expect(calculateAdditiveScore(item, values).total).toBe(maximum);
  });
  it('interprète le modèle de Wells à deux niveaux', () => {
    const item = calculatorDefinitions.find((candidate) => candidate.toolId === 'wells-pe')!;
    const improbable = Object.fromEntries(item.fields.map((field) => [field.id, field.options[0].value]));
    expect(calculateAdditiveScore(item, improbable).interpretation).toContain('improbable');
    const probable = { ...improbable, dvtSigns: 3, alternative: 3 };
    expect(calculateAdditiveScore(item, probable).interpretation).toContain('probable');
  });
});
