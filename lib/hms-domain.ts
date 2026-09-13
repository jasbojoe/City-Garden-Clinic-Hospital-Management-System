export type UserRole = "admin-doctor" | "reception" | "nurse" | "laboratory" | "pharmacy" | "billing"

export type EncounterStatus = "open" | "draft" | "completed" | "cancelled"
export type EncounterType = "consultation" | "follow-up" | "emergency" | "inpatient"

export type Encounter = {
  id: string
  patientId: string
  mrn: string
  doctor: string
  department: string
  type: EncounterType
  status: EncounterStatus
  date: string
  chiefComplaint: string
  diagnosis?: string
  notes?: string
}

export type AuditEvent = {
  id: string
  entity: string
  entityId: string
  action: "created" | "updated" | "viewed" | "completed" | "exported"
  actor: string
  role: UserRole
  occurredAt: string
  summary: string
}

export type QrPatientPayload = {
  version: 1
  patientId: string
  mrn: string
  name: string
  issuedAt: string
}

export type Permission = "view" | "create" | "edit" | "complete" | "export"

export const roleLabels: Record<UserRole, string> = {
  "admin-doctor": "Admin Doctor",
  reception: "Reception",
  nurse: "Nurse",
  laboratory: "Laboratory",
  pharmacy: "Pharmacy",
  billing: "Billing",
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  "admin-doctor": ["view", "create", "edit", "complete", "export"],
  reception: ["view", "create", "edit"],
  nurse: ["view", "edit"],
  laboratory: ["view", "create", "edit", "complete"],
  pharmacy: ["view", "edit", "complete"],
  billing: ["view", "create", "edit", "export"],
}

export function can(role: UserRole, permission: Permission) {
  return rolePermissions[role].includes(permission)
}
