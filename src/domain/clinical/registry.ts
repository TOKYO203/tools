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
    id: 'perc', name: 'Règle PERC', acronym: 'PERC', specialty: 'Urgences', summary: 'Identifier, chez un patient à faible probabilité pré-test, si une EP peut être exclue sans D-dimères.', keywords: ['perc', 'embolie', 'pulmonaire', 'ep', 'd-dimères', 'urgence'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '1 min', icon: 'checkmark-done-outline', color: '#087B72', surfaceColor: '#DDF4EC', available: true,
    indications: ['Patient ambulatoire ou consultant aux urgences avec suspicion d’EP et faible probabilité clinique pré-test, selon un parcours validé localement.'],
    limitations: ['Ne pas appliquer si la probabilité clinique pré-test n’est pas faible.', 'Un seul critère positif rend la règle PERC positive.', 'PERC n’est ni un score diagnostique ni une règle adaptée aux patients à probabilité intermédiaire ou élevée.'],
    sources: [{ title: 'Prospective multicenter evaluation of the pulmonary embolism rule-out criteria', citation: 'Kline JA et al. J Thromb Haemost. 2008;6(5):772–780.', url: 'https://pubmed.ncbi.nlm.nih.gov/18318689/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'cha2ds2-vasc', name: 'CHA₂DS₂-VASc', acronym: 'CHA₂DS₂-VASc', specialty: 'Cardiologie', summary: 'Évaluer le risque thromboembolique dans un contexte approprié de fibrillation atriale.', keywords: ['fibrillation', 'atriale', 'avc', 'cardiologie', 'thromboembolique'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-14', duration: '1 min', icon: 'heart-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: true,
    indications: ['Stratification du risque thromboembolique chez les patients présentant une fibrillation atriale non valvulaire, selon le cadre clinique applicable.'],
    limitations: ['Le score ne remplace pas l’évaluation du risque hémorragique ni la décision partagée.', 'Les recommandations contemporaines peuvent employer une variante sans le critère sexe.', 'Ne pas déduire une prescription du seul total.'],
    sources: [{ title: 'Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation', citation: 'Lip GYH et al. Chest. 2010;137(2):263–272.', url: 'https://pubmed.ncbi.nlm.nih.gov/19762550/', accessedAt: '2026-09-14' }],
  },
  {
    id: 'cha2ds2-va', name: 'CHA₂DS₂-VA', acronym: 'CHA₂DS₂-VA', specialty: 'Cardiologie', summary: 'Stratifier le risque thromboembolique en fibrillation atriale sans critère lié au sexe.', keywords: ['fibrillation', 'atriale', 'avc', 'cha2ds2-va', 'anticoagulation', 'thromboembolique'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '1 min', icon: 'heart-circle-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: true,
    indications: ['Aide à la stratification du risque thromboembolique chez les patients avec fibrillation atriale, notamment dans le cadre des recommandations ESC 2024.'],
    limitations: ['Le score ne remplace pas l’évaluation clinique globale ni la décision partagée.', 'Les recommandations locales ou d’autres sociétés savantes peuvent utiliser un autre schéma.', 'Le score ne doit pas être interprété comme une prescription automatique.'],
    sources: [{ title: '2024 ESC Guidelines for the management of atrial fibrillation', citation: 'Van Gelder IC et al. Eur Heart J. 2024;45(36):3314–3414.', url: 'https://academic.oup.com/eurheartj/article/45/36/3314/7738779', accessedAt: '2026-09-15' }],
  },
  {
    id: 'heart-score', name: 'HEART Score', acronym: 'HEART', specialty: 'Cardiologie / Urgences', summary: 'Stratifier le risque d’événement cardiaque chez un patient évalué pour douleur thoracique aux urgences.', keywords: ['heart', 'douleur thoracique', 'troponine', 'ecg', 'syndrome coronarien', 'urgence'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '2 min', icon: 'heart-half-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: true,
    indications: ['Évaluation structurée du risque chez des patients présentant une douleur thoracique aux urgences, dans un protocole adapté au dosage de troponine utilisé.'],
    limitations: ['Le HEART score ne remplace pas l’ECG répété, la cinétique de troponine ni le jugement clinique.', 'Les seuils et algorithmes de troponine doivent suivre le laboratoire et le protocole local.', 'Ne pas utiliser le score pour retarder la prise en charge d’un syndrome coronarien aigu évident.'],
    sources: [{ title: 'Chest pain in the emergency room: a multicenter validation of the HEART Score', citation: 'Backus BE et al. Crit Pathw Cardiol. 2010;9(3):164–169.', url: 'https://pubmed.ncbi.nlm.nih.gov/20802272/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'qsofa', name: 'qSOFA', acronym: 'qSOFA', specialty: 'Urgences / Infectiologie', summary: 'Repérer rapidement un risque accru de mauvaise évolution chez un adulte avec infection suspectée.', keywords: ['qsofa', 'sepsis', 'infection', 'fréquence respiratoire', 'hypotension', 'urgence'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '1 min', icon: 'alert-circle-outline', color: '#B96A12', surfaceColor: '#FFF1D9', available: true,
    indications: ['Évaluation rapide au lit du patient adulte avec infection suspectée, surtout hors réanimation, pour identifier un risque accru de mauvaise évolution.'],
    limitations: ['qSOFA n’est pas la définition du sepsis.', 'Ne pas utiliser qSOFA seul comme outil de dépistage ou pour exclure un sepsis.', 'Une suspicion clinique de sepsis doit conduire à une évaluation complète de la dysfonction d’organe et à une prise en charge sans attendre le score.'],
    sources: [{ title: 'The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3)', citation: 'Singer M et al. JAMA. 2016;315(8):801–810.', url: 'https://jamanetwork.com/journals/jama/fullarticle/2492881', accessedAt: '2026-09-15' }],
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
