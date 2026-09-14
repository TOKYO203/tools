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
  it('calcule les valeurs par défaut', () => expect(calculateAdditiveScore(definition, getDefaultValues(definition))).toEqual({ total: 15, notation: 'E4 V5 M6' }));
  it('rejette une option absente de la définition', () => expect(() => calculateAdditiveScore(definition, { eye: 9, verbal: 5, motor: 6 })).toThrow());
});
