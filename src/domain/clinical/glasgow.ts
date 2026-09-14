export type GlasgowInput = { eye: number; verbal: number; motor: number };
export function calculateGlasgow({ eye, verbal, motor }: GlasgowInput) {
  if (!Number.isInteger(eye) || eye < 1 || eye > 4) throw new Error('Réponse oculaire invalide');
  if (!Number.isInteger(verbal) || verbal < 1 || verbal > 5) throw new Error('Réponse verbale invalide');
  if (!Number.isInteger(motor) || motor < 1 || motor > 6) throw new Error('Réponse motrice invalide');
  return { total: eye + verbal + motor, notation: `E${eye} V${verbal} M${motor}` };
}
