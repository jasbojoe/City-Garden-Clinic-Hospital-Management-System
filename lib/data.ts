// Static sample data for the City Garden Clinic HMS prototype.
// This is a visual demo only — no database or real data is used.

export type PatientStatus = "active" | "admitted" | "discharged" | "inactive"

export type Patient = {
  id: string
  mrn: string
  name: string
  gender: "Male" | "Female"
  age: number
  dob: string
  phone: string
  email: string
  bloodGroup: string
  status: PatientStatus
  lastVisit: string
  department: string
  address: string
  allergies: string[]
  insurance: string
  emergencyContact: string
}

export const patients: Patient[] = [
  { id: "p1", mrn: "MRN-10234", name: "Amara Okafor", gender: "Female", age: 34, dob: "1991-03-12", phone: "+1 (555) 210-8841", email: "amara.okafor@example.com", bloodGroup: "O+", status: "active", lastVisit: "2026-07-14", department: "Cardiology", address: "482 Maple Avenue, Springfield", allergies: ["Penicillin"], insurance: "BlueShield • BS-4432", emergencyContact: "Chidi Okafor • +1 (555) 210-1102" },
  { id: "p2", mrn: "MRN-10235", name: "James Whitfield", gender: "Male", age: 58, dob: "1967-11-02", phone: "+1 (555) 774-2210", email: "james.whitfield@example.com", bloodGroup: "A-", status: "admitted", lastVisit: "2026-07-16", department: "Orthopedics", address: "17 Birch Road, Lakeview", allergies: ["Sulfa drugs", "Latex"], insurance: "Aetna • AE-9981", emergencyContact: "Mary Whitfield • +1 (555) 774-6650" },
  { id: "p3", mrn: "MRN-10236", name: "Priya Nair", gender: "Female", age: 27, dob: "1998-06-25", phone: "+1 (555) 991-3320", email: "priya.nair@example.com", bloodGroup: "B+", status: "active", lastVisit: "2026-07-12", department: "Dermatology", address: "9 Cedar Lane, Riverton", allergies: [], insurance: "Cigna • CG-2214", emergencyContact: "Arjun Nair • +1 (555) 991-7789" },
  { id: "p4", mrn: "MRN-10237", name: "Miguel Santos", gender: "Male", age: 45, dob: "1980-09-18", phone: "+1 (555) 332-9087", email: "miguel.santos@example.com", bloodGroup: "AB+", status: "discharged", lastVisit: "2026-07-09", department: "General Medicine", address: "220 Oak Street, Fairview", allergies: ["Aspirin"], insurance: "United • UN-7742", emergencyContact: "Lucia Santos • +1 (555) 332-1145" },
  { id: "p5", mrn: "MRN-10238", name: "Fatima Al-Rashid", gender: "Female", age: 62, dob: "1963-01-30", phone: "+1 (555) 445-6621", email: "fatima.rashid@example.com", bloodGroup: "O-", status: "admitted", lastVisit: "2026-07-17", department: "Neurology", address: "58 Elm Court, Brookside", allergies: ["Iodine"], insurance: "BlueShield • BS-1123", emergencyContact: "Yusuf Al-Rashid • +1 (555) 445-2200" },
  { id: "p6", mrn: "MRN-10239", name: "Daniel Kim", gender: "Male", age: 39, dob: "1986-12-05", phone: "+1 (555) 660-4432", email: "daniel.kim@example.com", bloodGroup: "A+", status: "active", lastVisit: "2026-07-15", department: "Cardiology", address: "134 Pine Blvd, Westend", allergies: [], insurance: "Aetna • AE-3321", emergencyContact: "Grace Kim • +1 (555) 660-9987" },
  { id: "p7", mrn: "MRN-10240", name: "Sophie Laurent", gender: "Female", age: 51, dob: "1974-08-22", phone: "+1 (555) 220-7734", email: "sophie.laurent@example.com", bloodGroup: "B-", status: "inactive", lastVisit: "2026-05-28", department: "Endocrinology", address: "76 Willow Way, Hilltop", allergies: ["Peanuts"], insurance: "Cigna • CG-8890", emergencyContact: "Paul Laurent • +1 (555) 220-3312" },
  { id: "p8", mrn: "MRN-10241", name: "Ethan Brooks", gender: "Male", age: 23, dob: "2002-04-14", phone: "+1 (555) 118-2245", email: "ethan.brooks@example.com", bloodGroup: "O+", status: "active", lastVisit: "2026-07-11", department: "Pulmonology", address: "301 Aspen Drive, Meadowland", allergies: [], insurance: "United • UN-5567", emergencyContact: "Nora Brooks • +1 (555) 118-6690" },
  { id: "p9", mrn: "MRN-10242", name: "Hana Suzuki", gender: "Female", age: 30, dob: "1995-10-08", phone: "+1 (555) 909-1123", email: "hana.suzuki@example.com", bloodGroup: "AB-", status: "active", lastVisit: "2026-07-13", department: "Obstetrics", address: "12 Spruce Terrace, Eastgate", allergies: ["Codeine"], insurance: "BlueShield • BS-6674", emergencyContact: "Ken Suzuki • +1 (555) 909-7781" },
  { id: "p10", mrn: "MRN-10243", name: "Robert Mensah", gender: "Male", age: 67, dob: "1958-02-19", phone: "+1 (555) 556-8890", email: "robert.mensah@example.com", bloodGroup: "A+", status: "admitted", lastVisit: "2026-07-17", department: "Nephrology", address: "89 Magnolia Ave, Southport", allergies: ["Penicillin", "Shellfish"], insurance: "Aetna • AE-2298", emergencyContact: "Abena Mensah • +1 (555) 556-1120" },
  { id: "p11", mrn: "MRN-10244", name: "Isabella Rossi", gender: "Female", age: 42, dob: "1983-07-03", phone: "+1 (555) 332-4478", email: "isabella.rossi@example.com", bloodGroup: "O+", status: "active", lastVisit: "2026-07-10", department: "Gastroenterology", address: "47 Chestnut St, Northfield", allergies: [], insurance: "Cigna • CG-4451", emergencyContact: "Marco Rossi • +1 (555) 332-9982" },
  { id: "p12", mrn: "MRN-10245", name: "Liam O'Connor", gender: "Male", age: 36, dob: "1989-05-27", phone: "+1 (555) 771-3390", email: "liam.oconnor@example.com", bloodGroup: "B+", status: "discharged", lastVisit: "2026-07-06", department: "Orthopedics", address: "63 Poplar Road, Glenwood", allergies: ["Ibuprofen"], insurance: "United • UN-1183", emergencyContact: "Erin O'Connor • +1 (555) 771-7745" },
]

export type Doctor = {
  id: string
  name: string
  department: string
  specialty: string
}

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Elena Vasquez", department: "Cardiology", specialty: "Interventional Cardiology" },
  { id: "d2", name: "Dr. Marcus Chen", department: "Orthopedics", specialty: "Joint Reconstruction" },
  { id: "d3", name: "Dr. Aisha Bello", department: "Neurology", specialty: "Stroke & Epilepsy" },
  { id: "d4", name: "Dr. Thomas Reed", department: "General Medicine", specialty: "Internal Medicine" },
  { id: "d5", name: "Dr. Nadia Petrov", department: "Dermatology", specialty: "Clinical Dermatology" },
  { id: "d6", name: "Dr. Samuel Adeyemi", department: "Pulmonology", specialty: "Respiratory Care" },
  { id: "d7", name: "Dr. Abdul Sesay Junior", department: "Administration", specialty: "Admin Doctor" },
  { id: "d8", name: "Dr. Abdul Daniel Sesay", department: "Administration", specialty: "Admin Doctor" },
]

export const departments = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "General Medicine",
  "Dermatology",
  "Pulmonology",
  "Endocrinology",
  "Obstetrics",
  "Nephrology",
  "Gastroenterology",
]

export type AppointmentStatus = "scheduled" | "checked-in" | "completed" | "cancelled"

export type Appointment = {
  id: string
  patient: string
  mrn: string
  doctor: string
  department: string
  date: string
  time: string
  type: string
  status: AppointmentStatus
}

export const appointments: Appointment[] = [
  { id: "a1", patient: "Amara Okafor", mrn: "MRN-10234", doctor: "Dr. Elena Vasquez", department: "Cardiology", date: "2026-07-18", time: "09:00", type: "Follow-up", status: "scheduled" },
  { id: "a2", patient: "Daniel Kim", mrn: "MRN-10239", doctor: "Dr. Elena Vasquez", department: "Cardiology", date: "2026-07-18", time: "09:30", type: "Consultation", status: "checked-in" },
  { id: "a3", patient: "Priya Nair", mrn: "MRN-10236", doctor: "Dr. Nadia Petrov", department: "Dermatology", date: "2026-07-18", time: "10:00", type: "New Patient", status: "scheduled" },
  { id: "a4", patient: "Ethan Brooks", mrn: "MRN-10241", doctor: "Dr. Samuel Adeyemi", department: "Pulmonology", date: "2026-07-18", time: "10:45", type: "Follow-up", status: "completed" },
  { id: "a5", patient: "Isabella Rossi", mrn: "MRN-10244", doctor: "Dr. Thomas Reed", department: "General Medicine", date: "2026-07-18", time: "11:15", type: "Consultation", status: "scheduled" },
  { id: "a6", patient: "James Whitfield", mrn: "MRN-10235", doctor: "Dr. Marcus Chen", department: "Orthopedics", date: "2026-07-18", time: "13:00", type: "Post-op Review", status: "scheduled" },
  { id: "a7", patient: "Fatima Al-Rashid", mrn: "MRN-10238", doctor: "Dr. Aisha Bello", department: "Neurology", date: "2026-07-18", time: "14:00", type: "Follow-up", status: "cancelled" },
  { id: "a8", patient: "Hana Suzuki", mrn: "MRN-10242", doctor: "Dr. Thomas Reed", department: "Obstetrics", date: "2026-07-18", time: "15:15", type: "Prenatal Check", status: "scheduled" },
]

export type QueueStatus = "waiting" | "in-consultation" | "completed"

export type QueueEntry = {
  id: string
  number: number
  patient: string
  mrn: string
  doctor: string
  department: string
  waitingSince: string
  waitMinutes: number
  priority: "Normal" | "Urgent" | "Emergency"
  status: QueueStatus
}

export const queue: QueueEntry[] = [
  { id: "q1", number: 12, patient: "Daniel Kim", mrn: "MRN-10239", doctor: "Dr. Elena Vasquez", department: "Cardiology", waitingSince: "08:52", waitMinutes: 18, priority: "Normal", status: "in-consultation" },
  { id: "q2", number: 13, patient: "Amara Okafor", mrn: "MRN-10234", doctor: "Dr. Elena Vasquez", department: "Cardiology", waitingSince: "09:05", waitMinutes: 25, priority: "Normal", status: "waiting" },
  { id: "q3", number: 14, patient: "Robert Mensah", mrn: "MRN-10243", doctor: "Dr. Aisha Bello", department: "Neurology", waitingSince: "09:12", waitMinutes: 33, priority: "Urgent", status: "waiting" },
  { id: "q4", number: 15, patient: "Priya Nair", mrn: "MRN-10236", doctor: "Dr. Nadia Petrov", department: "Dermatology", waitingSince: "09:20", waitMinutes: 12, priority: "Normal", status: "waiting" },
  { id: "q5", number: 16, patient: "Ethan Brooks", mrn: "MRN-10241", doctor: "Dr. Samuel Adeyemi", department: "Pulmonology", waitingSince: "09:28", waitMinutes: 8, priority: "Normal", status: "waiting" },
  { id: "q6", number: 17, patient: "Fatima Al-Rashid", mrn: "MRN-10238", doctor: "Dr. Aisha Bello", department: "Neurology", waitingSince: "09:31", waitMinutes: 45, priority: "Emergency", status: "waiting" },
  { id: "q7", number: 11, patient: "Isabella Rossi", mrn: "MRN-10244", doctor: "Dr. Thomas Reed", department: "General Medicine", waitingSince: "08:40", waitMinutes: 0, priority: "Normal", status: "completed" },
]

export type LabStatus = "pending" | "in-progress" | "completed"

export type LabTest = {
  id: string
  patient: string
  mrn: string
  test: string
  category: string
  requestedBy: string
  requestedAt: string
  status: LabStatus
  priority: "Routine" | "Urgent"
}

export const labTests: LabTest[] = [
  { id: "l1", patient: "James Whitfield", mrn: "MRN-10235", test: "Complete Blood Count", category: "Hematology", requestedBy: "Dr. Marcus Chen", requestedAt: "2026-07-18 08:15", status: "pending", priority: "Urgent" },
  { id: "l2", patient: "Fatima Al-Rashid", mrn: "MRN-10238", test: "MRI Brain", category: "Radiology", requestedBy: "Dr. Aisha Bello", requestedAt: "2026-07-18 08:40", status: "in-progress", priority: "Urgent" },
  { id: "l3", patient: "Daniel Kim", mrn: "MRN-10239", test: "Lipid Profile", category: "Biochemistry", requestedBy: "Dr. Elena Vasquez", requestedAt: "2026-07-18 09:10", status: "pending", priority: "Routine" },
  { id: "l4", patient: "Robert Mensah", mrn: "MRN-10243", test: "Kidney Function Test", category: "Biochemistry", requestedBy: "Dr. Thomas Reed", requestedAt: "2026-07-18 09:25", status: "pending", priority: "Routine" },
  { id: "l5", patient: "Amara Okafor", mrn: "MRN-10234", test: "Troponin I", category: "Cardiac Markers", requestedBy: "Dr. Elena Vasquez", requestedAt: "2026-07-17 16:30", status: "completed", priority: "Urgent" },
  { id: "l6", patient: "Priya Nair", mrn: "MRN-10236", test: "Skin Biopsy", category: "Pathology", requestedBy: "Dr. Nadia Petrov", requestedAt: "2026-07-17 14:20", status: "completed", priority: "Routine" },
  { id: "l7", patient: "Hana Suzuki", mrn: "MRN-10242", test: "Glucose Tolerance", category: "Biochemistry", requestedBy: "Dr. Thomas Reed", requestedAt: "2026-07-17 11:05", status: "completed", priority: "Routine" },
]

export type Medicine = {
  id: string
  name: string
  category: string
  batch: string
  stock: number
  reorderLevel: number
  expiry: string
  unitPrice: number
}

export const medicines: Medicine[] = [
  { id: "m1", name: "Amoxicillin 500mg", category: "Antibiotic", batch: "AMX-2291", stock: 420, reorderLevel: 100, expiry: "2027-04-30", unitPrice: 0.35 },
  { id: "m2", name: "Paracetamol 500mg", category: "Analgesic", batch: "PCM-8834", stock: 1280, reorderLevel: 300, expiry: "2027-11-15", unitPrice: 0.08 },
  { id: "m3", name: "Atorvastatin 20mg", category: "Cardiovascular", batch: "ATV-1120", stock: 64, reorderLevel: 80, expiry: "2026-09-20", unitPrice: 0.42 },
  { id: "m4", name: "Metformin 850mg", category: "Antidiabetic", batch: "MET-4471", stock: 540, reorderLevel: 150, expiry: "2027-02-28", unitPrice: 0.12 },
  { id: "m5", name: "Salbutamol Inhaler", category: "Respiratory", batch: "SLB-9902", stock: 38, reorderLevel: 50, expiry: "2026-08-10", unitPrice: 5.4 },
  { id: "m6", name: "Omeprazole 20mg", category: "Gastro", batch: "OMP-3345", stock: 210, reorderLevel: 100, expiry: "2027-06-05", unitPrice: 0.22 },
  { id: "m7", name: "Ibuprofen 400mg", category: "Analgesic", batch: "IBU-7788", stock: 92, reorderLevel: 120, expiry: "2026-12-01", unitPrice: 0.1 },
  { id: "m8", name: "Insulin Glargine", category: "Antidiabetic", batch: "INS-5521", stock: 26, reorderLevel: 40, expiry: "2026-07-29", unitPrice: 18.6 },
]

export type PrescriptionQueueItem = {
  id: string
  patient: string
  mrn: string
  doctor: string
  items: number
  status: "pending" | "dispensed"
  time: string
}

export const prescriptionQueue: PrescriptionQueueItem[] = [
  { id: "rx1", patient: "Amara Okafor", mrn: "MRN-10234", doctor: "Dr. Elena Vasquez", items: 3, status: "pending", time: "09:15" },
  { id: "rx2", patient: "Ethan Brooks", mrn: "MRN-10241", doctor: "Dr. Samuel Adeyemi", items: 2, status: "pending", time: "10:50" },
  { id: "rx3", patient: "Priya Nair", mrn: "MRN-10236", doctor: "Dr. Nadia Petrov", items: 1, status: "dispensed", time: "08:30" },
  { id: "rx4", patient: "Miguel Santos", mrn: "MRN-10237", doctor: "Dr. Thomas Reed", items: 4, status: "dispensed", time: "08:05" },
]

export type InvoiceStatus = "paid" | "partial" | "unpaid"

export type Invoice = {
  id: string
  patient: string
  mrn: string
  date: string
  consultation: number
  laboratory: number
  medication: number
  admission: number
  total: number
  paid: number
  status: InvoiceStatus
  method: string
}

export const invoices: Invoice[] = [
  { id: "INV-2041", patient: "Amara Okafor", mrn: "MRN-10234", date: "2026-07-18", consultation: 80, laboratory: 145, medication: 32, admission: 0, total: 257, paid: 257, status: "paid", method: "Card" },
  { id: "INV-2042", patient: "James Whitfield", mrn: "MRN-10235", date: "2026-07-18", consultation: 120, laboratory: 210, medication: 58, admission: 900, total: 1288, paid: 600, status: "partial", method: "Insurance" },
  { id: "INV-2043", patient: "Priya Nair", mrn: "MRN-10236", date: "2026-07-17", consultation: 90, laboratory: 180, medication: 12, admission: 0, total: 282, paid: 0, status: "unpaid", method: "—" },
  { id: "INV-2044", patient: "Fatima Al-Rashid", mrn: "MRN-10238", date: "2026-07-17", consultation: 150, laboratory: 640, medication: 74, admission: 1200, total: 2064, paid: 2064, status: "paid", method: "Insurance" },
  { id: "INV-2045", patient: "Daniel Kim", mrn: "MRN-10239", date: "2026-07-16", consultation: 80, laboratory: 95, medication: 21, admission: 0, total: 196, paid: 100, status: "partial", method: "Cash" },
  { id: "INV-2046", patient: "Isabella Rossi", mrn: "MRN-10244", date: "2026-07-16", consultation: 90, laboratory: 130, medication: 40, admission: 0, total: 260, paid: 260, status: "paid", method: "Card" },
]

export type Ward = {
  id: string
  name: string
  type: string
  totalBeds: number
  occupied: number
}

export const wards: Ward[] = [
  { id: "w1", name: "General Ward A", type: "General", totalBeds: 24, occupied: 18 },
  { id: "w2", name: "ICU", type: "Critical Care", totalBeds: 10, occupied: 8 },
  { id: "w3", name: "Maternity", type: "Obstetrics", totalBeds: 16, occupied: 9 },
  { id: "w4", name: "Pediatrics", type: "Children", totalBeds: 20, occupied: 11 },
  { id: "w5", name: "Surgical Ward", type: "Post-op", totalBeds: 18, occupied: 14 },
  { id: "w6", name: "Private Suites", type: "Private", totalBeds: 12, occupied: 5 },
]

export type Admission = {
  id: string
  patient: string
  mrn: string
  ward: string
  bed: string
  doctor: string
  admittedOn: string
  diagnosis: string
  status: "admitted" | "observation" | "critical"
}

export const admissions: Admission[] = [
  { id: "ad1", patient: "James Whitfield", mrn: "MRN-10235", ward: "Surgical Ward", bed: "S-07", doctor: "Dr. Marcus Chen", admittedOn: "2026-07-15", diagnosis: "Post knee replacement", status: "admitted" },
  { id: "ad2", patient: "Fatima Al-Rashid", mrn: "MRN-10238", ward: "ICU", bed: "ICU-03", doctor: "Dr. Aisha Bello", admittedOn: "2026-07-16", diagnosis: "Ischemic stroke", status: "critical" },
  { id: "ad3", patient: "Robert Mensah", mrn: "MRN-10243", ward: "General Ward A", bed: "A-12", doctor: "Dr. Thomas Reed", admittedOn: "2026-07-17", diagnosis: "Acute kidney injury", status: "observation" },
  { id: "ad4", patient: "Hana Suzuki", mrn: "MRN-10242", ward: "Maternity", bed: "M-05", doctor: "Dr. Thomas Reed", admittedOn: "2026-07-17", diagnosis: "Prenatal monitoring", status: "admitted" },
]

export type Staff = {
  id: string
  employeeNo: string
  name: string
  role: string
  department: string
  phone: string
  status: "active" | "on-leave" | "inactive"
}

export const staff: Staff[] = [
  { id: "s1", employeeNo: "EMP-0012", name: "Dr. Elena Vasquez", role: "Consultant Cardiologist", department: "Cardiology", phone: "+1 (555) 300-1120", status: "active" },
  { id: "s2", employeeNo: "EMP-0034", name: "Dr. Marcus Chen", role: "Orthopedic Surgeon", department: "Orthopedics", phone: "+1 (555) 300-2231", status: "active" },
  { id: "s3", employeeNo: "EMP-0051", name: "Nurse Grace Adeleke", role: "Head Nurse", department: "ICU", phone: "+1 (555) 300-3342", status: "active" },
  { id: "s4", employeeNo: "EMP-0067", name: "Dr. Aisha Bello", role: "Neurologist", department: "Neurology", phone: "+1 (555) 300-4453", status: "on-leave" },
  { id: "s5", employeeNo: "EMP-0079", name: "Samuel Ortiz", role: "Lab Technician", department: "Laboratory", phone: "+1 (555) 300-5564", status: "active" },
  { id: "s6", employeeNo: "EMP-0088", name: "Linda Park", role: "Pharmacist", department: "Pharmacy", phone: "+1 (555) 300-6675", status: "active" },
  { id: "s7", employeeNo: "EMP-0093", name: "Dr. Thomas Reed", role: "Physician", department: "General Medicine", phone: "+1 (555) 300-7786", status: "active" },
  { id: "s8", employeeNo: "EMP-0102", name: "Omar Haddad", role: "Billing Officer", department: "Administration", phone: "+1 (555) 300-8897", status: "inactive" },
  { id: "s9", employeeNo: "EMP-0110", name: "Dr. Abdul Sesay Junior", role: "Admin Doctor", department: "Administration", phone: "+1 (555) 300-9901", status: "active" },
  { id: "s10", employeeNo: "EMP-0111", name: "Dr. Abdul Daniel Sesay", role: "Admin Doctor", department: "Administration", phone: "+1 (555) 300-9902", status: "active" },
]

// Chart data
export const patientVisitsData = [
  { month: "Jan", visits: 820, admissions: 120 },
  { month: "Feb", visits: 932, admissions: 138 },
  { month: "Mar", visits: 901, admissions: 129 },
  { month: "Apr", visits: 1034, admissions: 156 },
  { month: "May", visits: 1120, admissions: 168 },
  { month: "Jun", visits: 1180, admissions: 172 },
  { month: "Jul", visits: 1290, admissions: 190 },
]

export const appointmentsByDay = [
  { day: "Mon", scheduled: 42, completed: 38 },
  { day: "Tue", scheduled: 51, completed: 47 },
  { day: "Wed", scheduled: 48, completed: 44 },
  { day: "Thu", scheduled: 56, completed: 50 },
  { day: "Fri", scheduled: 61, completed: 58 },
  { day: "Sat", scheduled: 34, completed: 30 },
  { day: "Sun", scheduled: 18, completed: 16 },
]

export const revenueData = [
  { month: "Jan", revenue: 184000 },
  { month: "Feb", revenue: 205000 },
  { month: "Mar", revenue: 198000 },
  { month: "Apr", revenue: 232000 },
  { month: "May", revenue: 261000 },
  { month: "Jun", revenue: 278000 },
  { month: "Jul", revenue: 312000 },
]

export const departmentDistribution = [
  { department: "Cardiology", patients: 320, fill: "var(--color-cardiology)" },
  { department: "Orthopedics", patients: 245, fill: "var(--color-orthopedics)" },
  { department: "Neurology", patients: 180, fill: "var(--color-neurology)" },
  { department: "General", patients: 410, fill: "var(--color-general)" },
  { department: "Others", patients: 290, fill: "var(--color-others)" },
]

export const labActivityData = [
  { month: "Jan", tests: 640 },
  { month: "Feb", tests: 712 },
  { month: "Mar", tests: 698 },
  { month: "Apr", tests: 810 },
  { month: "May", tests: 872 },
  { month: "Jun", tests: 910 },
  { month: "Jul", tests: 985 },
]

export const pharmacySalesData = [
  { month: "Jan", sales: 42000 },
  { month: "Feb", sales: 48500 },
  { month: "Mar", sales: 46000 },
  { month: "Apr", sales: 53200 },
  { month: "May", sales: 58900 },
  { month: "Jun", sales: 61200 },
  { month: "Jul", sales: 67400 },
]

export function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function initials(name: string) {
  return name
    .replace(/^(Dr\.|Nurse)\s+/i, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
