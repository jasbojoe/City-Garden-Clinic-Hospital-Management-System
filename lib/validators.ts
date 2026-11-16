import { z } from 'zod'

export const PatientInsertSchema = z.object({
  facilityId: z.string().uuid(),
  firstName: z.string().min(1),
  middleName: z.string().nullable().optional(),
  lastName: z.string().min(1),
  dateOfBirth: z.string().date().nullable().optional(),
  dateOfBirthEstimated: z.boolean().default(false),
  gender: z.enum(['Male', 'Female', 'Other']).nullable().optional(),
  phonePrimary: z.string().nullable().optional(),
  phoneSecondary: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  addressLine1: z.string().nullable().optional(),
  addressLine2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  country: z.string().default('SL'),
  status: z.enum(['active', 'admitted', 'discharged', 'inactive']).default('active'),
})

export const AppointmentInsertSchema = z.object({
  patientId: z.string().uuid(),
  facilityId: z.string().uuid(),
  departmentId: z.string().uuid().nullable().optional(),
  staffId: z.string().uuid().nullable().optional(),
  scheduledAt: z.string().datetime(),
  status: z.enum(['scheduled', 'checked-in', 'completed', 'cancelled']).default('scheduled'),
})

export const EncounterInsertSchema = z.object({
  patientId: z.string().uuid(),
  facilityId: z.string().uuid(),
  appointmentId: z.string().uuid().nullable().optional(),
  departmentId: z.string().uuid().nullable().optional(),
  staffId: z.string().uuid().nullable().optional(),
  encounterType: z.enum(['consultation', 'follow-up', 'emergency', 'inpatient']),
  status: z.enum(['open', 'draft', 'completed', 'cancelled']).default('open'),
})

export const PrescriptionInsertSchema = z.object({
  encounterId: z.string().uuid(),
  patientId: z.string().uuid(),
  prescribedByStaffId: z.string().uuid(),
  status: z.enum(['draft', 'active', 'dispensed', 'cancelled']).default('draft'),
})

export const InvoiceInsertSchema = z.object({
  patientId: z.string().uuid(),
  encounterId: z.string().uuid().nullable().optional(),
  amountDue: z.number().min(0),
  amountPaid: z.number().min(0).default(0),
  currency: z.literal('SLE').default('SLE'),
  status: z.enum(['draft', 'issued', 'partially-paid', 'paid', 'void']).default('draft'),
})

export const PaymentInsertSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().min(0),
  method: z.enum(['cash', 'orange-money', 'afrimoney', 'vult', 'bank-transfer', 'insurance', 'corporate-account']),
  reference: z.string().nullable().optional(),
})

export const PatientDemographicsSchema = PatientInsertSchema.omit({ facilityId: true })

export const StaffCreateSchema = z.object({
  employeeNumber: z.string().trim().min(1).max(50),
  firstName: z.string().trim().min(1).max(100),
  middleName: z.string().trim().max(100).nullable().optional(),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(40).nullable().optional(),
  email: z.string().email(),
  departmentId: z.string().uuid().nullable().optional(),
  jobTitle: z.string().trim().max(120).nullable().optional(),
  professionalLicenseNumber: z.string().trim().max(100).nullable().optional(),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const PasswordResetRequestSchema = z.object({ email: z.string().email() })

export const PasswordResetSchema = z.object({
  password: z.string().min(12).max(128),
  confirmPassword: z.string().min(12).max(128),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})

export type PatientInsert = z.infer<typeof PatientInsertSchema>
export type PatientDemographics = z.infer<typeof PatientDemographicsSchema>
export type StaffCreate = z.infer<typeof StaffCreateSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>
export type PasswordReset = z.infer<typeof PasswordResetSchema>
export type AppointmentInsert = z.infer<typeof AppointmentInsertSchema>
export type EncounterInsert = z.infer<typeof EncounterInsertSchema>
export type PrescriptionInsert = z.infer<typeof PrescriptionInsertSchema>
export type InvoiceInsert = z.infer<typeof InvoiceInsertSchema>
export type PaymentInsert = z.infer<typeof PaymentInsertSchema>
