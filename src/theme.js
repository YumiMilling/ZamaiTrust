// Thiqa v0.3 — Design tokens
// Light theme: airy, modern, warm. High readability.

export const C = {
  // Surfaces — warm off-whites, not clinical
  base: '#FAFAF7',    // page background
  s1:   '#F3F2EF',    // alt section background
  s2:   '#FFFFFF',    // cards
  s3:   '#E8E6E1',    // borders, dividers
  s4:   '#D4D1CC',    // heavier borders

  // Teal (primary) — sophisticated, not neon
  eg:   '#F0FDFA',    // teal tint (backgrounds)
  egMid:'#CCFBF1',    // teal light fill
  egBr: '#5EEAD4',    // teal medium
  egVi: '#14B8A6',    // teal vivid
  egHi: '#0D9488',    // teal deep (primary actions)

  // Copper (accent) — warm, grounded
  cu:   '#FEF3C7',    // amber tint
  cuMid:'#FCD34D',    // amber light
  cuLt: '#F59E0B',    // amber
  cuHi: '#B45309',    // amber deep

  // Text — dark on light, high contrast
  t1: '#1A1A1A',      // headings, primary text
  t2: '#374151',      // body text
  t3: '#6B7280',      // secondary text
  t4: '#9CA3AF',      // tertiary, labels

  // Semantic
  green:   '#059669',  greenLt: '#D1FAE5', greenDk: '#064E3B',
  red:     '#DC2626',  redLt:   '#FEE2E2', redFill: '#FEF2F2',
  purple:  '#7C3AED',  purpleLt:'#EDE9FE',
  coral:   '#EA580C',  coralLt: '#FFF7ED',
  amber:   '#D97706',  amberLt: '#FFFBEB',
  teal:    '#0F766E',  tealLt:  '#F0FDFA', tealFill: '#99F6E4',
  pink:    '#DB2777',
};

// Entity color mapping — vivid on light backgrounds
export const ENTITY_COLORS = {
  party:       { fill: '#F0FDFA', stroke: '#0D9488', text: '#0D9488' },
  event:       { fill: '#D1FAE5', stroke: '#059669', text: '#059669' },
  attestation: { fill: '#FEF3C7', stroke: '#B45309', text: '#92400E' },
  action:      { fill: '#FFF7ED', stroke: '#EA580C', text: '#C2410C' },
  credential:  { fill: '#EDE9FE', stroke: '#7C3AED', text: '#6D28D9' },
};

// Port color mapping
export const PORT_COLORS = {
  payment:      { fill: '#F0FDFA', stroke: '#0D9488' },
  identity:     { fill: '#FEF3C7', stroke: '#B45309' },
  location:     { fill: '#D1FAE5', stroke: '#059669' },
  notification: { fill: '#FFF7ED', stroke: '#EA580C' },
  evidence:     { fill: '#EDE9FE', stroke: '#7C3AED' },
  verification: { fill: '#FCE7F3', stroke: '#DB2777' },
  time:         { fill: '#F5F3FF', stroke: '#6D28D9' },
};

export const FONT = {
  display: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};
