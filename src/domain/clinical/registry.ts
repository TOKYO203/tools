import { ClinicalTool } from './types';

export const clinicalRegistry: ClinicalTool[] = [
  {
    id: 'glasgow-coma-scale', name: 'Échelle de Glasgow', acronym: 'GCS', specialty: 'Neurologie',
    summary: 'Décrire le niveau de conscience par les réponses oculaire, verbale et motrice.',
    keywords: ['glasgow', 'gcs', 'coma', 'conscience', 'traumatisme crânien'], risk: 'B', status: 'validated',
    version: '1.0.0', reviewedAt: '2026-09-14', duration: '1 min', icon: 'pulse-outline', color: '#6553C6', surfaceColor: '#EEEAFE', available: true,
    indications: ['Évaluation structurée de la réactivité après une lésion cérébrale aiguë.', 'Communication et suivi de l’évolution des réponses.'],
    limitations: ['Rapporter les trois composantes séparément en plus du total.', 'Cet outil complète l’examen neurologique ; il ne le remplace pas.'],
    sources: [{ title: 'What is the Glasgow Coma Scale?', citation: 'Teasdale G, Jennett B. Lancet. 1974;2:81–84.', url: 'https://www.glasgowcomascale.org/what-is-gcs/', accessedAt: '2026-09-14' }],
  },
  { id: 'ckd-epi-2021', name: 'DFG estimé CKD-EPI', acronym: 'CKD-EPI', specialty: 'Néphrologie', summary: 'Estimer le débit de filtration glomérulaire chez l’adulte.', keywords: ['rein', 'créatinine', 'dfg', 'egfr'], risk: 'B', status: 'review_due', version: '0.1.0', reviewedAt: '—', duration: '1 min', icon: 'water-outline', color: '#246BFD', surfaceColor: '#E7EEFF', available: false, indications: [], limitations: [], sources: [] },
  { id: 'wells-pe', name: 'Score de Wells — EP', acronym: 'Wells EP', specialty: 'Urgences', summary: 'Stratifier la probabilité clinique d’embolie pulmonaire.', keywords: ['embolie', 'pulmonaire', 'wells', 'ep'], risk: 'B', status: 'review_due', version: '0.1.0', reviewedAt: '—', duration: '2 min', icon: 'fitness-outline', color: '#087B72', surfaceColor: '#DDF4EC', available: false, indications: [], limitations: [], sources: [] },
  { id: 'cha2ds2-vasc', name: 'CHA₂DS₂-VASc', acronym: 'CHA₂DS₂-VASc', specialty: 'Cardiologie', summary: 'Évaluer le risque thromboembolique dans un contexte approprié de fibrillation atriale.', keywords: ['fibrillation', 'atriale', 'avc', 'cardiologie'], risk: 'B', status: 'review_due', version: '0.1.0', reviewedAt: '—', duration: '1 min', icon: 'heart-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: false, indications: [], limitations: [], sources: [] },
  { id: 'curb-65', name: 'CURB-65', acronym: 'CURB-65', specialty: 'Pneumologie', summary: 'Score pronostique utilisé dans la pneumonie communautaire.', keywords: ['pneumonie', 'curb', 'respiratoire'], risk: 'B', status: 'review_due', version: '0.1.0', reviewedAt: '—', duration: '1 min', icon: 'cloud-outline', color: '#B96A12', surfaceColor: '#FFF1D9', available: false, indications: [], limitations: [], sources: [] },
];

export function searchClinicalTools(query: string) {
  const needle = query.trim().toLocaleLowerCase('fr');
  if (!needle) return clinicalRegistry;
  return clinicalRegistry.filter((tool) => [tool.name, tool.acronym, tool.specialty, ...tool.keywords]
    .some((value) => value.toLocaleLowerCase('fr').includes(needle)));
}
