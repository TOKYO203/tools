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
  {
    id: 'nihss', name: 'NIH Stroke Scale', acronym: 'NIHSS', specialty: 'Neurologie / Urgences',
    summary: 'Quantifier de façon standardisée le déficit neurologique lors d’un AVC aigu.',
    keywords: ['nihss', 'avc', 'stroke', 'neurologie', 'déficit neurologique', 'thrombolyse', 'thrombectomie'], risk: 'B', status: 'validated',
    version: '1.0.0', reviewedAt: '2026-09-15', duration: '4 min', icon: 'body-outline', color: '#6553C6', surfaceColor: '#EEEAFE', available: true,
    indications: ['Évaluation initiale et suivi standardisé de la sévérité neurologique chez un patient avec AVC suspecté ou confirmé.'],
    limitations: ['Doit être coté selon les instructions standardisées, idéalement par un évaluateur formé.', 'Les déficits de circulation postérieure peuvent être sous-représentés par le score.', 'Si un item est réellement non testable, il doit être documenté comme tel selon le protocole NIHSS et ne pas être arbitrairement coté 0.', 'Le NIHSS ne décide pas à lui seul de l’éligibilité à une reperfusion.'],
    sources: [{ title: 'Measurements of acute cerebral infarction: a clinical examination scale', citation: 'Brott T et al. Stroke. 1989;20(7). PMID: 2749846.', url: 'https://pubmed.ncbi.nlm.nih.gov/2749846/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'abcd2', name: 'ABCD₂', acronym: 'ABCD₂', specialty: 'Neurologie / Urgences',
    summary: 'Estimer le risque précoce d’AVC après un accident ischémique transitoire suspecté.',
    keywords: ['abcd2', 'ait', 'tia', 'avc', 'neurologie', 'ischémie transitoire'], risk: 'B', status: 'validated',
    version: '1.0.0', reviewedAt: '2026-09-15', duration: '1 min', icon: 'timer-outline', color: '#6553C6', surfaceColor: '#EEEAFE', available: true,
    indications: ['Stratification pronostique après un AIT cliniquement suspecté, en complément d’une évaluation urgente.'],
    limitations: ['Un score faible ne permet pas de rassurer à lui seul ni d’exclure un mécanisme à haut risque.', 'Ne doit pas retarder l’imagerie, l’évaluation vasculaire ou l’avis spécialisé lorsque l’AIT est suspecté.', 'Le score n’est pas conçu pour confirmer le diagnostic d’AIT.'],
    sources: [{ title: 'Validation and refinement of scores to predict very early stroke risk after transient ischaemic attack', citation: 'Johnston SC et al. Lancet. 2007;369(9558). PMID: 17258668.', url: 'https://pubmed.ncbi.nlm.nih.gov/17258668/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'ckd-epi-2021', name: 'DFG estimé CKD-EPI', acronym: 'CKD-EPI 2021', specialty: 'Néphrologie',
    summary: 'Estimer le débit de filtration glomérulaire chez l’adulte avec l’équation CKD-EPI créatinine 2021 sans critère de race.',
    keywords: ['rein', 'créatinine', 'dfg', 'egfr', 'ckd-epi', 'néphrologie'], risk: 'B', status: 'validated',
    version: '1.0.0', reviewedAt: '2026-09-15', duration: '1 min', icon: 'water-outline', color: '#246BFD', surfaceColor: '#E7EEFF', available: true,
    indications: ['Estimation du DFG chez l’adulte âgé de 18 ans ou plus à partir d’une créatinine sérique standardisée.'],
    limitations: ['Le DFG estimé n’est pas une mesure directe du DFG.', 'Interpréter avec prudence lorsque la créatinine n’est pas à l’état stable, notamment en insuffisance rénale aiguë.', 'Les situations modifiant fortement la production de créatinine peuvent réduire la précision ; une estimation avec cystatine C peut être utile selon le contexte.', 'Une catégorie de DFG isolée ne suffit pas à diagnostiquer une maladie rénale chronique : tenir compte de la chronicité et de l’albuminurie.'],
    sources: [{ title: 'New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race', citation: 'Inker LA et al. N Engl J Med. 2021. PMID: 34554658.', url: 'https://pubmed.ncbi.nlm.nih.gov/34554658/', accessedAt: '2026-09-15' }, { title: '2021 CKD-EPI Creatinine Equation', citation: 'National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK).', url: 'https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/glomerular-filtration-rate-equations/adults', accessedAt: '2026-09-15' }],
  },
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
    id: 'has-bled', name: 'HAS-BLED', acronym: 'HAS-BLED', specialty: 'Cardiologie', summary: 'Structurer l’évaluation du risque hémorragique chez un patient avec fibrillation atriale.', keywords: ['has-bled', 'saignement', 'hémorragie', 'anticoagulation', 'fibrillation atriale', 'inr'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '2 min', icon: 'water-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: true,
    indications: ['Évaluation structurée des facteurs de risque hémorragique chez des patients avec fibrillation atriale, notamment sous traitement antithrombotique.'],
    limitations: ['Un score élevé ne doit pas être utilisé seul pour refuser une anticoagulation indiquée.', 'Le score sert notamment à repérer les facteurs modifiables et à intensifier la surveillance.', 'Pour la fonction rénale, hépatique, l’INR labile, les médicaments et l’alcool, appliquer les définitions opérationnelles du schéma HAS-BLED utilisé localement.'],
    sources: [{ title: 'A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation', citation: 'Pisters R et al. Chest. 2010;138(5). PMID: 20299623.', url: 'https://pubmed.ncbi.nlm.nih.gov/20299623/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'heart-score', name: 'HEART Score', acronym: 'HEART', specialty: 'Cardiologie / Urgences', summary: 'Stratifier le risque d’événement cardiaque chez un patient évalué pour douleur thoracique aux urgences.', keywords: ['heart', 'douleur thoracique', 'troponine', 'ecg', 'syndrome coronarien', 'urgence'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '2 min', icon: 'heart-half-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: true,
    indications: ['Évaluation structurée du risque chez des patients présentant une douleur thoracique aux urgences, dans un protocole adapté au dosage de troponine utilisé.'],
    limitations: ['Le HEART score ne remplace pas l’ECG répété, la cinétique de troponine ni le jugement clinique.', 'Les seuils et algorithmes de troponine doivent suivre le laboratoire et le protocole local.', 'Ne pas utiliser le score pour retarder la prise en charge d’un syndrome coronarien aigu évident.'],
    sources: [{ title: 'Chest pain in the emergency room: a multicenter validation of the HEART Score', citation: 'Backus BE et al. Crit Pathw Cardiol. 2010;9(3):164–169.', url: 'https://pubmed.ncbi.nlm.nih.gov/20802272/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'timi-ua-nstemi', name: 'TIMI Risk Score — UA/NSTEMI', acronym: 'TIMI', specialty: 'Cardiologie / Urgences', summary: 'Stratifier le risque pronostique chez un patient avec angor instable ou NSTEMI.', keywords: ['timi', 'nstemi', 'angor instable', 'syndrome coronarien', 'infarctus', 'troponine'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '2 min', icon: 'trending-up-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: true,
    indications: ['Stratification pronostique de patients avec syndrome coronarien aigu sans sus-décalage persistant du segment ST, dans le contexte clinique approprié.'],
    limitations: ['Score pronostique historique dérivé avant les stratégies contemporaines de troponine ultrasensible et de prise en charge invasive.', 'Ne doit pas être utilisé pour retarder une prise en charge urgente lorsqu’un syndrome coronarien aigu est évident.', 'La décision thérapeutique doit suivre les recommandations et protocoles contemporains.'],
    sources: [{ title: 'The TIMI risk score for unstable angina/non-ST elevation MI', citation: 'Antman EM et al. JAMA. 2000;284:835–842. PMID: 10938172.', url: 'https://pubmed.ncbi.nlm.nih.gov/10938172/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'rcri', name: 'Revised Cardiac Risk Index', acronym: 'RCRI', specialty: 'Cardiologie / Périopératoire', summary: 'Estimer le risque de complications cardiaques majeures avant une chirurgie non cardiaque.', keywords: ['rcri', 'lee', 'chirurgie', 'périopératoire', 'risque cardiaque', 'préopératoire'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '1 min', icon: 'clipboard-outline', color: '#B94141', surfaceColor: '#FDE9E9', available: true,
    indications: ['Stratification préopératoire du risque cardiaque chez des adultes devant subir une chirurgie non cardiaque.'],
    limitations: ['Ne remplace pas l’évaluation clinique, la capacité fonctionnelle, le risque propre à l’intervention ni les recommandations périopératoires contemporaines.', 'La définition originale de chirurgie à haut risque doit être appliquée de façon cohérente.', 'Les taux absolus d’événements varient selon les populations et les pratiques actuelles.'],
    sources: [{ title: 'Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery', citation: 'Lee TH et al. Circulation. 1999;100(10). PMID: 10477528.', url: 'https://pubmed.ncbi.nlm.nih.gov/10477528/', accessedAt: '2026-09-15' }],
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
  {
    id: 'psi-port', name: 'Pneumonia Severity Index', acronym: 'PSI / PORT', specialty: 'Pneumologie', summary: 'Stratifier le risque pronostique d’une pneumonie communautaire en cinq classes.', keywords: ['psi', 'port', 'pneumonie', 'pneumonia severity index', 'pneumologie', 'mortalité'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '3 min', icon: 'list-outline', color: '#B96A12', surfaceColor: '#FFF1D9', available: true,
    indications: ['Stratification pronostique chez l’adulte atteint de pneumonie communautaire, après évaluation de la gravité immédiate.'],
    limitations: ['Le PSI complète mais ne remplace pas le jugement clinique, l’oxygénation, les critères de soins intensifs ni le contexte social.', 'La classe I repose sur une étape clinique préalable ; les classes II à V utilisent le score pondéré.', 'Un score bas ne doit pas retarder la prise en charge d’une instabilité ou d’un besoin de support respiratoire.'],
    sources: [{ title: 'A prediction rule to identify low-risk patients with community-acquired pneumonia', citation: 'Fine MJ et al. N Engl J Med. 1997. PMID: 8995086.', url: 'https://pubmed.ncbi.nlm.nih.gov/8995086/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'bisap', name: 'BISAP', acronym: 'BISAP', specialty: 'Gastro-entérologie / Urgences', summary: 'Évaluer précocement le risque pronostique au cours d’une pancréatite aiguë.', keywords: ['bisap', 'pancréatite', 'pancreatitis', 'gastro', 'urgence', 'sirs'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '1 min', icon: 'pulse-outline', color: '#B96A12', surfaceColor: '#FFF1D9', available: true,
    indications: ['Stratification précoce du risque chez un adulte atteint de pancréatite aiguë, à partir des variables des premières 24 heures.'],
    limitations: ['Le BISAP est un score pronostique et non un outil diagnostique de pancréatite.', 'Ne remplace pas l’évaluation répétée des défaillances d’organe ni le jugement clinique.', 'Les variables sont évaluées au cours des premières 24 heures.'],
    sources: [{ title: 'The early prediction of mortality in acute pancreatitis: a large population-based study', citation: 'Wu BU et al. Gut. 2008;57(12). PMID: 18519429.', url: 'https://pubmed.ncbi.nlm.nih.gov/18519429/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'alvarado', name: 'Score d’Alvarado', acronym: 'Alvarado', specialty: 'Chirurgie / Urgences', summary: 'Stratifier la probabilité clinique d’appendicite aiguë à partir de huit éléments simples.', keywords: ['alvarado', 'appendicite', 'appendicitis', 'douleur abdominale', 'fosse iliaque droite', 'chirurgie'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '2 min', icon: 'medkit-outline', color: '#B96A12', surfaceColor: '#FFF1D9', available: true,
    indications: ['Aide à la stratification d’un patient présentant une suspicion clinique d’appendicite aiguë.'],
    limitations: ['Le score ne remplace pas l’examen clinique, la réévaluation ni l’imagerie lorsqu’elle est indiquée.', 'Ses performances varient selon l’âge, le sexe et la population étudiée.', 'Un score bas ne doit pas faire négliger une évolution clinique préoccupante.'],
    sources: [{ title: 'A practical score for the early diagnosis of acute appendicitis', citation: 'Alvarado A. Ann Emerg Med. 1986. PMID: 3963537.', url: 'https://pubmed.ncbi.nlm.nih.gov/3963537/', accessedAt: '2026-09-15' }, { title: 'The Alvarado score for predicting acute appendicitis: a systematic review', citation: 'Ohle R et al. BMC Med. 2011;9:139. PMID: 22204638.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3299622/', accessedAt: '2026-09-15' }],
  },
  {
    id: 'mcisaac', name: 'Centor modifié / McIsaac', acronym: 'McIsaac', specialty: 'ORL / Infectiologie', summary: 'Estimer la probabilité de pharyngite à streptocoque du groupe A à partir de signes cliniques et de l’âge.', keywords: ['mcisaac', 'centor', 'angine', 'pharyngite', 'streptocoque', 'gorge', 'oropharynx'], risk: 'B', status: 'validated', version: '1.0.0', reviewedAt: '2026-09-15', duration: '1 min', icon: 'medical-outline', color: '#B96A12', surfaceColor: '#FFF1D9', available: true,
    indications: ['Patient âgé de 3 ans ou plus consultant pour un mal de gorge compatible avec une pharyngite aiguë.'],
    limitations: ['Le score estime une probabilité ; il ne confirme pas à lui seul une infection à streptocoque A.', 'Les indications de test rapide, culture ou antibiothérapie doivent suivre les recommandations locales.', 'Le score n’est pas destiné aux enfants de moins de 3 ans.'],
    sources: [{ title: 'A clinical score to reduce unnecessary antibiotic use in patients with sore throat', citation: 'McIsaac WJ et al. CMAJ. 1998. PMID: 9475915.', url: 'https://pubmed.ncbi.nlm.nih.gov/9475915/', accessedAt: '2026-09-15' }],
  },
];

export function searchClinicalTools(query: string) {
  const needle = query.trim().toLocaleLowerCase('fr');
  if (!needle) return clinicalRegistry;
  return clinicalRegistry.filter((tool) => [tool.name, tool.acronym, tool.specialty, ...tool.keywords]
    .some((value) => value.toLocaleLowerCase('fr').includes(needle)));
}
