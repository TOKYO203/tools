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
  {
    id: 'wells-pe', name: 'Score de Wells — EP', acronym: 'Wells EP', specialty: 'Urgences', summary: 'Stratifier la probabilité clinique pré-test d’embolie pulmonaire.', keywords: ['embolie', 'pulmonaire', 'wells', 'ep', 'tvp'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-14', duration: '2 min', icon: 'fitness-outline', color: '#087B72', surfaceColor: '#DDF4EC', available: true,
    indications: ['Estimation de la probabilité clinique pré-test d’EP chez un patient évalué pour une suspicion d’EP.'],
    limitations: ['Le critère « EP plus probable » repose sur le jugement clinique.', 'Ne pas utiliser isolément pour confirmer ou exclure une EP.', 'Appliquer le modèle et le parcours diagnostique validés localement.'],
    sources: [{ title: 'Derivation of a simple clinical model to categorize patients probability of pulmonary embolism', citation: 'Wells PS et al. Thromb Haemost. 2000;83(3):416–420.', url: 'https://pubmed.ncbi.nlm.nih.gov/10744147/', accessedAt: '2026-09-14' }],
  },
  {
    id: 'cha2ds2-vasc', name: 'CHA₂DS₂-VASc', acronym: 'CHA₂DS₂-VASc', specialty: 'Cardiologie', summary: 'Évaluer le risque thromboembolique dans un contexte approprié de fibrillation atriale.', keywords: ['fibrillation', 'atriale', 'avc', 'cardiologie', 'thromboembolique'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-14', duration: '1 min', icon: 'heart-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: true,
    indications: ['Stratification du risque thromboembolique chez les patients présentant une fibrillation atriale non valvulaire, selon le cadre clinique applicable.'],
    limitations: ['Le score ne remplace pas l’évaluation du risque hémorragique ni la décision partagée.', 'Les recommandations contemporaines peuvent employer une variante sans le critère sexe.', 'Ne pas déduire une prescription du seul total.'],
    sources: [{ title: 'Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation', citation: 'Lip GYH et al. Chest. 2010;137(2):263–272.', url: 'https://pubmed.ncbi.nlm.nih.gov/19762550/', accessedAt: '2026-09-14' }],
  },
  {
    id: 'curb-65', name: 'CURB-65', acronym: 'CURB-65', specialty: 'Pneumologie', summary: 'Évaluer la sévérité pronostique d’une pneumonie communautaire.', keywords: ['pneumonie', 'curb', 'respiratoire', 'sévérité'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-14', duration: '1 min', icon: 'cloud-outline', color: '#B96A12', surfaceColor: '#FFF1D9', available: true,
    indications: ['Évaluation pronostique initiale d’un adulte présentant une pneumonie communautaire.'],
    limitations: ['Ne remplace pas le jugement clinique ni l’identification immédiate d’une détresse vitale.', 'L’urée doit être exprimée en mmol/L et vérifiée avant validation.', 'La conduite dépend aussi des comorbidités, du contexte social et des protocoles locaux.'],
    sources: [{ title: 'Defining community acquired pneumonia severity on presentation to hospital', citation: 'Lim WS et al. Thorax. 2003;58(5):377–382.', url: 'https://pubmed.ncbi.nlm.nih.gov/12728155/', accessedAt: '2026-09-14' }],
  },
];

export function searchClinicalTools(query: string) {
  const needle = query.trim().toLocaleLowerCase('fr');
  if (!needle) return clinicalRegistry;
  return clinicalRegistry.filter((tool) => [tool.name, tool.acronym, tool.specialty, ...tool.keywords]
    .some((value) => value.toLocaleLowerCase('fr').includes(needle)));
}
