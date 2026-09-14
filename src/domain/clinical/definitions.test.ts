import { describe, expect, it } from 'vitest';
import { calculateAdditiveScore, calculatorDefinitions, getDefaultValues } from './definitions';
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
  it('calcule les valeurs par défaut', () => expect(calculateAdditiveScore(definition, getDefaultValues(definition))).toEqual({ total: 15, notation: 'E4 V5 M6', interpretation: undefined }));
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
    expect(calculateAdditiveScore(item, getDefaultValues(item)).interpretation).toContain('improbable');
    const probable = { ...getDefaultValues(item), dvtSigns: 3, alternative: 3 };
    expect(calculateAdditiveScore(item, probable).interpretation).toContain('probable');
  });
});
