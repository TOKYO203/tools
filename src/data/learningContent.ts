export type AccessLevel = 'free' | 'premium';

export type LearningDeck = {
  id: string;
  title: string;
  specialty: string;
  description: string;
  cards: number;
  access: AccessLevel;
  preview: { question: string; answer: string }[];
};

export type ClinicalCase = {
  id: string;
  title: string;
  specialty: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  access: AccessLevel;
  vignette: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  takeaways: string[];
};

export type DiagnosticApproach = {
  number: number;
  id: string;
  title: string;
  specialty: string;
  access: AccessLevel;
  status: 'ready' | 'catalogue';
  summary: string;
  redFlags?: string[];
  history?: string[];
  exam?: string[];
  tests?: string[];
  differentials?: string[];
  pitfalls?: string[];
  takeaways?: string[];
};

export type LearningPath = {
  id: string;
  title: string;
  subtitle: string;
  access: AccessLevel;
  lessons: string[];
};

export const learningPaths: LearningPath[] = [
  {
    id: 'semiology-core',
    title: 'Sémiologie clinique essentielle',
    subtitle: 'Construire un interrogatoire, un examen et une synthèse clinique solides.',
    access: 'free',
    lessons: ['Interrogatoire structuré', 'Signes généraux', 'Examen cardio-respiratoire', 'Examen abdominal', 'Examen neurologique', 'Synthèse et hiérarchisation'],
  },
  {
    id: 'emergency-core',
    title: 'Urgences : les réflexes prioritaires',
    subtitle: 'Reconnaître l’instabilité, identifier les drapeaux rouges et raisonner par priorité.',
    access: 'premium',
    lessons: ['Évaluation ABCDE', 'Douleur thoracique', 'Dyspnée aiguë', 'Altération de conscience', 'Sepsis et choc', 'Débriefing de cas'],
  },
  {
    id: 'diagnostic-reasoning',
    title: 'Raisonnement diagnostique',
    subtitle: 'Passer du symptôme à une hypothèse hiérarchisée sans sauter les étapes.',
    access: 'premium',
    lessons: ['Représentation du problème', 'Diagnostics à ne pas manquer', 'Probabilité pré-test', 'Choix raisonné des examens', 'Biais cognitifs', 'Synthèse finale'],
  },
];

export const learningDecks: LearningDeck[] = [
  {
    id: 'semiology',
    title: 'Sémiologie générale',
    specialty: 'Fondamentaux',
    description: 'Signes, définitions, examen clinique et vocabulaire médical essentiel.',
    cards: 48,
    access: 'free',
    preview: [
      { question: 'Qu’est-ce qu’une orthopnée ?', answer: 'Une dyspnée apparaissant ou s’aggravant en décubitus et améliorée par la position assise ou debout.' },
      { question: 'Que recherche le signe du godet ?', answer: 'La persistance d’une dépression cutanée après pression, en faveur d’un œdème déclive.' },
      { question: 'Différence entre symptôme et signe ?', answer: 'Le symptôme est rapporté par le patient ; le signe est constaté à l’examen ou par une mesure.' },
    ],
  },
  {
    id: 'cardiology',
    title: 'Cardiologie — bases cliniques',
    specialty: 'Cardiologie',
    description: 'Douleur thoracique, dyspnée, souffles, insuffisance cardiaque et ECG de base.',
    cards: 36,
    access: 'premium',
    preview: [
      { question: 'Quels caractères font évoquer une douleur ischémique ?', answer: 'Douleur ou gêne rétrosternale, constrictive ou pesante, souvent déclenchée par l’effort ; le contexte et les signes associés modifient la probabilité.' },
      { question: 'Que suggère une turgescence jugulaire ?', answer: 'Une élévation de la pression veineuse droite, à interpréter avec l’ensemble de l’examen clinique.' },
    ],
  },
  {
    id: 'pneumology',
    title: 'Pneumologie — sémiologie',
    specialty: 'Pneumologie',
    description: 'Dyspnée, toux, hémoptysie, auscultation et syndromes respiratoires.',
    cards: 32,
    access: 'premium',
    preview: [
      { question: 'Que traduit un wheezing diffus ?', answer: 'Une obstruction bronchique est possible ; le contexte permet de distinguer notamment asthme, BPCO et autres causes.' },
      { question: 'Pourquoi quantifier une hémoptysie ?', answer: 'Parce que l’abondance, le retentissement respiratoire et hémodynamique orientent l’urgence de la prise en charge.' },
    ],
  },
  {
    id: 'neurology',
    title: 'Neurologie — examen rapide',
    specialty: 'Neurologie',
    description: 'Conscience, déficit focal, paires crâniennes, motricité, sensibilité et coordination.',
    cards: 34,
    access: 'premium',
    preview: [
      { question: 'Que faut-il préciser devant un déficit focal aigu ?', answer: 'L’heure de début ou la dernière heure connue normale, la topographie, la sévérité et les signes associés.' },
      { question: 'À quoi sert le score de Glasgow ?', answer: 'À décrire de façon standardisée les réponses oculaire, verbale et motrice ; les composantes doivent être rapportées avec le total.' },
    ],
  },
  {
    id: 'emergency-red-flags',
    title: 'Drapeaux rouges en urgence',
    specialty: 'Urgences',
    description: 'Les signes qui imposent de modifier immédiatement la priorité diagnostique.',
    cards: 40,
    access: 'premium',
    preview: [
      { question: 'Quel principe prime devant un patient instable ?', answer: 'Stabiliser les fonctions vitales et rechercher simultanément les causes immédiatement menaçantes.' },
      { question: 'Pourquoi une syncope à l’effort est-elle préoccupante ?', answer: 'Elle peut révéler une cause cardiaque potentiellement grave et justifie une évaluation prioritaire.' },
    ],
  },
];

export const clinicalCases: ClinicalCase[] = [
  {
    id: 'case-chest-pain-01',
    title: 'Douleur thoracique à l’effort',
    specialty: 'Cardiologie',
    level: 'Débutant',
    access: 'free',
    vignette: 'Un homme de 58 ans, hypertendu et fumeur, décrit depuis 45 minutes une oppression rétrosternale avec sueurs et nausées. La douleur persiste au repos.',
    question: 'Quelle est la priorité de raisonnement ?',
    options: ['Conclure à un reflux gastro-œsophagien', 'Écarter d’abord une cause cardiovasculaire aiguë menaçante', 'Attendre l’évolution pendant plusieurs heures', 'Demander uniquement une radiographie thoracique'],
    correctIndex: 1,
    explanation: 'Le profil de risque, la douleur persistante et les signes neurovégétatifs imposent de considérer en priorité un syndrome coronarien aigu et les autres urgences thoraciques avant les causes bénignes.',
    takeaways: ['Hiérarchiser selon la gravité avant la fréquence.', 'Un ECG précoce et l’évaluation clinique sont centraux.', 'Une douleur atypique n’exclut pas une cause grave.'],
  },
  {
    id: 'case-fever-01',
    title: 'Fièvre et altération de l’état général',
    specialty: 'Infectiologie',
    level: 'Débutant',
    access: 'free',
    vignette: 'Une femme de 31 ans consulte pour fièvre à 39,2 °C depuis 24 heures, frissons, dysurie et douleur lombaire droite. Elle est tachycarde mais reste consciente et normotendue.',
    question: 'Quelle hypothèse doit être activement recherchée ?',
    options: ['Pyélonéphrite aiguë', 'Migraine', 'Colique biliaire isolée', 'Conjonctivite'],
    correctIndex: 0,
    explanation: 'L’association fièvre, symptômes urinaires et douleur lombaire oriente vers une infection urinaire haute. La gravité doit ensuite être appréciée : sepsis, obstruction, grossesse, terrain fragile ou mauvaise tolérance.',
    takeaways: ['Identifier le foyer probable sans négliger les signes de sepsis.', 'Toujours rechercher un obstacle ou un terrain à risque quand le contexte le suggère.', 'Le diagnostic clinique guide le choix raisonné des examens.'],
  },
  {
    id: 'case-dyspnea-01',
    title: 'Dyspnée brutale avec douleur latéro-thoracique',
    specialty: 'Urgences',
    level: 'Intermédiaire',
    access: 'premium',
    vignette: 'Une femme de 42 ans présente une dyspnée brutale et une douleur thoracique augmentée à l’inspiration, dix jours après une chirurgie. Sa fréquence cardiaque est à 116/min.',
    question: 'Quel raisonnement est le plus approprié ?',
    options: ['Évaluer la probabilité clinique d’embolie pulmonaire avant d’ordonner les examens', 'Exclure l’embolie pulmonaire sur la seule saturation', 'Demander systématiquement un scanner sans évaluation préalable', 'Conclure à une anxiété'],
    correctIndex: 0,
    explanation: 'Le contexte postopératoire, la tachycardie et la symptomatologie imposent une estimation structurée de la probabilité clinique. Les examens complémentaires dépendent ensuite de cette probabilité et du contexte.',
    takeaways: ['La probabilité pré-test organise le parcours diagnostique.', 'Une saturation normale n’exclut pas une embolie pulmonaire.', 'Instabilité hémodynamique = stratégie d’urgence spécifique.'],
  },
  {
    id: 'case-neuro-01',
    title: 'Déficit neurologique focal aigu',
    specialty: 'Neurologie',
    level: 'Intermédiaire',
    access: 'premium',
    vignette: 'Un homme de 69 ans développe brutalement une faiblesse du bras droit et un trouble du langage pendant le déjeuner. Son épouse connaît précisément l’heure de début.',
    question: 'Quelle donnée doit être sécurisée immédiatement ?',
    options: ['Son groupe sanguin uniquement', 'L’heure exacte de début ou la dernière heure connue normale', 'Son poids à 20 ans', 'Le nombre de cafés consommés'],
    correctIndex: 1,
    explanation: 'La temporalité conditionne l’évaluation et les options thérapeutiques d’un AVC aigu. Elle doit être documentée parallèlement à l’ABCDE, la glycémie capillaire et l’évaluation neurologique.',
    takeaways: ['Time is brain : documenter la temporalité sans délai.', 'Une hypoglycémie peut mimer un déficit focal.', 'Ne pas retarder l’imagerie cérébrale urgente par des examens non prioritaires.'],
  },
  {
    id: 'case-abdomen-01',
    title: 'Douleur abdominale avec défense',
    specialty: 'Gastro-entérologie',
    level: 'Avancé',
    access: 'premium',
    vignette: 'Un patient de 64 ans présente une douleur abdominale brutale, intense, diffuse, avec défense et malaise. Il est pâle et tachycarde.',
    question: 'Quel principe doit guider la première étape ?',
    options: ['Chercher d’abord une cause chirurgicale ou vasculaire menaçante', 'Donner un diagnostic fonctionnel sans examen', 'Reporter l’évaluation clinique après tous les examens', 'Se limiter à une bandelette urinaire'],
    correctIndex: 0,
    explanation: 'Une douleur brutale avec signes péritonéaux ou retentissement hémodynamique impose d’identifier rapidement perforation, ischémie, hémorragie ou autre cause grave tout en stabilisant le patient.',
    takeaways: ['Les signes de péritonite changent le niveau d’urgence.', 'La stabilité hémodynamique guide la séquence des examens.', 'La douleur abdominale aiguë exige un diagnostic différentiel hiérarchisé.'],
  },
  {
    id: 'case-eye-01',
    title: 'Exophtalmie progressive',
    specialty: 'Ophtalmologie / Endocrinologie',
    level: 'Avancé',
    access: 'premium',
    vignette: 'Une femme de 36 ans décrit depuis plusieurs semaines une impression d’yeux saillants, irritation oculaire et diplopie intermittente. Elle rapporte aussi palpitations et amaigrissement.',
    question: 'Quelle association diagnostique doit être recherchée en priorité ?',
    options: ['Orbitopathie dysthyroïdienne et dysfonction thyroïdienne', 'Otite externe', 'Appendicite', 'Arthrose du genou'],
    correctIndex: 0,
    explanation: 'Une exophtalmie bilatérale subaiguë associée à des signes compatibles avec une hyperthyroïdie évoque notamment une orbitopathie dysthyroïdienne. Il faut toutefois rechercher les signes de menace visuelle et les causes orbitaires alternatives.',
    takeaways: ['Bilatéralité et contexte systémique orientent mais ne suffisent pas.', 'Baisse visuelle, dyschromatopsie ou atteinte cornéenne sont des signes d’alarme.', 'Une exophtalmie unilatérale ou douloureuse impose d’élargir rapidement le diagnostic différentiel.'],
  },
];

const readyDiagnosticContent: Record<string, Omit<DiagnosticApproach, 'number' | 'id' | 'title' | 'specialty' | 'access' | 'status' | 'summary'>> = {
  'chest-pain': {
    redFlags: ['Instabilité hémodynamique, syncope ou altération de conscience', 'Dyspnée sévère, désaturation ou signes d’œdème pulmonaire', 'Douleur brutale maximale d’emblée ou transfixiante', 'Déficit neurologique associé', 'Douleur persistante avec signes végétatifs ou terrain cardiovasculaire à risque'],
    history: ['Début : brutal ou progressif, heure précise, durée et évolution', 'Caractère : oppression, brûlure, déchirure, douleur pleurale ou positionnelle', 'Déclencheurs : effort, respiration, repas, mouvement, décubitus', 'Irradiations : bras, mâchoire, dos, épigastre', 'Signes associés : dyspnée, sueurs, nausées, palpitations, syncope, fièvre, hémoptysie', 'Terrain : coronaropathie, HTA, diabète, tabac, thrombose, chirurgie récente, grossesse/post-partum'],
    exam: ['Constantes complètes et évaluation ABCDE si instabilité', 'Examen cardiovasculaire : perfusion, pouls, pression artérielle, auscultation, signes d’insuffisance cardiaque', 'Examen respiratoire : symétrie, murmure vésiculaire, crépitants, signes de détresse', 'Recherche de signes de TVP et d’arguments pour une cause pariétale ou digestive selon le contexte'],
    tests: ['ECG précoce si suspicion cardiovasculaire', 'Troponine selon le contexte clinique et un protocole validé', 'Radiographie thoracique lorsque l’orientation clinique le justifie', 'D-dimères et imagerie pour embolie pulmonaire selon probabilité pré-test', 'Imagerie aortique urgente si suspicion de syndrome aortique aigu'],
    differentials: ['Syndrome coronarien aigu', 'Embolie pulmonaire', 'Syndrome aortique aigu', 'Pneumothorax', 'Péricardite / myocardite', 'Pneumonie / pleurésie', 'Douleur pariétale', 'Reflux ou autre cause œso-gastrique'],
    pitfalls: ['Rassurer sur un ECG initial normal alors que le contexte reste suspect', 'Utiliser un score à la place du jugement clinique', 'Oublier les présentations atypiques chez la personne âgée, diabétique ou chez la femme', 'Demander des examens sans avoir d’abord hiérarchisé les diagnostics menaçants'],
    takeaways: ['Devant une douleur thoracique, penser d’abord aux diagnostics qui menacent la vie.', 'Le contexte, la temporalité et les constantes sont aussi importants que la description de la douleur.', 'L’ECG et les biomarqueurs doivent être interprétés dans une stratégie clinique, jamais isolément.'],
  },
  'acute-dyspnea': {
    redFlags: ['SpO₂ basse ou signes d’épuisement respiratoire', 'Hypotension, marbrures ou altération de conscience', 'Silence auscultatoire, stridor ou asymétrie ventilatoire majeure', 'Douleur thoracique aiguë ou hémoptysie associée', 'Début brutal sur terrain thromboembolique ou cardiaque'],
    history: ['Début et vitesse d’installation', 'Dyspnée au repos, à l’effort, orthopnée ou dyspnée paroxystique nocturne', 'Toux, expectoration, fièvre, douleur thoracique, sifflements, hémoptysie', 'Antécédents cardiaques, pulmonaires, thromboemboliques et allergiques', 'Médicaments, exposition, chirurgie, immobilisation ou voyage récent'],
    exam: ['ABCDE et constantes', 'Fréquence respiratoire, saturation, capacité à parler, signes de lutte', 'Auscultation : sibilants, crépitants, diminution ou abolition du murmure', 'Examen cardiaque, turgescence jugulaire, œdèmes', 'Recherche de signes de TVP ou d’anaphylaxie selon le contexte'],
    tests: ['ECG et radiographie thoracique selon orientation', 'Gaz du sang si détresse ou trouble ventilatoire suspecté', 'Biologie ciblée : NFS, électrolytes, biomarqueurs selon hypothèses', 'Échographie ciblée lorsqu’elle est disponible et maîtrisée', 'Stratégie EP fondée sur la probabilité pré-test'],
    differentials: ['Asthme ou exacerbation de BPCO', 'Œdème aigu pulmonaire / insuffisance cardiaque', 'Pneumonie', 'Embolie pulmonaire', 'Pneumothorax', 'Anémie sévère', 'Acidose métabolique', 'Anxiété après exclusion raisonnée des causes organiques'],
    pitfalls: ['Attribuer trop vite la dyspnée à l’anxiété', 'Se fier uniquement à la saturation', 'Négliger la fréquence respiratoire', 'Oublier qu’une dyspnée peut être d’origine métabolique, hématologique ou toxique'],
    takeaways: ['La dyspnée est un symptôme : déterminer d’abord si le patient est stable.', 'Le délai d’installation réduit rapidement le diagnostic différentiel.', 'L’examen cardio-respiratoire et les constantes orientent les examens, pas l’inverse.'],
  },
  'acute-abdominal-pain': {
    redFlags: ['Instabilité hémodynamique ou syncope', 'Défense, rigidité ou douleur à la décompression', 'Douleur brutale maximale d’emblée', 'Masse pulsatile, hémorragie digestive ou suspicion de grossesse extra-utérine', 'Douleur disproportionnée par rapport à l’examen'],
    history: ['Localisation initiale et actuelle, migration, irradiation', 'Mode de début, durée, caractère et facteurs modifiants', 'Vomissements, transit, rectorragie/méléna, fièvre, symptômes urinaires', 'Date des dernières règles, possibilité de grossesse et symptômes gynécologiques si pertinent', 'Chirurgies antérieures, anticoagulants, maladie vasculaire, alcool, médicaments'],
    exam: ['Constantes et état général', 'Inspection, auscultation et palpation abdominale systématique', 'Recherche de défense, rigidité, masse ou hernie', 'Examen cardio-respiratoire et vasculaire selon le contexte', 'Examens pelvien, rectal ou testiculaire uniquement lorsqu’ils sont cliniquement indiqués'],
    tests: ['Test de grossesse chez toute patiente en âge de procréer lorsque pertinent', 'NFS, CRP, fonction rénale, ionogramme, bilan hépatique/lipase selon orientation', 'Bandelette urinaire', 'Échographie ou scanner selon hypothèses, gravité et disponibilité'],
    differentials: ['Appendicite', 'Cholécystite / pathologie biliaire', 'Pancréatite', 'Occlusion', 'Perforation digestive', 'Ischémie mésentérique', 'Anévrisme aortique abdominal', 'Colique néphrétique / pyélonéphrite', 'Grossesse extra-utérine / torsion annexielle'],
    pitfalls: ['Exclure une cause grave parce que la douleur semble modérée', 'Oublier les causes extra-abdominales : infarctus inférieur, pneumonie, acidocétose', 'Retarder la réévaluation clinique alors que les symptômes évoluent', 'Demander une imagerie sans question clinique claire'],
    takeaways: ['Stabilité, péritonisme et temporalité déterminent le niveau d’urgence.', 'Le diagnostic différentiel dépend de l’âge, du sexe, du terrain et de la localisation.', 'Une réévaluation répétée est souvent aussi importante que le premier examen.'],
  },
  'acute-fever': {
    redFlags: ['Hypotension, confusion ou marbrures', 'Détresse respiratoire', 'Purpura extensif ou raideur méningée', 'Neutropénie, immunodépression importante ou grossesse avec mauvaise tolérance', 'Douleur focale intense, obstacle urinaire ou suspicion d’infection profonde'],
    history: ['Durée et courbe de la fièvre, frissons, tolérance générale', 'Symptômes respiratoires, urinaires, digestifs, neurologiques, cutanés ou ORL', 'Voyages, contacts infectieux, expositions animales ou alimentaires', 'Médicaments récents, dispositifs invasifs, chirurgie', 'Terrain : immunodépression, grossesse, comorbidités, vaccination'],
    exam: ['Constantes avec fréquence respiratoire et état mental', 'Recherche systématique d’un foyer : peau, ORL, poumons, abdomen, urines, neurologique', 'Examen des dispositifs, plaies et points d’entrée', 'Recherche de signes de choc ou de défaillance d’organe'],
    tests: ['Examens guidés par le foyer et la gravité, pas par une batterie systématique', 'NFS, fonction rénale, bilan métabolique et lactate si sepsis suspecté selon contexte', 'Prélèvements microbiologiques appropriés avant antibiothérapie lorsque cela ne retarde pas une prise en charge urgente', 'Imagerie ciblée selon foyer suspecté'],
    differentials: ['Infection respiratoire', 'Infection urinaire haute', 'Infection digestive ou biliaire', 'Infection cutanée', 'Méningite / encéphalite', 'Endocardite selon contexte', 'Causes non infectieuses : inflammatoire, médicamenteuse, thromboembolique ou néoplasique'],
    pitfalls: ['Assimiler toute fièvre à une infection bactérienne', 'Se fier à la température sans évaluer la tolérance et les organes', 'Oublier les terrains à haut risque', 'Prescrire des examens ou traitements sans chercher de foyer ni évaluer la gravité'],
    takeaways: ['Devant une fièvre aiguë, répondre d’abord à deux questions : le patient est-il grave et où est le foyer ?', 'La gravité peut être présente même avec une température peu élevée.', 'Le terrain du patient modifie fortement le seuil d’alerte.'],
  },
  'exophthalmos': {
    redFlags: ['Baisse d’acuité visuelle, dyschromatopsie ou déficit pupillaire afférent', 'Douleur orbitaire importante, fièvre ou altération générale', 'Atteinte cornéenne par exposition', 'Ophtalmoplégie rapidement progressive', 'Exophtalmie pulsatile, traumatique ou d’apparition brutale'],
    history: ['Unilatérale ou bilatérale, aiguë ou progressive', 'Douleur, rougeur, diplopie, baisse visuelle, céphalées', 'Signes thyroïdiens : palpitations, amaigrissement, thermophobie, tremblement', 'Traumatisme, sinusite, cancer connu, maladie inflammatoire ou auto-immune', 'Tabagisme et traitements thyroïdiens si orbitopathie dysthyroïdienne suspectée'],
    exam: ['Acuité visuelle de chaque œil', 'Pupilles et vision des couleurs si possible', 'Motilité oculaire et diplopie', 'Inspection : rétraction palpébrale, chémosis, exposition cornéenne, asymétrie', 'Palpation orbitaire prudente et recherche de souffle si contexte vasculaire'],
    tests: ['Bilan thyroïdien si contexte compatible', 'Imagerie orbitaire en cas d’unilatéralité, douleur, déficit visuel, masse ou présentation atypique', 'Avis ophtalmologique urgent en cas de menace visuelle', 'Examens complémentaires orientés par suspicion infectieuse, inflammatoire, tumorale ou vasculaire'],
    differentials: ['Orbitopathie dysthyroïdienne', 'Cellulite orbitaire', 'Tumeur orbitaire', 'Inflammation orbitaire idiopathique', 'Fistule carotido-caverneuse', 'Thrombose du sinus caverneux', 'Malformation ou autre cause vasculaire'],
    pitfalls: ['Attribuer toute exophtalmie à la thyroïde', 'Ne pas mesurer séparément l’acuité visuelle et les couleurs', 'Sous-estimer une atteinte cornéenne par exposition', 'Retarder l’imagerie dans une forme unilatérale ou atypique'],
    takeaways: ['L’urgence est dictée par la fonction visuelle, la douleur et la vitesse d’évolution.', 'Bilatéralité + signes thyroïdiens évoquent une orbitopathie dysthyroïdienne mais ne dispensent pas d’un examen ophtalmologique.', 'Une exophtalmie unilatérale atypique impose une recherche structurée d’une cause orbitaire.'],
  },
};

const diagnosticCatalogueBase = [
  ['Douleur thoracique', 'Cardiologie / Urgences', 'chest-pain'],
  ['Dyspnée aiguë', 'Pneumologie / Urgences', 'acute-dyspnea'],
  ['Palpitations', 'Cardiologie', 'palpitations'],
  ['Syncope ou lipothymie', 'Cardiologie / Neurologie', 'syncope'],
  ['Œdèmes des membres inférieurs', 'Cardiologie / Néphrologie', 'leg-edema'],
  ['Hypertension artérielle découverte', 'Cardiologie', 'hypertension'],
  ['Toux aiguë ou subaiguë', 'Pneumologie', 'acute-cough'],
  ['Hémoptysie', 'Pneumologie / Urgences', 'hemoptysis'],
  ['Douleur abdominale aiguë', 'Gastro-entérologie / Urgences', 'acute-abdominal-pain'],
  ['Vomissements', 'Gastro-entérologie', 'vomiting'],
  ['Diarrhée aiguë', 'Gastro-entérologie / Infectiologie', 'acute-diarrhea'],
  ['Constipation aiguë', 'Gastro-entérologie', 'acute-constipation'],
  ['Hémorragie digestive', 'Gastro-entérologie / Urgences', 'gi-bleeding'],
  ['Ictère', 'Hépato-gastro-entérologie', 'jaundice'],
  ['Ascite', 'Hépato-gastro-entérologie', 'ascites'],
  ['Fièvre aiguë', 'Infectiologie / Médecine interne', 'acute-fever'],
  ['Fièvre prolongée', 'Infectiologie / Médecine interne', 'prolonged-fever'],
  ['Adénopathie', 'Médecine interne / Hématologie', 'lymphadenopathy'],
  ['Amaigrissement involontaire', 'Médecine interne', 'weight-loss'],
  ['Asthénie', 'Médecine interne', 'fatigue'],
  ['Céphalée aiguë', 'Neurologie / Urgences', 'acute-headache'],
  ['Vertige', 'Neurologie / ORL', 'vertigo'],
  ['Crise convulsive', 'Neurologie / Urgences', 'seizure'],
  ['Déficit neurologique focal aigu', 'Neurologie / Urgences', 'focal-deficit'],
  ['Trouble de conscience', 'Neurologie / Urgences', 'altered-consciousness'],
  ['Douleur lombaire', 'Rhumatologie / Néphrologie', 'low-back-pain'],
  ['Hématurie', 'Néphrologie / Urologie', 'hematuria'],
  ['Dysurie et brûlures mictionnelles', 'Urologie / Infectiologie', 'dysuria'],
  ['Insuffisance rénale aiguë', 'Néphrologie', 'acute-kidney-injury'],
  ['Polyurie-polydipsie', 'Endocrinologie / Néphrologie', 'polyuria-polydipsia'],
  ['Hyperglycémie', 'Endocrinologie', 'hyperglycemia'],
  ['Hypoglycémie', 'Endocrinologie / Urgences', 'hypoglycemia'],
  ['Anémie', 'Hématologie', 'anemia'],
  ['Purpura', 'Hématologie / Médecine interne', 'purpura'],
  ['Douleur articulaire aiguë', 'Rhumatologie', 'acute-joint-pain'],
  ['Monoarthrite aiguë', 'Rhumatologie / Urgences', 'acute-monoarthritis'],
  ['Éruption cutanée fébrile', 'Dermatologie / Infectiologie', 'febrile-rash'],
  ['Prurit généralisé', 'Dermatologie / Médecine interne', 'generalized-pruritus'],
  ['Œil rouge douloureux', 'Ophtalmologie / Urgences', 'painful-red-eye'],
  ['Baisse brutale de l’acuité visuelle', 'Ophtalmologie / Urgences', 'acute-visual-loss'],
  ['Diplopie', 'Ophtalmologie / Neurologie', 'diplopia'],
  ['Adénopathie cervicale persistante', 'ORL / Médecine interne', 'cervical-lymph-node'],
  ['Exophtalmie', 'Ophtalmologie / Endocrinologie', 'exophthalmos'],
] as const;

export const diagnosticApproaches: DiagnosticApproach[] = diagnosticCatalogueBase.map(([title, specialty, id], index) => {
  const detail = readyDiagnosticContent[id];
  const freeIds = new Set(['chest-pain', 'acute-fever']);
  return {
    number: index + 1,
    id,
    title,
    specialty,
    access: freeIds.has(id) ? 'free' : 'premium',
    status: detail ? 'ready' : 'catalogue',
    summary: detail
      ? `Démarche structurée devant ${title.toLocaleLowerCase('fr')} : gravité, interrogatoire, examen, examens ciblés et pièges.`
      : `Cadre de raisonnement clinique devant ${title.toLocaleLowerCase('fr')}. Contenu détaillé en cours d’intégration.`,
    ...detail,
  };
});
