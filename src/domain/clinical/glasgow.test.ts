import { describe, expect, it } from 'vitest';
import { calculateGlasgow } from './glasgow';
describe('calculateGlasgow', () => {
  it('calcule la valeur maximale et conserve les composantes', () => expect(calculateGlasgow({ eye: 4, verbal: 5, motor: 6 })).toEqual({ total: 15, notation: 'E4 V5 M6' }));
  it('calcule la valeur minimale', () => expect(calculateGlasgow({ eye: 1, verbal: 1, motor: 1 }).total).toBe(3));
  it('rejette une composante hors limites', () => expect(() => calculateGlasgow({ eye: 5, verbal: 5, motor: 6 })).toThrow());
});
