import { describe, expect, it } from 'vitest';
import { calculateHeartRate, calculateQtc, classifyAxis, classifyPr, classifyQrs, getCalibration, summarizeRhythm } from './calculations';

describe('ECG helpers', () => {
  it('calcule la fréquence à 25 mm/s', () => {
    expect(calculateHeartRate('regular', 4, 'large')).toBe(75);
    expect(calculateHeartRate('regular', 20, 'small')).toBe(75);
    expect(calculateHeartRate('irregular', 12)).toBe(72);
  });

  it('calcule QTc Bazett et Fridericia', () => {
    const result = calculateQtc(400, 60);
    expect(result?.bazett).toBe(400);
    expect(result?.fridericia).toBe(400);
  });

  it('classe les axes principaux', () => {
    expect(classifyAxis('positive', 'positive', null)?.title).toBe('Axe normal');
    expect(classifyAxis('positive', 'negative', 'negative')?.title).toBe('Déviation axiale gauche');
    expect(classifyAxis('negative', 'positive', null)?.title).toBe('Déviation axiale droite');
  });

  it('classe PR et QRS sans surinterprétation', () => {
    expect(classifyPr(160)).toContain('120–200');
    expect(classifyPr(220)).toContain('prolongé');
    expect(classifyQrs(100)).toContain('< 120');
    expect(classifyQrs(140)).toContain('élargi');
  });

  it('retourne les dimensions de calibration', () => {
    expect(getCalibration(25, 10)).toEqual({ smallBoxMs: 40, largeBoxMs: 200, smallBoxMv: 0.1, tenMmMv: 1 });
    expect(getCalibration(50, 10).smallBoxMs).toBe(20);
  });

  it('ne qualifie le profil sinusal que si tous les critères concordent', () => {
    expect(summarizeRhythm({ regular: 'yes', pBeforeEachQrs: 'yes', qrsAfterEachP: 'yes', prConstant: 'yes', pPattern: 'sinus-compatible' }).level).toBe('compatible');
    expect(summarizeRhythm({ regular: 'yes', pBeforeEachQrs: 'yes', qrsAfterEachP: 'no', prConstant: 'yes', pPattern: 'sinus-compatible' }).level).toBe('review');
    expect(summarizeRhythm({ regular: 'unknown', pBeforeEachQrs: 'yes', qrsAfterEachP: 'yes', prConstant: 'yes', pPattern: 'sinus-compatible' }).level).toBe('pending');
  });
});
