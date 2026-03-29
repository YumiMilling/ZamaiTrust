/**
 * Capability-Based Access Control — Shared Type Definitions
 * DEC-002: Capabilities over roles. These types are used by:
 * - Frontend (capability-gated routing + UI)
 * - Edge Functions (capability checks in business logic)
 * - Seed data generators
 */

// Every capability in the system
export const CAPABILITIES = {
  // Contracts
  'contracts.view': { module: 'contracts', access: 'read' },
  'contracts.create': { module: 'contracts', access: 'write' },
  'contracts.accept': { module: 'contracts', access: 'write' },
  // Deliveries
  'deliveries.handshake': { module: 'deliveries', access: 'write' },
  'deliveries.view': { module: 'deliveries', access: 'read' },
  // Financial
  'financial.view': { module: 'financial', access: 'read' },
  'financial.trigger': { module: 'financial', access: 'write' },
  // Quality
  'quality.write': { module: 'quality', access: 'write' },
  'quality.view': { module: 'quality', access: 'read' },
  // Training
  'training.write': { module: 'training', access: 'write' },
  'training.view': { module: 'training', access: 'read' },
  // Monitoring
  'monitoring.write': { module: 'monitoring', access: 'write' },
  'monitoring.view': { module: 'monitoring', access: 'read' },
  // Governance
  'governance.propose': { module: 'governance', access: 'write' },
  'governance.vote': { module: 'governance', access: 'write' },
  'governance.view': { module: 'governance', access: 'read' },
  // Trust
  'trust.view': { module: 'trust', access: 'read' },
  // Insurance
  'insurance.view': { module: 'insurance', access: 'read' },
  'insurance.manage': { module: 'insurance', access: 'write' },
  // Cases
  'cases.file': { module: 'cases', access: 'write' },
  'cases.view': { module: 'cases', access: 'read' },
  'cases.mediate': { module: 'cases', access: 'write' },
  'cases.arbitrate': { module: 'cases', access: 'write' },
  // Partner
  'partner.write': { module: 'partner', access: 'write' },
  'partner.view': { module: 'partner', access: 'read' },
  // Issues
  'issues.raise': { module: 'issues', access: 'write' },
  'issues.view': { module: 'issues', access: 'read' },
  // Anomaly
  'anomaly.view': { module: 'anomaly', access: 'read' },
  'anomaly.investigate': { module: 'anomaly', access: 'write' },
  // Audit
  'audit.view': { module: 'audit', access: 'read' },
  // Enforcement
  'enforcement.suspend': { module: 'enforcement', access: 'admin' },
  'enforcement.evidence': { module: 'enforcement', access: 'admin' },
  'enforcement.eject': { module: 'enforcement', access: 'admin' },
  // Admin
  'admin.users': { module: 'admin', access: 'admin' },
  'admin.capabilities': { module: 'admin', access: 'admin' },
  'admin.merkle': { module: 'admin', access: 'admin' },
  'admin.waterfall': { module: 'admin', access: 'admin' },
} as const;

export type CapabilityId = keyof typeof CAPABILITIES;

export type ScopeLevel = 'own' | 'assigned' | 'district' | 'province' | 'national' | 'facility' | 'actuarial' | 'custom';

export type AccessType = 'read' | 'write' | 'admin';

// Scope level hierarchy (higher number = broader scope)
export const SCOPE_RANK: Record<ScopeLevel, number> = {
  own: 1,
  assigned: 2,
  district: 3,
  province: 4,
  national: 5,
  facility: 3,
  actuarial: 3,
  custom: 3,
};

// Preset definitions — which capabilities each preset gets
export type PresetId =
  | 'farmer_cluster' | 'cluster_leader' | 'processor' | 'depot_operator'
  | 'input_supplier' | 'extension_officer' | 'district_coordinator'
  | 'provincial_coordinator' | 'zareta' | 'implementing_partner'
  | 'insurer' | 'zattf_staff';

export interface PresetCapability {
  capabilityId: CapabilityId;
  defaultScope: ScopeLevel;
}

export const PRESETS: Record<PresetId, { name: string; seesFinancials: string; capabilities: PresetCapability[] }> = {
  farmer_cluster: {
    name: 'Farmer (Cluster Member)',
    seesFinancials: 'Own only',
    capabilities: [
      { capabilityId: 'contracts.view', defaultScope: 'own' },
      { capabilityId: 'contracts.accept', defaultScope: 'own' },
      { capabilityId: 'deliveries.handshake', defaultScope: 'own' },
      { capabilityId: 'deliveries.view', defaultScope: 'own' },
      { capabilityId: 'financial.view', defaultScope: 'own' },
      { capabilityId: 'governance.vote', defaultScope: 'own' },
      { capabilityId: 'governance.view', defaultScope: 'own' },
      { capabilityId: 'trust.view', defaultScope: 'own' },
      { capabilityId: 'quality.view', defaultScope: 'own' },
      { capabilityId: 'cases.file', defaultScope: 'own' },
      { capabilityId: 'cases.view', defaultScope: 'own' },
    ],
  },
  processor: {
    name: 'Processor',
    seesFinancials: 'Own only',
    capabilities: [
      { capabilityId: 'contracts.create', defaultScope: 'own' },
      { capabilityId: 'contracts.view', defaultScope: 'own' },
      { capabilityId: 'deliveries.handshake', defaultScope: 'own' },
      { capabilityId: 'deliveries.view', defaultScope: 'own' },
      { capabilityId: 'financial.view', defaultScope: 'own' },
      { capabilityId: 'financial.trigger', defaultScope: 'own' },
      { capabilityId: 'quality.view', defaultScope: 'own' },
      { capabilityId: 'trust.view', defaultScope: 'own' },
      { capabilityId: 'cases.file', defaultScope: 'own' },
      { capabilityId: 'cases.view', defaultScope: 'own' },
    ],
  },
  depot_operator: {
    name: 'Depot Operator',
    seesFinancials: 'No',
    capabilities: [
      { capabilityId: 'deliveries.handshake', defaultScope: 'own' },
      { capabilityId: 'deliveries.view', defaultScope: 'own' },
      { capabilityId: 'quality.write', defaultScope: 'own' },
      { capabilityId: 'quality.view', defaultScope: 'own' },
      { capabilityId: 'trust.view', defaultScope: 'own' },
    ],
  },
  extension_officer: {
    name: 'Extension Officer',
    seesFinancials: 'No',
    capabilities: [
      { capabilityId: 'deliveries.view', defaultScope: 'assigned' },
      { capabilityId: 'quality.view', defaultScope: 'assigned' },
      { capabilityId: 'training.write', defaultScope: 'own' },
      { capabilityId: 'training.view', defaultScope: 'assigned' },
      { capabilityId: 'monitoring.write', defaultScope: 'own' },
      { capabilityId: 'monitoring.view', defaultScope: 'assigned' },
      { capabilityId: 'trust.view', defaultScope: 'assigned' },
      { capabilityId: 'cases.mediate', defaultScope: 'assigned' },
      { capabilityId: 'issues.raise', defaultScope: 'own' },
      { capabilityId: 'issues.view', defaultScope: 'assigned' },
    ],
  },
  // Remaining presets with lighter definitions for now
  cluster_leader: { name: 'Cluster Leader', seesFinancials: 'Own only', capabilities: [] },
  input_supplier: { name: 'Input Supplier', seesFinancials: 'Own only', capabilities: [] },
  district_coordinator: { name: 'District Coordinator', seesFinancials: 'Aggregate only', capabilities: [] },
  provincial_coordinator: { name: 'Provincial Coordinator', seesFinancials: 'Aggregate only', capabilities: [] },
  zareta: { name: 'ZARETA', seesFinancials: 'Aggregate only', capabilities: [] },
  implementing_partner: { name: 'Implementing Partner', seesFinancials: 'No', capabilities: [] },
  insurer: { name: 'Insurer', seesFinancials: 'Actuarial only', capabilities: [] },
  zattf_staff: { name: 'ZATTF Staff', seesFinancials: 'Facility aggregate', capabilities: [] },
};

/**
 * Check if a user's scope level is sufficient for a required scope
 */
export function hasScope(userScope: ScopeLevel, requiredScope: ScopeLevel): boolean {
  return SCOPE_RANK[userScope] >= SCOPE_RANK[requiredScope];
}
