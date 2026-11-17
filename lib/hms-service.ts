import type { AuditEvent, Encounter, QrPatientPayload, UserRole } from "@/lib/hms-domain"
import { appointments, patients } from "@/lib/data"

export const encounters: Encounter[] = appointments.slice(0, 6).map((appointment, index) => ({
  id: `ENC-${String(7001 + index)}`,
  patientId: patients.find((patient) => patient.mrn === appointment.mrn)?.id ?? "p1",
  mrn: appointment.mrn,
  doctor: appointment.doctor,
  department: appointment.department,
  type: index % 3 === 0 ? "follow-up" : "consultation",
  status: appointment.status === "completed" ? "completed" : "open",
  date: appointment.date,
  chiefComplaint: index % 2 === 0 ? "Routine review and symptom follow-up" : "New presenting complaint",
  diagnosis: index % 2 === 0 ? "Stable condition" : undefined,
}))

export const auditEvents: AuditEvent[] = [
  { id: "AUD-01", entity: "Patient", entityId: "p1", action: "updated", actor: "Dr. Abdul Sesay Junior", role: "admin-doctor", occurredAt: "2026-07-18 09:42", summary: "Updated contact details and reviewed allergies" },
  { id: "AUD-02", entity: "Encounter", entityId: "ENC-7001", action: "completed", actor: "Dr. Abdul Daniel Sesay", role: "admin-doctor", occurredAt: "2026-07-17 15:10", summary: "Completed consultation and saved care plan" },
  { id: "AUD-03", entity: "Lab order", entityId: "LAB-4001", action: "created", actor: "Samuel Ortiz", role: "laboratory", occurredAt: "2026-07-17 11:25", summary: "Created CBC and chemistry panel order" },
  { id: "AUD-04", entity: "Patient", entityId: "p1", action: "viewed", actor: "Nurse Grace Adeleke", role: "nurse", occurredAt: "2026-07-17 10:04", summary: "Opened patient record from QR scan" },
]

export function getPatientEncounters(patientId: string) {
  return encounters.filter((encounter) => encounter.patientId === patientId)
}

export function getPatientAuditEvents(patientId: string) {
  return auditEvents.filter((event) => event.entityId === patientId || event.entity === "Encounter")
}

export function createPatientQrPayload(patientId: string): QrPatientPayload | null {
  const patient = patients.find((item) => item.id === patientId)
  if (!patient) return null
  return { version: 1, patientId: patient.id, mrn: patient.mrn, name: patient.name, issuedAt: new Date().toISOString() }
}

export function parsePatientQrPayload(raw: string) {
  try {
    const payload = JSON.parse(raw) as QrPatientPayload
    return payload.version === 1 && payload.patientId && payload.mrn ? payload : null
  } catch {
    return null
  }
}

export function roleForDemo(role: UserRole) {
  return role
}
