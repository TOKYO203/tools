export type RateMode = 'regular' | 'irregular';
export type RateUnit = 'large' | 'small';
export type Polarity = 'positive' | 'negative' | 'isoelectric';
export type RhythmAnswer = 'yes' | 'no' | 'unknown';
export type PWavePattern = 'sinus-compatible' | 'atypical' | 'unknown';

export function calculateHeartRate(mode: RateMode, value: number, unit: RateUnit = 'large') {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (mode === 'irregular') {
    if (value < 1 || value > 50) return null;
    return Math.round(value * 6);
  }
  if (unit === 'large') {
    if (value < 0.5 || value > 30) return null;
    return Math.round(300 / value);
  }
  if (value < 2.5 || value > 150) return null;
  return Math.round(1500 / value);
}

export function calculateQtc(qtMs: number, heartRate: number) {
  if (!Number.isFinite(qtMs) || !Number.isFinite(heartRate)) return null;
  if (qtMs < 150 || qtMs > 700 || heartRate < 20 || heartRate > 250) return null;
  const rrSeconds = 60 / heartRate;
  return {
    rrSeconds,
    bazett: Math.round(qtMs / Math.sqrt(rrSeconds)),
    fridericia: Math.round(qtMs / Math.cbrt(rrSeconds)),
  };
}

export function classifyAxis(leadI: Polarity | null, avf: Polarity | null, leadII: Polarity | null) {
  if (!leadI || !avf) return null;
  if (leadI === 'isoelectric' || avf === 'isoelectric') {
    return { title: 'Axe à préciser', detail: 'Une dérivation principale est isoélectrique : compléter par la méthode hexaxiale/perpendiculaire.' };
  }
  if (leadI === 'positive' && avf === 'positive') return { title: 'Axe normal', detail: 'Quadrant estimé entre 0° et +90°.' };
  if (leadI === 'negative' && avf === 'positive') return { title: 'Déviation axiale droite', detail: 'Quadrant estimé entre +90° et +180°.' };
  if (leadI === 'negative' && avf === 'negative') return { title: 'Axe extrême', detail: 'Quadrant supérieur droit. Vérifier aussi le placement des électrodes et le contexte.' };
  if (!leadII) return null;
  if (leadII === 'isoelectric') return { title: 'Axe proche de −30°', detail: 'Lead I positif, aVF négatif et II isoélectrique : axe voisin de la limite adulte à −30°.' };
  if (leadII === 'positive') return { title: 'Axe dans la plage adulte usuelle', detail: 'Axe estimé entre environ −30° et 0°.' };
  return { title: 'Déviation axiale gauche', detail: 'Lead I positif, aVF négatif et II négatif : axe inférieur à −30°.' };
}

export function classifyPr(value: number) {
  if (!Number.isFinite(value) || value < 60 || value > 500) return null;
  if (value < 120) return 'PR court (< 120 ms)';
  if (value <= 200) return 'PR dans le repère usuel 120–200 ms';
  return 'PR prolongé (> 200 ms)';
}

export function classifyQrs(value: number) {
  if (!Number.isFinite(value) || value < 40 || value > 400) return null;
  return value < 120 ? 'Durée QRS < 120 ms' : 'QRS élargi (≥ 120 ms) — morphologie à analyser';
}

export function getCalibration(speedMmPerSec: 25 | 50, gainMmPerMv: 5 | 10 | 20) {
  return {
    smallBoxMs: 1000 / speedMmPerSec,
    largeBoxMs: 5000 / speedMmPerSec,
    smallBoxMv: 1 / gainMmPerMv,
    tenMmMv: 10 / gainMmPerMv,
  };
}

export function summarizeRhythm(input: {
  regular: RhythmAnswer;
  pBeforeEachQrs: RhythmAnswer;
  qrsAfterEachP: RhythmAnswer;
  prConstant: RhythmAnswer;
  pPattern: PWavePattern;
}) {
  const unanswered = Object.values(input).some((value) => value === 'unknown');
  if (unanswered) {
    return { level: 'pending' as const, title: 'Analyse incomplète', detail: 'Complétez chaque critère avant de décrire le rythme.' };
  }
  const sinusCompatible = input.regular === 'yes' && input.pBeforeEachQrs === 'yes' && input.qrsAfterEachP === 'yes' && input.prConstant === 'yes' && input.pPattern === 'sinus-compatible';
  if (sinusCompatible) {
    return { level: 'compatible' as const, title: 'Profil compatible avec un rythme sinusal régulier', detail: 'À confirmer sur le tracé complet et dans le contexte clinique. Cet assistant ne pose pas de diagnostic de rythme.' };
  }
  return { level: 'review' as const, title: 'Rythme à décrire et analyser', detail: 'Au moins un critère n’est pas compatible avec le profil sinusal régulier. Décrivez précisément la régularité, les ondes P et la relation P–QRS avant toute conclusion.' };
}
