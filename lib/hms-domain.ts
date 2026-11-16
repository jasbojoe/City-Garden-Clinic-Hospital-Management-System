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

export type Facility = {
  id: string
  code: string
  name: string
  address: string | null
  city: string | null
  region: string | null
  country: string
  phone: string | null
  email: string | null
  isActive: boolean
}

export type Department = {
  id: string
  facilityId: string
  code: string
  name: string
  description: string | null
  isActive: boolean
}

export type Staff = {
  id: string
  employeeNumber: string
  firstName: string
  middleName: string | null
  lastName: string
  phone: string | null
  email: string
  departmentId: string | null
  jobTitle: string | null
  professionalLicenseNumber: string | null
  status: "active" | "on-leave" | "inactive" | "suspended"
}

export type Role = {
  id: string
  name: string
  description: string | null
  isSystemRole: boolean
}

export type PermissionDefinition = {
  id: string
  code: string
  description: string
}

export type Patient = {
  id: string
  facilityId: string
  mrn: string
  firstName: string
  middleName: string | null
  lastName: string
  dateOfBirth: string | null
  dateOfBirthEstimated: boolean
  gender: string | null
  phonePrimary: string | null
  phoneSecondary: string | null
  email: string | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  region: string | null
  country: string
  status: "active" | "admitted" | "discharged" | "inactive"
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export type Appointment = {
  id: string
  patientId: string
  facilityId: string
  departmentId: string | null
  staffId: string | null
  scheduledAt: string
  status: "scheduled" | "checked-in" | "completed" | "cancelled"
}

export type QueueEntry = {
  id: string
  patientId: string
  appointmentId: string | null
  facilityId: string
  priority: "normal" | "urgent" | "emergency"
  status: "waiting" | "in-consultation" | "completed"
  createdAt: string
}

export type PatientIdentifier = {
  id: string
  patientId: string
  identifierType: string
  identifierValue: string
  issuedBy: string | null
}

export type PatientContact = {
  id: string
  patientId: string
  contactType: string
  fullName: string
  relationship: string | null
  phone: string
  address: string | null
  isPrimary: boolean
}

export type PatientAllergy = {
  id: string
  patientId: string
  allergen: string
  reaction: string | null
  severity: "mild" | "moderate" | "severe" | "unknown"
  status: "active" | "resolved"
}

export type VitalSigns = {
  measuredAt: string
  temperatureCelsius: number | null
  systolicBloodPressure: number | null
  diastolicBloodPressure: number | null
  heartRateBpm: number | null
  respiratoryRateBpm: number | null
  oxygenSaturationPercent: number | null
  weightKilograms: number | null
  heightCentimeters: number | null
}

export type ClinicalNote = {
  id: string
  encounterId: string
  authorId: string
  noteType: string
  content: string
  createdAt: string
  finalizedAt: string | null
}

export type LabOrder = {
  id: string
  encounterId: string
  patientId: string
  testCode: string
  status: "ordered" | "collected" | "processing" | "completed" | "cancelled"
  orderedAt: string
}

export type Prescription = {
  id: string
  encounterId: string
  patientId: string
  prescribedBy: string
  status: "draft" | "active" | "dispensed" | "cancelled"
  createdAt: string
}

export type PaymentMethod = "cash" | "orange-money" | "afrimoney" | "vult" | "bank-transfer" | "insurance" | "corporate-account"

export type Invoice = {
  id: string
  patientId: string
  encounterId: string | null
  amountDue: number
  amountPaid: number
  currency: "SLE"
  status: "draft" | "issued" | "partially-paid" | "paid" | "void"
}

export type Payment = {
  id: string
  invoiceId: string
  amount: number
  method: PaymentMethod
  receivedAt: string
  reference: string | null
}

export type RecordMigration = {
  id: string
  patientId: string | null
  status: "awaiting-scan" | "scanned" | "needs-review" | "verified" | "completed" | "rejected"
  sourceReference: string | null
  createdAt: string
}

export type AuditLog = {
  id: string
  actorUserId: string | null
  facilityId: string | null
  action: string
  entityType: string
  entityId: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

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
