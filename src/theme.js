// Thiqa v0.3 — Design tokens
// Dark theme: teal/copper palette from ZamAi brand system

export const C = {
  // Base surfaces
  base: '#0C0B0A', s1: '#161412', s2: '#1F1D1B', s3: '#282523', s4: '#333030',

  // Teal (primary)
  eg: '#073233', egMid: '#0A4A4B', egBr: '#0F7274', egVi: '#14A0A3', egHi: '#19C8CC',

  // Copper (accent)
  cu: '#A86B2A', cuMid: '#C47E3A', cuLt: '#D99550', cuHi: '#E8AE68',

  // Text
  t1: '#F2EDE6', t2: '#C5BFB8', t3: '#8A8480', t4: '#5A5652',

  // Semantic
  green: '#1D9E75', greenLt: '#E1F5EE', greenDk: '#085041',
  red: '#A32D2D', redLt: '#FCEBEB', redFill: '#501313',
  purple: '#534AB7', purpleLt: '#EEEDFE',
  coral: '#D85A30', coralLt: '#FAECE7',
  amber: '#BA7517', amberLt: '#FAEEDA',
  teal: '#0F6E56', tealLt: '#E1F5EE', tealFill: '#5DCAA5',
  pink: '#993556',
};

// Entity color mapping
export const ENTITY_COLORS = {
  party:       { fill: C.eg,      stroke: C.egHi,  text: C.egHi  },
  event:       { fill: '#0A2E1A', stroke: C.green,  text: C.green },
  attestation: { fill: '#2A1A08', stroke: C.cuHi,   text: C.cuHi  },
  action:      { fill: '#1A0E08', stroke: C.coral,   text: C.coral },
  credential:  { fill: '#1A1530', stroke: C.purple,  text: '#8B83DB' },
};

// Port color mapping
export const PORT_COLORS = {
  payment:      { fill: C.eg,      stroke: C.egHi  },
  identity:     { fill: '#2A1A08', stroke: C.cuHi  },
  location:     { fill: '#0A2E1A', stroke: C.green },
  notification: { fill: '#1A0E08', stroke: C.coral },
  time:         { fill: '#1A1530', stroke: '#8B83DB' },
};

export const FONT = {
  display: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};
