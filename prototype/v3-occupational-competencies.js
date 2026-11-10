/** V3 starter occupations and qualification gates; synthetic game model, not a job licence register. */
export const V3_METAL_SKILL_LEVELS = Object.freeze({ absent: 0, basic: 1, skilled: 2, master: 3 });
const syntheticSkillCourse = (id, label, prerequisites, skillId) => Object.freeze({
  id,
  label: `${label} (synthetisches Spielangebot)`,
  sourceType: 'synthetic_training_option',
  courseVersion: 'V3-SYNTHETIC-COURSE-1',
  prerequisites: Object.freeze(prerequisites.map(row => Object.freeze({ ...row }))),
  awards: Object.freeze({ kind: 'game_skill', skillId, level: 2 }),
  credentialEffect: 'none',
  financialEffect: 'none',
  note: 'Nur Szenariofortschritt im Spiel. Geräte, betriebliche Unterweisung und formale Nachweise bleiben separate Gates; der Kurs ist kein realer Abschluss und begründet keine Befähigung oder Berechtigung.',
});

export const V3_SYNTHETIC_SKILL_COURSES = Object.freeze([
  Object.freeze({
    id: 'synthetic-course-precision-turning',
    label: 'Aufbaukurs Präzisionsdrehen (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'turning_manual', minimumLevel: 2 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'precision_turning', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; kein externer Abschluss, Zertifikat, Maschinenpass oder rechtlicher Befähigungsnachweis.',
  }),
  Object.freeze({
    id: 'synthetic-course-assembly-basics',
    label: 'Aufbaukurs Baugruppenmontage (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'technical_drawing', minimumLevel: 2 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'mechanical_assembly', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; kein externer Abschluss, Zertifikat, Maschinenpass oder rechtlicher Befähigungsnachweis.',
  }),
  Object.freeze({
    id: 'synthetic-course-metrology-basics',
    label: 'Aufbaukurs Messen und Prüfen (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'technical_drawing', minimumLevel: 2 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'metrology', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; kein externer Abschluss, Zertifikat, Maschinenpass oder rechtlicher Befähigungsnachweis.',
  }),
  Object.freeze({
    id: 'synthetic-course-machine-operation',
    label: 'Grundkurs Maschinenbedienung (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'turning_manual', minimumLevel: 2 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'machine_operation', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; kein Maschinenpass, keine reale Bedienberechtigung und kein rechtlicher Befähigungsnachweis. Die passende Maschine bleibt eine getrennte Voraussetzung.',
  }),
  Object.freeze({
    id: 'synthetic-course-welding-basics',
    label: 'Grundkurs MAG-Fügen (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'technical_drawing', minimumLevel: 1 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'welding_migmag', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; keine Schweißerprüfung, kein externer Nachweis und keine rechtliche Befähigung. Erforderliche Maschinen und formale Nachweise bleiben getrennt.',
  }),
  Object.freeze({
    id: 'synthetic-course-pneumatics-basics',
    label: 'Aufbaukurs Pneumatikmontage (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'mechanical_assembly', minimumLevel: 2 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'pneumatics', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; keine externe Berufsqualifikation oder Maschinenberechtigung. Pneumatik- und Montageausrüstung bleibt eine getrennte Voraussetzung.',
  }),
  Object.freeze({
    id: 'synthetic-course-technical-drawing-basics',
    label: 'Grundkurs Technische Zeichnungen lesen (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'technical_drawing', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Grundkurs ohne Spielvoraussetzung; Szenariofortschritt im Spiel, kein externer Abschluss oder Berufsqualifikationsnachweis.',
  }),
  Object.freeze({
    id: 'synthetic-course-manual-turning-basics',
    label: 'Grundkurs Konventionelles Drehen (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'technical_drawing', minimumLevel: 1 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'turning_manual', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; die Drehmaschine bleibt eine getrennte Voraussetzung. Kein externer Abschluss oder Maschinenpass.',
  }),
  Object.freeze({
    id: 'synthetic-course-manual-fabrication-basics',
    label: 'Grundkurs Manuelle Metallbearbeitung (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'technical_drawing', minimumLevel: 1 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'manual_fabrication', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; erforderliche Werkbank und Werkzeuge bleiben getrennte Voraussetzungen. Kein externer Berufsabschluss.',
  }),
  Object.freeze({
    id: 'synthetic-course-press-setup-basics',
    label: 'Grundkurs Stanz- und Umformwerkzeuge rüsten (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'technical_drawing', minimumLevel: 1 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'press_setup', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; Pressen und Werkzeuge bleiben getrennte Voraussetzungen. Kein Maschinenpass oder rechtlicher Befähigungsnachweis.',
  }),
  Object.freeze({
    id: 'synthetic-course-sheet-forming-basics',
    label: 'Aufbaukurs Blech umformen (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([Object.freeze({ skillId: 'manual_fabrication', minimumLevel: 1 })]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'sheet_forming', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; erforderliche Umformmaschine und Werkzeuge bleiben getrennte Voraussetzungen. Kein externer Abschluss.',
  }),
  Object.freeze({
    id: 'synthetic-course-toolmaking-basics',
    label: 'Aufbaukurs Werkzeuge und Vorrichtungen herstellen (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([
      Object.freeze({ skillId: 'manual_fabrication', minimumLevel: 2 }),
      Object.freeze({ skillId: 'technical_drawing', minimumLevel: 2 }),
    ]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'toolmaking', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; Werkzeugbauplatz und Maschinen bleiben getrennte Voraussetzungen. Kein externer Berufsabschluss.',
  }),
  Object.freeze({
    id: 'synthetic-course-metal-casting-basics',
    label: 'Aufbaukurs Formen und Metallguss (synthetisches Spielangebot)',
    sourceType: 'synthetic_training_option',
    courseVersion: 'V3-SYNTHETIC-COURSE-1',
    prerequisites: Object.freeze([
      Object.freeze({ skillId: 'manual_fabrication', minimumLevel: 1 }),
      Object.freeze({ skillId: 'technical_drawing', minimumLevel: 1 }),
    ]),
    awards: Object.freeze({ kind: 'game_skill', skillId: 'metal_casting', level: 2 }),
    credentialEffect: 'none',
    financialEffect: 'none',
    note: 'Szenariofortschritt im Spiel; Gießereiofen, Sicherheitsunterweisung und weitere Einsatzbedingungen bleiben getrennte Voraussetzungen. Kein Berufsabschluss oder Gießereibefähigungsnachweis.',
  }),
  syntheticSkillCourse('synthetic-course-drilling-basics', 'Grundkurs Bohren und Senken', [{ skillId: 'manual_fabrication', minimumLevel: 1 }], 'drilling'),
  syntheticSkillCourse('synthetic-course-milling-basics', 'Aufbaukurs Konventionelles Fräsen', [{ skillId: 'turning_manual', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'milling_manual'),
  syntheticSkillCourse('synthetic-course-grinding-basics', 'Aufbaukurs Schleifen', [{ skillId: 'milling_manual', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'grinding'),
  syntheticSkillCourse('synthetic-course-machine-setup-basics', 'Aufbaukurs Maschinen einrichten', [{ skillId: 'machine_operation', minimumLevel: 2 }, { skillId: 'technical_drawing', minimumLevel: 2 }], 'machine_setup'),
  syntheticSkillCourse('synthetic-course-cnc-turning-basics', 'Aufbaukurs CNC-Drehen', [{ skillId: 'machine_setup', minimumLevel: 2 }, { skillId: 'turning_manual', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'cnc_turning'),
  syntheticSkillCourse('synthetic-course-cnc-milling-basics', 'Aufbaukurs CNC-Fräsen', [{ skillId: 'machine_setup', minimumLevel: 2 }, { skillId: 'milling_manual', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'cnc_milling'),
  syntheticSkillCourse('synthetic-course-cnc-press-basics', 'Aufbaukurs CNC-Presse bedienen', [{ skillId: 'machine_setup', minimumLevel: 2 }, { skillId: 'press_setup', minimumLevel: 2 }, { skillId: 'sheet_forming', minimumLevel: 2 }, { skillId: 'quality_check', minimumLevel: 2 }], 'cnc_press'),
  syntheticSkillCourse('synthetic-course-maintenance-basics', 'Aufbaukurs Warten und Instandhalten', [{ skillId: 'machine_operation', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'maintenance'),
  syntheticSkillCourse('synthetic-course-hydraulics-basics', 'Aufbaukurs Hydraulikmontage', [{ skillId: 'mechanical_assembly', minimumLevel: 2 }, { skillId: 'pneumatics', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'hydraulics'),
  syntheticSkillCourse('synthetic-course-cutting-basics', 'Grundkurs Trennen und Zuschneiden', [{ skillId: 'manual_fabrication', minimumLevel: 1 }, { skillId: 'technical_drawing', minimumLevel: 1 }], 'cutting'),
  syntheticSkillCourse('synthetic-course-precision-milling-basics', 'Aufbaukurs Präzisionsfräsen', [{ skillId: 'milling_manual', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'precision_milling'),
  syntheticSkillCourse('synthetic-course-fitting-basics', 'Aufbaukurs Feinmontage und Einpassen', [{ skillId: 'manual_fabrication', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'fitting'),
  syntheticSkillCourse('synthetic-course-quality-check-basics', 'Aufbaukurs Fertigungsqualität prüfen', [{ skillId: 'metrology', minimumLevel: 2 }, { skillId: 'technical_drawing', minimumLevel: 2 }], 'quality_check'),
  syntheticSkillCourse('synthetic-course-mould-making-basics', 'Aufbaukurs Formen und Kerne herstellen', [{ skillId: 'manual_fabrication', minimumLevel: 2 }, { skillId: 'technical_drawing', minimumLevel: 2 }], 'mould_making'),
  syntheticSkillCourse('synthetic-course-casting-finishing-basics', 'Aufbaukurs Gussteile nacharbeiten', [{ skillId: 'metal_casting', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }], 'casting_finishing'),
  syntheticSkillCourse('synthetic-course-metallurgy-basics', 'Aufbaukurs Werkstoff- und Gussfehler beurteilen', [{ skillId: 'metal_casting', minimumLevel: 2 }, { skillId: 'metrology', minimumLevel: 2 }, { skillId: 'quality_check', minimumLevel: 2 }], 'metallurgy'),
]);

const METHOD_SKILLS = new Set(['technical_drawing','metrology','quality_check','machine_setup','maintenance']);
const skill = (id, label, equipment, meisterLevel = 3) => Object.freeze({ id, label, category: METHOD_SKILLS.has(id) ? 'method' : 'technical', equipment: Object.freeze(equipment), meisterLevel, acquisition: 'Berufsausbildung; Stufe 3 ist ein vereinfachtes Spielprofil und keine Prüfungsordnung.' });

export const V3_METAL_OCCUPATIONS = Object.freeze([
  { id: 'metallbauer', label: 'Metallbauer/in – Konstruktionstechnik', family: 'Handwerk', qualification: 'Gesellenabschluss Metallbauer/in', meister: 'Metallbauermeister/in', starterEquipment: 'bench-tools', skills: [skill('technical_drawing', 'Technische Zeichnung lesen', ['measuring-kit']), skill('manual_fabrication', 'Manuelle Metallbearbeitung', ['bench-tools']), skill('drilling', 'Bohren und Senken', ['pillar-drill']), skill('sheet_forming', 'Blech bearbeiten und umformen', ['sheet-tools']), skill('welding_migmag', 'Metall fügen / MAG-Schweißen', ['welding-migmag'])] },
  { id: 'zerspanung', label: 'Zerspanungsmechaniker/in', family: 'Industrie', qualification: 'Abschluss Zerspanungsmechaniker/in', meister: 'Industriemeister/in Metall (Fertigung)', starterEquipment: 'manual-lathe', skills: [skill('turning_manual', 'Konventionell drehen', ['manual-lathe']), skill('milling_manual', 'Konventionell fräsen', ['manual-mill']), skill('grinding', 'Schleifen', ['surface-grinder']), skill('cnc_turning', 'CNC-Drehen einrichten und bedienen', ['cnc-lathe']), skill('metrology', 'Maße und Oberfläche prüfen', ['measuring-kit'])] },
  { id: 'industriemechanik', label: 'Industriemechaniker/in', family: 'Industrie', qualification: 'Abschluss Industriemechaniker/in', meister: 'Industriemeister/in Metall', starterEquipment: 'assembly-bench', skills: [skill('mechanical_assembly', 'Maschinen und Baugruppen montieren', ['assembly-bench']), skill('maintenance', 'Warten und instand halten', ['maintenance-tools']), skill('pneumatics', 'Pneumatik prüfen und montieren', ['pneumatics-kit']), skill('hydraulics', 'Hydraulik prüfen und montieren', ['hydraulics-kit']), skill('metrology', 'Prüfen und Messen', ['measuring-kit'])] },
  { id: 'konstruktionsmechanik', label: 'Konstruktionsmechaniker/in', family: 'Industrie', qualification: 'Abschluss Konstruktionsmechaniker/in', meister: 'Industriemeister/in Metall (Konstruktion)', starterEquipment: 'welding-migmag', skills: [skill('technical_drawing', 'Fertigungsunterlagen lesen', ['measuring-kit']), skill('cutting', 'Trennen und Zuschneiden', ['metal-saw']), skill('sheet_forming', 'Blech und Profile umformen', ['press-brake']), skill('welding_migmag', 'Schweißbaugruppen fertigen', ['welding-migmag']), skill('mechanical_assembly', 'Baugruppen montieren', ['assembly-bench'])] },
  { id: 'feinwerkmechanik', label: 'Feinwerkmechaniker/in', family: 'Handwerk', qualification: 'Gesellenabschluss Feinwerkmechaniker/in', meister: 'Feinwerkmechanikermeister/in', starterEquipment: 'precision-lathe', skills: [skill('precision_turning', 'Präzisionsdrehen', ['precision-lathe']), skill('precision_milling', 'Präzisionsfräsen', ['precision-mill']), skill('grinding', 'Feinschleifen', ['surface-grinder']), skill('metrology', 'Präzisionsmesstechnik', ['measuring-kit']), skill('fitting', 'Feinmontage und Einpassen', ['assembly-bench'])] },
  { id: 'werkzeugmechanik', label: 'Werkzeugmechaniker/in', family: 'Industrie', qualification: 'Abschluss Werkzeugmechaniker/in', meister: 'Industriemeister/in Metall (Werkzeugbau)', starterEquipment: 'manual-mill', skills: [skill('toolmaking', 'Werkzeuge und Vorrichtungen herstellen', ['manual-mill', 'tool-bench']), skill('cnc_milling', 'CNC-Fräsen', ['cnc-mill']), skill('grinding', 'Werkzeugschleifen', ['surface-grinder']), skill('metrology', 'Werkzeugmaße prüfen', ['measuring-kit']), skill('technical_drawing', 'Werkzeugzeichnungen lesen', ['measuring-kit'])] },
  { id: 'metalltechnik', label: 'Fachkraft für Metalltechnik – Zerspanungstechnik', family: 'Industrie', qualification: 'Abschluss Fachkraft für Metalltechnik', meister: 'Fortsetzungsabschluss/Meister Metall', starterEquipment: 'manual-lathe', skills: [skill('turning_manual', 'Grundlagen Drehen', ['manual-lathe']), skill('milling_manual', 'Grundlagen Fräsen', ['manual-mill']), skill('grinding', 'Grundlagen Schleifen', ['surface-grinder']), skill('drilling', 'Bohren und Senken', ['pillar-drill'])] },
  { id: 'maschinenfuehrung', label: 'Maschinen- und Anlagenführer/in – Metalltechnik', family: 'Industrie', qualification: 'Abschluss Maschinen- und Anlagenführer/in', meister: 'Industriemeister/in Metall', starterEquipment: 'machine-operator-station', skills: [skill('machine_setup', 'Maschinen einrichten', ['machine-operator-station']), skill('machine_operation', 'Maschinen bedienen', ['machine-operator-station']), skill('quality_check', 'Fertigungsqualität prüfen', ['measuring-kit']), skill('maintenance', 'Einfache Wartung', ['maintenance-tools'])] },
  { id: 'giesserei', label: 'Gießereimechaniker/in', family: 'Industrie', qualification: 'Abschluss Gießereimechaniker/in', meister: 'Industriemeister/in Gießerei', starterEquipment: 'foundry-furnace', skills: [skill('mould_making', 'Formen und Kerne herstellen', ['foundry-bench']), skill('metal_casting', 'Metall schmelzen und gießen', ['foundry-furnace']), skill('casting_finishing', 'Gussteile putzen und nacharbeiten', ['grinding-station']), skill('metallurgy', 'Werkstoff- und Gussfehler beurteilen', ['measuring-kit'])] },
  { id: 'stanz_umform', label: 'Stanz- und Umformmechaniker/in', family: 'Industrie', qualification: 'Abschluss Stanz- und Umformmechaniker/in', meister: 'Industriemeister/in Metall (Umformtechnik)', starterEquipment: 'press-brake', skills: [skill('press_setup', 'Stanz-/Umformwerkzeuge rüsten', ['stamping-press']), skill('sheet_forming', 'Blech umformen', ['press-brake']), skill('cnc_press', 'CNC-Presse bedienen', ['cnc-press']), skill('quality_check', 'Maße und Prozessqualität prüfen', ['measuring-kit'])] },
]);

export const V3_BUSINESS_SKILLS = Object.freeze([
  { id: 'operations_lead', label: 'Personalführung und Arbeitsorganisation', category: 'social_method', pathway: 'Wirtschaftsfachwirt/Meister-Spielprofil' },
  { id: 'marketing', label: 'Marketingplanung und Marktbeurteilung', category: 'method', pathway: 'Wirtschaftsfachwirt-Spielprofil; vertieft in V10' },
  { id: 'sales', label: 'Vertrieb und Kundenkommunikation', category: 'social_method', pathway: 'Wirtschaftsfachwirt-Spielprofil; vertieft in V10' },
  { id: 'technical_supervision', label: 'Technische Anleitung und Qualitätssicherung', category: 'method', pathway: 'Meister-Spielprofil; vertieft in V6/V7' },
]);export const V3_GAME_QUALIFICATIONS = Object.freeze([
  { id: 'workplace-safety', label: 'Betriebliche Sicherheitsunterweisung', kind: 'employer_instruction', applies: 'Arbeitsplatz-/maschinenbezogen für den Einsatz; kein Berufsabschluss.' },
  { id: 'welding-iso-9606', label: 'Schweißerprüfung nach passender Norm/Prüfbereich', kind: 'conditional_certificate', applies: 'Nur wenn Vertrag, technische Spezifikation oder anwendbares Regelwerk den passenden gültigen Nachweis verlangt; keine pauschale gesetzliche Schweißlizenz.' },
  { id: 'forklift-authorization', label: 'Staplerqualifizierung und betriebliche Beauftragung', kind: 'conditional_authorization', applies: 'Für Flurförderzeuge nach Unterweisung, Befähigung und betrieblicher Beauftragung.' },
  { id: 'crane-authorization', label: 'Kranqualifizierung und betriebliche Beauftragung', kind: 'conditional_authorization', applies: 'Für Kranbedienung nach erforderlicher Ausbildung/Unterweisung und Beauftragung.' },
  { id: 'trainer-aptitude', label: 'Berufs- und arbeitspädagogische Eignung (AEVO/anerkannt gleichwertig)', kind: 'training_eligibility', applies: 'Zusammen mit persönlicher/fachlicher Eignung und geeigneter Ausbildungsstätte, wenn Auszubildende eingestellt/ausgebildet werden.' },
]);

export const V3_PRODUCT_ARCHETYPES = Object.freeze([
  { id: 'turned-spacer', label: 'Gedrehte Distanzhülse', targetSegment: 'small', marketCapability: 'turning', unitStorage: 0.3, recipe: [{ materialId: 'steel', quantityPerUnit: 0.25 }], requirements: { skills: [{ id: 'turning_manual', level: 2 }], equipment: ['manual-lathe'], qualifications: [] } },
  { id: 'precision-pin', label: 'Präzisionsbolzen', targetSegment: 'small', marketCapability: 'precision-turning', unitStorage: 0.25, recipe: [{ materialId: 'steel', quantityPerUnit: 0.2 }], requirements: { skills: [{ id: 'precision_turning', level: 2 }, { id: 'metrology', level: 2 }], equipment: ['precision-lathe', 'measuring-kit'], qualifications: [] } },
  { id: 'welded-bracket', label: 'Geschweißter Montagewinkel', targetSegment: 'medium', marketCapability: 'welding', unitStorage: 0.8, recipe: [{ materialId: 'steel', quantityPerUnit: 0.9 }], requirements: { skills: [{ id: 'welding_migmag', level: 2 }, { id: 'technical_drawing', level: 1 }], equipment: ['welding-migmag', 'measuring-kit'], qualifications: [] } },
  { id: 'pneumatic-manifold', label: 'Pneumatik-Verteilerbaugruppe', targetSegment: 'medium', marketCapability: 'pneumatics', unitStorage: 1.2, recipe: [{ materialId: 'steel', quantityPerUnit: 0.4 }], requirements: { skills: [{ id: 'pneumatics', level: 2 }, { id: 'mechanical_assembly', level: 2 }], equipment: ['pneumatics-kit', 'assembly-bench'], qualifications: [] } },
  { id: 'stamped-cover', label: 'Gestanzte Abdeckung', targetSegment: 'large', marketCapability: 'forming', unitStorage: 1.5, recipe: [{ materialId: 'steel', quantityPerUnit: 1.8 }], requirements: { skills: [{ id: 'press_setup', level: 2 }, { id: 'sheet_forming', level: 2 }], equipment: ['stamping-press'], qualifications: [] } },
  { id: 'bench-bracket', label: 'Manuell gefertigter Montagewinkel', targetSegment: 'small', marketCapability: 'manual-fabrication', unitStorage: 0.5, recipe: [{ materialId: 'steel', quantityPerUnit: 0.6 }], requirements: { skills: [{ id: 'manual_fabrication', level: 2 }], equipment: ['bench-tools'], qualifications: [] } },
  { id: 'assembly-mount', label: 'Montierte Befestigungsbaugruppe', targetSegment: 'small', marketCapability: 'milling', unitStorage: 0.5, recipe: [{ materialId: 'steel', quantityPerUnit: 0.4 }], requirements: { skills: [{ id: 'mechanical_assembly', level: 2 }], equipment: ['assembly-bench'], qualifications: [] } },
  { id: 'manual-tool-insert', label: 'Manuell gefertigter Werkzeugeinsatz', targetSegment: 'small', marketCapability: 'milling', unitStorage: 0.4, recipe: [{ materialId: 'steel', quantityPerUnit: 0.3 }], requirements: { skills: [{ id: 'toolmaking', level: 2 }], equipment: ['manual-mill'], qualifications: [] } },
  { id: 'machine-turned-part', label: 'Maschinengefertigtes Drehteil', targetSegment: 'small', marketCapability: 'turning', unitStorage: 0.3, recipe: [{ materialId: 'steel', quantityPerUnit: 0.4 }], requirements: { skills: [{ id: 'machine_operation', level: 2 }], equipment: ['machine-operator-station'], qualifications: [] } },
  { id: 'formed-cover', label: 'Umgeformte Abdeckung', targetSegment: 'medium', marketCapability: 'milling', unitStorage: 0.7, recipe: [{ materialId: 'steel', quantityPerUnit: 0.8 }], requirements: { skills: [{ id: 'sheet_forming', level: 2 }], equipment: ['press-brake'], qualifications: [] } },
  { id: 'precision-bushing', label: 'Präzisionsgedrehte Buchse', targetSegment: 'small', marketCapability: 'turning', unitStorage: 0.25, recipe: [{ materialId: 'steel', quantityPerUnit: 0.2 }], requirements: { skills: [{ id: 'precision_turning', level: 2 }], equipment: ['precision-lathe'], qualifications: [] } },
  { id: 'welded-bracket-basic', label: 'Einfacher MAG-Schweißwinkel', targetSegment: 'small', marketCapability: 'milling', unitStorage: 0.6, recipe: [{ materialId: 'steel', quantityPerUnit: 0.7 }], requirements: { skills: [{ id: 'welding_migmag', level: 2 }], equipment: ['welding-migmag'], qualifications: [] } },
  { id: 'qualified-weldment', label: 'Kundenspezifizierte geprüfte Schweißbaugruppe', targetSegment: 'medium', marketCapability: 'welding', unitStorage: 0.9, recipe: [{ materialId: 'steel', quantityPerUnit: 1 }], requirements: { skills: [{ id: 'welding_migmag', level: 2 }], equipment: ['welding-migmag'], qualifications: ['welding-iso-9606'] } },
  { id: 'cast-housing', label: 'Kleines Gussteil-Gehäuse', targetSegment: 'medium', marketCapability: 'casting', unitStorage: 1.1, recipe: [{ materialId: 'steel', quantityPerUnit: 1.4 }], requirements: { skills: [{ id: 'metal_casting', level: 2 }], equipment: ['foundry-furnace'], qualifications: ['workplace-safety'] } },
]);

const EQUIPMENT_LABELS = Object.freeze({
  'measuring-kit':'Messmittel', 'bench-tools':'Handwerkzeug/Grundwerkbank', 'pillar-drill':'Ständerbohrmaschine',
  'sheet-tools':'Blechwerkzeug', 'welding-migmag':'MAG-Schweißgerät', 'manual-lathe':'konventionelle Drehmaschine',
  'manual-mill':'konventionelle Fräsmaschine', 'surface-grinder':'Schleifmaschine', 'cnc-lathe':'CNC-Drehmaschine',
  'assembly-bench':'Montageplatz', 'maintenance-tools':'Wartungswerkzeug', 'pneumatics-kit':'Pneumatik-Prüfmittel',
  'hydraulics-kit':'Hydraulik-Prüfmittel', 'metal-saw':'Metallsäge', 'press-brake':'Abkant-/Umformpresse',
  'tool-bench':'Werkzeugbauplatz', 'cnc-mill':'CNC-Fräsmaschine', 'machine-operator-station':'Maschinenbedienplatz',
  'foundry-bench':'Formerei', 'foundry-furnace':'Gießereiofen', 'grinding-station':'Schleif-/Putzausrüstung',
  'stamping-press':'Stanzpresse', 'cnc-press':'CNC-Presse',
});
export function formatV3RequirementGaps(gaps) {
  const labels = new Map(V3_METAL_OCCUPATIONS.flatMap(row => row.skills).map(row => [row.id, row.label]));
  const qualifications = new Map(V3_GAME_QUALIFICATIONS.map(row => [row.id, row.label]));
  return [
    ...gaps.missingSkills.map(id => 'Fähigkeit: ' + (labels.get(id) ?? id)),
    ...gaps.missingEquipment.map(id => 'Gerät: ' + (EQUIPMENT_LABELS[id] ?? id)),
    ...gaps.missingQualifications.map(id => 'Nachweis: ' + (qualifications.get(id) ?? id)),
  ];
}
export function getV3Occupation(id) { return V3_METAL_OCCUPATIONS.find(row => row.id === id) ?? null; }
export function getV3ProductArchetype(id) { return V3_PRODUCT_ARCHETYPES.find(row => row.id === id) ?? null; }
export function getV3CompetencyLabel(id) { return V3_METAL_OCCUPATIONS.flatMap(row => row.skills).find(row => row.id === id)?.label ?? V3_BUSINESS_SKILLS.find(row => row.id === id)?.label ?? id; }
export function getV3SkillDefinition(id) { return V3_METAL_OCCUPATIONS.flatMap(row => row.skills).find(row => row.id === id) ?? V3_BUSINESS_SKILLS.find(row => row.id === id) ?? null; }

export function createV3StartingResources(occupationId, path = 'geselle-fachwirt') {
  const occupation = getV3Occupation(occupationId);
  if (!occupation) throw new TypeError('Bitte einen gültigen Metallberuf wählen.');
  if (!['geselle-fachwirt', 'meister'].includes(path)) throw new TypeError('Bitte Geselle+Fachwirt oder Meister wählen.');
  const level = path === 'meister' ? 3 : 2;
  const skillLevels = Object.fromEntries(occupation.skills.map(item => [item.id, Math.min(level, item.meisterLevel)]));
  const businessSkills = path === 'geselle-fachwirt' ? { operations_lead: 2, marketing: 2, sales: 2 } : { operations_lead: 2, technical_supervision: 3 };
  Object.assign(skillLevels, businessSkills);
  const people = [{ id: 'P1', displayName: 'Spieler', role: 'Inhaber und Fachkraft', occupationId, qualificationPath: path, qualificationTitle: path === 'meister' ? occupation.meister : `${occupation.qualification} + Wirtschaftsfachwirt`, qualificationLevel: level, hoursPerDay: 8, skills: Object.keys(skillLevels), skillLevels, qualifications: ['workplace-safety'], trainerQualified: false, businessSkills: Object.keys(businessSkills) }];
  const equipment = [{ id: 'STARTER-KIT', name: EQUIPMENT_LABELS[occupation.starterEquipment] ?? occupation.starterEquipment, hoursPerDay: 8, capabilities: [occupation.starterEquipment] }];
  const materials = [{ id: 'steel', quantity: 10 }];
  return { people, equipment, materials, commitments: [], finishedGoodsCapacity: 10, finishedGoodsUsed: 0 };
}

export function getV3RequirementGaps(people, equipment, requirements) {
  const skills = requirements?.skills ?? [];
  const missingSkills = skills.filter(required => !people.some(person => Number(person.skillLevels?.[required.id] ?? (person.skills?.includes(required.id) ? 2 : 0)) >= required.level)).map(row => row.id);
  const missingEquipment = (requirements?.equipment ?? []).filter(capability => !equipment.some(item => item.capabilities?.includes(capability)));
  const missingQualifications = (requirements?.qualifications ?? []).filter(id => !people.some(person => person.qualifications?.includes(id)));
  return { eligible: missingSkills.length + missingEquipment.length + missingQualifications.length === 0, missingSkills, missingEquipment, missingQualifications };
}
export function getV3OperationalMarketCapabilities(people, equipment) {
  return [...new Set(V3_PRODUCT_ARCHETYPES
    .filter(archetype => getV3RequirementGaps(people, equipment, archetype.requirements).eligible)
    .map(archetype => archetype.marketCapability))].sort();
}
