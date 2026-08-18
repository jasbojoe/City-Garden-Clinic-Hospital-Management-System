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
  { id: "p1", mrn: "MRN-10234", name: "Aminata Kamara", gender: "Female", age: 34, dob: "1991-03-12", phone: "+232 76 210 884", email: "aminata.kamara@example.sl", bloodGroup: "O+", status: "active", lastVisit: "2026-07-14", department: "Cardiology", address: "24 Circular Road, Freetown", allergies: ["Penicillin"], insurance: "NASSIT • NS-4432", emergencyContact: "Ibrahim Kamara • +232 76 210 110" },
  { id: "p2", mrn: "MRN-10235", name: "James Bangura", gender: "Male", age: 58, dob: "1967-11-02", phone: "+232 88 774 221", email: "james.bangura@example.sl", bloodGroup: "A-", status: "admitted", lastVisit: "2026-07-16", department: "Orthopedics", address: "17 Wilkinson Road, Aberdeen, Freetown", allergies: ["Sulfa drugs", "Latex"], insurance: "ICS • IC-9981", emergencyContact: "Mary Bangura • +232 88 774 665" },
  { id: "p3", mrn: "MRN-10236", name: "Isata Sesay", gender: "Female", age: 27, dob: "1998-06-25", phone: "+232 99 991 332", email: "isata.sesay@example.sl", bloodGroup: "B+", status: "active", lastVisit: "2026-07-12", department: "Dermatology", address: "9 Hill Station, Freetown", allergies: [], insurance: "Vult Health • VH-2214", emergencyContact: "Alusine Sesay • +232 99 991 778" },
  { id: "p4", mrn: "MRN-10237", name: "Mohamed Conteh", gender: "Male", age: 45, dob: "1980-09-18", phone: "+232 78 332 908", email: "mohamed.conteh@example.sl", bloodGroup: "AB+", status: "discharged", lastVisit: "2026-07-09", department: "General Medicine", address: "220 Kissy Road, Freetown", allergies: ["Aspirin"], insurance: "NASSIT • NS-7742", emergencyContact: "Fatmata Conteh • +232 78 332 114" },
  { id: "p5", mrn: "MRN-10238", name: "Fatmata Turay", gender: "Female", age: 62, dob: "1963-01-30", phone: "+232 30 445 662", email: "fatmata.turay@example.sl", bloodGroup: "O-", status: "admitted", lastVisit: "2026-07-17", department: "Neurology", address: "58 Bo Town Road, Bo", allergies: ["Iodine"], insurance: "ICS • IC-1123", emergencyContact: "Yusuf Turay • +232 30 445 220" },
  { id: "p6", mrn: "MRN-10239", name: "Daniel Koroma", gender: "Male", age: 39, dob: "1986-12-05", phone: "+232 76 660 443", email: "daniel.koroma@example.sl", bloodGroup: "A+", status: "active", lastVisit: "2026-07-15", department: "Cardiology", address: "134 Lumley Beach Road, Freetown", allergies: [], insurance: "Vult Health • VH-3321", emergencyContact: "Grace Koroma • +232 76 660 998" },
  { id: "p7", mrn: "MRN-10240", name: "Sia Lahai", gender: "Female", age: 51, dob: "1974-08-22", phone: "+232 88 220 773", email: "sia.lahai@example.sl", bloodGroup: "B-", status: "inactive", lastVisit: "2026-05-28", department: "Endocrinology", address: "76 Hangha Road, Kenema", allergies: ["Peanuts"], insurance: "NASSIT • NS-8890", emergencyContact: "Foday Lahai • +232 88 220 331" },
  { id: "p8", mrn: "MRN-10241", name: "Emmanuel Cole", gender: "Male", age: 23, dob: "2002-04-14", phone: "+232 99 118 224", email: "emmanuel.cole@example.sl", bloodGroup: "O+", status: "active", lastVisit: "2026-07-11", department: "Pulmonology", address: "301 Wellington, Freetown", allergies: [], insurance: "ICS • IC-5567", emergencyContact: "Nora Cole • +232 99 118 669" },
  { id: "p9", mrn: "MRN-10242", name: "Hawa Jalloh", gender: "Female", age: 30, dob: "1995-10-08", phone: "+232 76 909 112", email: "hawa.jalloh@example.sl", bloodGroup: "AB-", status: "active", lastVisit: "2026-07-13", department: "Obstetrics", address: "12 Congo Cross, Freetown", allergies: ["Codeine"], insurance: "Vult Health • VH-6674", emergencyContact: "Amadu Jalloh • +232 76 909 778" },
  { id: "p10", mrn: "MRN-10243", name: "Abu Mansaray", gender: "Male", age: 67, dob: "1958-02-19", phone: "+232 78 556 889", email: "abu.mansaray@example.sl", bloodGroup: "A+", status: "admitted", lastVisit: "2026-07-17", department: "Nephrology", address: "89 Makeni Highway, Makeni", allergies: ["Penicillin", "Shellfish"], insurance: "NASSIT • NS-2298", emergencyContact: "Adama Mansaray • +232 78 556 112" },
  { id: "p11", mrn: "MRN-10244", name: "Josephine Williams", gender: "Female", age: 42, dob: "1983-07-03", phone: "+232 30 332 447", email: "josephine.williams@example.sl", bloodGroup: "O+", status: "active", lastVisit: "2026-07-10", department: "Gastroenterology", address: "47 Murray Town, Freetown", allergies: [], insurance: "Vult Health • VH-4451", emergencyContact: "Marco Williams • +232 30 332 998" },
  { id: "p12", mrn: "MRN-10245", name: "Alhaji Kargbo", gender: "Male", age: 36, dob: "1989-05-27", phone: "+232 88 771 339", email: "alhaji.kargbo@example.sl", bloodGroup: "B+", status: "discharged", lastVisit: "2026-07-06", department: "Orthopedics", address: "63 Port Loko Road, Port Loko", allergies: ["Ibuprofen"], insurance: "ICS • IC-1183", emergencyContact: "Erin Kargbo • +232 88 771 774" },
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
  { id: "a1", patient: "Aminata Kamara", mrn: "MRN-10234", doctor: "Dr. Elena Vasquez", department: "Cardiology", date: "2026-07-18", time: "09:00", type: "Follow-up", status: "scheduled" },
  { id: "a2", patient: "Daniel Koroma", mrn: "MRN-10239", doctor: "Dr. Elena Vasquez", department: "Cardiology", date: "2026-07-18", time: "09:30", type: "Consultation", status: "checked-in" },
  { id: "a3", patient: "Isata Sesay", mrn: "MRN-10236", doctor: "Dr. Nadia Petrov", department: "Dermatology", date: "2026-07-18", time: "10:00", type: "New Patient", status: "scheduled" },
  { id: "a4", patient: "Emmanuel Cole", mrn: "MRN-10241", doctor: "Dr. Samuel Adeyemi", department: "Pulmonology", date: "2026-07-18", time: "10:45", type: "Follow-up", status: "completed" },
  { id: "a5", patient: "Josephine Williams", mrn: "MRN-10244", doctor: "Dr. Thomas Reed", department: "General Medicine", date: "2026-07-18", time: "11:15", type: "Consultation", status: "scheduled" },
  { id: "a6", patient: "James Bangura", mrn: "MRN-10235", doctor: "Dr. Marcus Chen", department: "Orthopedics", date: "2026-07-18", time: "13:00", type: "Post-op Review", status: "scheduled" },
  { id: "a7", patient: "Fatmata Turay", mrn: "MRN-10238", doctor: "Dr. Aisha Bello", department: "Neurology", date: "2026-07-18", time: "14:00", type: "Follow-up", status: "cancelled" },
  { id: "a8", patient: "Hawa Jalloh", mrn: "MRN-10242", doctor: "Dr. Thomas Reed", department: "Obstetrics", date: "2026-07-18", time: "15:15", type: "Prenatal Check", status: "scheduled" },
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
  { id: "q1", number: 12, patient: "Daniel Koroma", mrn: "MRN-10239", doctor: "Dr. Elena Vasquez", department: "Cardiology", waitingSince: "08:52", waitMinutes: 18, priority: "Normal", status: "in-consultation" },
  { id: "q2", number: 13, patient: "Aminata Kamara", mrn: "MRN-10234", doctor: "Dr. Elena Vasquez", department: "Cardiology", waitingSince: "09:05", waitMinutes: 25, priority: "Normal", status: "waiting" },
  { id: "q3", number: 14, patient: "Abu Mansaray", mrn: "MRN-10243", doctor: "Dr. Aisha Bello", department: "Neurology", waitingSince: "09:12", waitMinutes: 33, priority: "Urgent", status: "waiting" },
  { id: "q4", number: 15, patient: "Isata Sesay", mrn: "MRN-10236", doctor: "Dr. Nadia Petrov", department: "Dermatology", waitingSince: "09:20", waitMinutes: 12, priority: "Normal", status: "waiting" },
  { id: "q5", number: 16, patient: "Emmanuel Cole", mrn: "MRN-10241", doctor: "Dr. Samuel Adeyemi", department: "Pulmonology", waitingSince: "09:28", waitMinutes: 8, priority: "Normal", status: "waiting" },
  { id: "q6", number: 17, patient: "Fatmata Turay", mrn: "MRN-10238", doctor: "Dr. Aisha Bello", department: "Neurology", waitingSince: "09:31", waitMinutes: 45, priority: "Emergency", status: "waiting" },
  { id: "q7", number: 11, patient: "Josephine Williams", mrn: "MRN-10244", doctor: "Dr. Thomas Reed", department: "General Medicine", waitingSince: "08:40", waitMinutes: 0, priority: "Normal", status: "completed" },
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
  { id: "l1", patient: "James Bangura", mrn: "MRN-10235", test: "Complete Blood Count", category: "Hematology", requestedBy: "Dr. Marcus Chen", requestedAt: "2026-07-18 08:15", status: "pending", priority: "Urgent" },
  { id: "l2", patient: "Fatmata Turay", mrn: "MRN-10238", test: "MRI Brain", category: "Radiology", requestedBy: "Dr. Aisha Bello", requestedAt: "2026-07-18 08:40", status: "in-progress", priority: "Urgent" },
  { id: "l3", patient: "Daniel Koroma", mrn: "MRN-10239", test: "Lipid Profile", category: "Biochemistry", requestedBy: "Dr. Elena Vasquez", requestedAt: "2026-07-18 09:10", status: "pending", priority: "Routine" },
  { id: "l4", patient: "Abu Mansaray", mrn: "MRN-10243", test: "Kidney Function Test", category: "Biochemistry", requestedBy: "Dr. Thomas Reed", requestedAt: "2026-07-18 09:25", status: "pending", priority: "Routine" },
  { id: "l5", patient: "Aminata Kamara", mrn: "MRN-10234", test: "Troponin I", category: "Cardiac Markers", requestedBy: "Dr. Elena Vasquez", requestedAt: "2026-07-17 16:30", status: "completed", priority: "Urgent" },
  { id: "l6", patient: "Isata Sesay", mrn: "MRN-10236", test: "Skin Biopsy", category: "Pathology", requestedBy: "Dr. Nadia Petrov", requestedAt: "2026-07-17 14:20", status: "completed", priority: "Routine" },
  { id: "l7", patient: "Hawa Jalloh", mrn: "MRN-10242", test: "Glucose Tolerance", category: "Biochemistry", requestedBy: "Dr. Thomas Reed", requestedAt: "2026-07-17 11:05", status: "completed", priority: "Routine" },
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
  { id: "m1", name: "Amoxicillin 500mg", category: "Antibiotic", batch: "AMX-2291", stock: 420, reorderLevel: 100, expiry: "2027-04-30", unitPrice: 8.5 },
  { id: "m2", name: "Paracetamol 500mg", category: "Analgesic", batch: "PCM-8834", stock: 1280, reorderLevel: 300, expiry: "2027-11-15", unitPrice: 2 },
  { id: "m3", name: "Atorvastatin 20mg", category: "Cardiovascular", batch: "ATV-1120", stock: 64, reorderLevel: 80, expiry: "2026-09-20", unitPrice: 12 },
  { id: "m4", name: "Metformin 850mg", category: "Antidiabetic", batch: "MET-4471", stock: 540, reorderLevel: 150, expiry: "2027-02-28", unitPrice: 3.5 },
  { id: "m5", name: "Salbutamol Inhaler", category: "Respiratory", batch: "SLB-9902", stock: 38, reorderLevel: 50, expiry: "2026-08-10", unitPrice: 145 },
  { id: "m6", name: "Omeprazole 20mg", category: "Gastro", batch: "OMP-3345", stock: 210, reorderLevel: 100, expiry: "2027-06-05", unitPrice: 6.5 },
  { id: "m7", name: "Ibuprofen 400mg", category: "Analgesic", batch: "IBU-7788", stock: 92, reorderLevel: 120, expiry: "2026-12-01", unitPrice: 3 },
  { id: "m8", name: "Insulin Glargine", category: "Antidiabetic", batch: "INS-5521", stock: 26, reorderLevel: 40, expiry: "2026-07-29", unitPrice: 520 },
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
  { id: "rx1", patient: "Aminata Kamara", mrn: "MRN-10234", doctor: "Dr. Elena Vasquez", items: 3, status: "pending", time: "09:15" },
  { id: "rx2", patient: "Emmanuel Cole", mrn: "MRN-10241", doctor: "Dr. Samuel Adeyemi", items: 2, status: "pending", time: "10:50" },
  { id: "rx3", patient: "Isata Sesay", mrn: "MRN-10236", doctor: "Dr. Nadia Petrov", items: 1, status: "dispensed", time: "08:30" },
  { id: "rx4", patient: "Mohamed Conteh", mrn: "MRN-10237", doctor: "Dr. Thomas Reed", items: 4, status: "dispensed", time: "08:05" },
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
  { id: "INV-2041", patient: "Aminata Kamara", mrn: "MRN-10234", date: "2026-07-18", consultation: 250, laboratory: 450, medication: 120, admission: 0, total: 820, paid: 820, status: "paid", method: "Orange Money" },
  { id: "INV-2042", patient: "James Bangura", mrn: "MRN-10235", date: "2026-07-18", consultation: 350, laboratory: 600, medication: 180, admission: 4500, total: 5630, paid: 3000, status: "partial", method: "Insurance" },
  { id: "INV-2043", patient: "Isata Sesay", mrn: "MRN-10236", date: "2026-07-17", consultation: 250, laboratory: 500, medication: 60, admission: 0, total: 810, paid: 0, status: "unpaid", method: "—" },
  { id: "INV-2044", patient: "Fatmata Turay", mrn: "MRN-10238", date: "2026-07-17", consultation: 400, laboratory: 1800, medication: 220, admission: 6000, total: 8420, paid: 8420, status: "paid", method: "Insurance" },
  { id: "INV-2045", patient: "Daniel Koroma", mrn: "MRN-10239", date: "2026-07-16", consultation: 250, laboratory: 300, medication: 80, admission: 0, total: 630, paid: 300, status: "partial", method: "Cash" },
  { id: "INV-2046", patient: "Josephine Williams", mrn: "MRN-10244", date: "2026-07-16", consultation: 250, laboratory: 400, medication: 150, admission: 0, total: 800, paid: 800, status: "paid", method: "Afrimoney" },
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
  { id: "ad1", patient: "James Bangura", mrn: "MRN-10235", ward: "Surgical Ward", bed: "S-07", doctor: "Dr. Marcus Chen", admittedOn: "2026-07-15", diagnosis: "Post knee replacement", status: "admitted" },
  { id: "ad2", patient: "Fatmata Turay", mrn: "MRN-10238", ward: "ICU", bed: "ICU-03", doctor: "Dr. Aisha Bello", admittedOn: "2026-07-16", diagnosis: "Ischemic stroke", status: "critical" },
  { id: "ad3", patient: "Abu Mansaray", mrn: "MRN-10243", ward: "General Ward A", bed: "A-12", doctor: "Dr. Thomas Reed", admittedOn: "2026-07-17", diagnosis: "Acute kidney injury", status: "observation" },
  { id: "ad4", patient: "Hawa Jalloh", mrn: "MRN-10242", ward: "Maternity", bed: "M-05", doctor: "Dr. Thomas Reed", admittedOn: "2026-07-17", diagnosis: "Prenatal monitoring", status: "admitted" },
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
  { id: "s1", employeeNo: "EMP-0012", name: "Dr. Elena Vasquez", role: "Consultant Cardiologist", department: "Cardiology", phone: "+232 76 300 112", status: "active" },
  { id: "s2", employeeNo: "EMP-0034", name: "Dr. Marcus Chen", role: "Orthopedic Surgeon", department: "Orthopedics", phone: "+232 76 300 223", status: "active" },
  { id: "s3", employeeNo: "EMP-0051", name: "Nurse Grace Adeleke", role: "Head Nurse", department: "ICU", phone: "+232 88 300 334", status: "active" },
  { id: "s4", employeeNo: "EMP-0067", name: "Dr. Aisha Bello", role: "Neurologist", department: "Neurology", phone: "+232 88 300 445", status: "on-leave" },
  { id: "s5", employeeNo: "EMP-0079", name: "Samuel Ortiz", role: "Lab Technician", department: "Laboratory", phone: "+232 99 300 556", status: "active" },
  { id: "s6", employeeNo: "EMP-0088", name: "Linda Park", role: "Pharmacist", department: "Pharmacy", phone: "+232 99 300 667", status: "active" },
  { id: "s7", employeeNo: "EMP-0093", name: "Dr. Thomas Reed", role: "Physician", department: "General Medicine", phone: "+232 78 300 778", status: "active" },
  { id: "s8", employeeNo: "EMP-0102", name: "Omar Haddad", role: "Billing Officer", department: "Administration", phone: "+232 78 300 889", status: "inactive" },
  { id: "s9", employeeNo: "EMP-0110", name: "Dr. Abdul Sesay Junior", role: "Admin Doctor", department: "Administration", phone: "+232 76 300 990", status: "active" },
  { id: "s10", employeeNo: "EMP-0111", name: "Dr. Abdul Daniel Sesay", role: "Admin Doctor", department: "Administration", phone: "+232 76 300 991", status: "active" },
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
  { month: "Jan", revenue: 3680000 },
  { month: "Feb", revenue: 4100000 },
  { month: "Mar", revenue: 3960000 },
  { month: "Apr", revenue: 4640000 },
  { month: "May", revenue: 5220000 },
  { month: "Jun", revenue: 5560000 },
  { month: "Jul", revenue: 6240000 },
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
  { month: "Jan", sales: 840000 },
  { month: "Feb", sales: 970000 },
  { month: "Mar", sales: 920000 },
  { month: "Apr", sales: 1064000 },
  { month: "May", sales: 1178000 },
  { month: "Jun", sales: 1224000 },
  { month: "Jul", sales: 1348000 },
]

// Sierra Leonean Leone formatting, e.g. "SLE 1,250.00".
export function currency(value: number) {
  return `SLE ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}

// Compact Leone label for chart axes and tooltips, e.g. "SLE 4.2M".
export function currencyCompact(value: number) {
  return `SLE ${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`
}

// Realistic Sierra Leone payment methods used across the prototype.
export const paymentMethods = [
  "Cash",
  "Vult",
  "Orange Money",
  "Afrimoney",
  "Bank Transfer",
  "Insurance",
  "Corporate Account",
]

export function initials(name: string) {
  return name
    .replace(/^(Dr\.|Nurse)\s+/i, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

// ---------------------------------------------------------------------------
// Paper Record Migration
// ---------------------------------------------------------------------------

export type MigrationStatus =
  | "awaiting-scan"
  | "scanned"
  | "processing"
  | "needs-review"
  | "verified"
  | "rejected"
  | "completed"

export const migrationStatuses: { value: MigrationStatus; label: string }[] = [
  { value: "awaiting-scan", label: "Awaiting Scan" },
  { value: "scanned", label: "Scanned" },
  { value: "processing", label: "Processing" },
  { value: "needs-review", label: "Needs Review" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
]

export const documentCategories = [
  "Previous Consultation Notes",
  "Laboratory Results",
  "Prescription",
  "Referral",
  "Discharge Summary",
  "Admission Record",
  "Surgery Notes",
  "Nursing Notes",
  "Insurance Document",
  "Other",
]

export type MigrationRecord = {
  id: string
  patient: string
  mrn: string
  folderNo: string
  pages: number
  department: string
  category: string
  assignedStaff: string
  dateScanned: string | null
  status: MigrationStatus
}

export const migrationRecords: MigrationRecord[] = [
  { id: "MIG-5001", patient: "Aminata Kamara", mrn: "MRN-10234", folderNo: "PF-1987-0421", pages: 24, department: "Cardiology", category: "Previous Consultation Notes", assignedStaff: "Samuel Ortiz", dateScanned: "2026-07-15", status: "verified" },
  { id: "MIG-5002", patient: "James Bangura", mrn: "MRN-10235", folderNo: "PF-1990-1123", pages: 41, department: "Orthopedics", category: "Surgery Notes", assignedStaff: "Samuel Ortiz", dateScanned: "2026-07-16", status: "needs-review" },
  { id: "MIG-5003", patient: "Isata Sesay", mrn: "MRN-10236", folderNo: "PF-2001-3345", pages: 12, department: "Dermatology", category: "Laboratory Results", assignedStaff: "Linda Park", dateScanned: "2026-07-16", status: "scanned" },
  { id: "MIG-5004", patient: "Mohamed Conteh", mrn: "MRN-10237", folderNo: "PF-1979-8890", pages: 33, department: "General Medicine", category: "Discharge Summary", assignedStaff: "Omar Haddad", dateScanned: null, status: "awaiting-scan" },
  { id: "MIG-5005", patient: "Fatmata Turay", mrn: "MRN-10238", folderNo: "PF-1968-2214", pages: 58, department: "Neurology", category: "Admission Record", assignedStaff: "Samuel Ortiz", dateScanned: "2026-07-17", status: "processing" },
  { id: "MIG-5006", patient: "Daniel Koroma", mrn: "MRN-10239", folderNo: "PF-1995-6677", pages: 19, department: "Cardiology", category: "Prescription", assignedStaff: "Linda Park", dateScanned: "2026-07-17", status: "completed" },
  { id: "MIG-5007", patient: "Sia Lahai", mrn: "MRN-10240", folderNo: "PF-1972-4451", pages: 27, department: "Endocrinology", category: "Referral", assignedStaff: "Omar Haddad", dateScanned: "2026-07-14", status: "rejected" },
  { id: "MIG-5008", patient: "Emmanuel Cole", mrn: "MRN-10241", folderNo: "PF-2003-9982", pages: 8, department: "Pulmonology", category: "Nursing Notes", assignedStaff: "Samuel Ortiz", dateScanned: null, status: "awaiting-scan" },
  { id: "MIG-5009", patient: "Hawa Jalloh", mrn: "MRN-10242", folderNo: "PF-1996-1120", pages: 22, department: "Obstetrics", category: "Previous Consultation Notes", assignedStaff: "Linda Park", dateScanned: "2026-07-13", status: "verified" },
  { id: "MIG-5010", patient: "Abu Mansaray", mrn: "MRN-10243", folderNo: "PF-1959-7788", pages: 64, department: "Nephrology", category: "Admission Record", assignedStaff: "Samuel Ortiz", dateScanned: "2026-07-17", status: "needs-review" },
  { id: "MIG-5011", patient: "Josephine Williams", mrn: "MRN-10244", folderNo: "PF-1984-3390", pages: 15, department: "Gastroenterology", category: "Laboratory Results", assignedStaff: "Omar Haddad", dateScanned: "2026-07-16", status: "scanned" },
  { id: "MIG-5012", patient: "Alhaji Kargbo", mrn: "MRN-10245", folderNo: "PF-1989-5567", pages: 37, department: "Orthopedics", category: "Discharge Summary", assignedStaff: "Linda Park", dateScanned: "2026-07-12", status: "completed" },
]

// Simulated OCR extracted fields with confidence scores for the review screen.
export type ExtractedField = {
  key: string
  label: string
  value: string
  confidence: number
}

export const sampleExtractedFields: ExtractedField[] = [
  { key: "name", label: "Patient Full Name", value: "James Bangura", confidence: 98 },
  { key: "dob", label: "Date of Birth", value: "1967-11-02", confidence: 93 },
  { key: "gender", label: "Gender", value: "Male", confidence: 96 },
  { key: "phone", label: "Phone Number", value: "+232 88 774 221", confidence: 81 },
  { key: "address", label: "Address", value: "17 Wilkinson Road, Aberdeen, Freetown", confidence: 74 },
  { key: "blood", label: "Blood Group", value: "A-", confidence: 88 },
  { key: "allergies", label: "Allergies", value: "Sulfa drugs, Latex", confidence: 72 },
  { key: "chronic", label: "Chronic Conditions", value: "Osteoarthritis", confidence: 69 },
  { key: "medications", label: "Current Medications", value: "Ibuprofen 400mg", confidence: 61 },
  { key: "diagnosis", label: "Previous Diagnosis", value: "Right knee degeneration", confidence: 77 },
  { key: "surgery", label: "Previous Surgery", value: "Knee replacement (2025)", confidence: 84 },
  { key: "lastVisit", label: "Last Visit Date", value: "2026-07-16", confidence: 90 },
  { key: "emergency", label: "Emergency Contact", value: "Mary Bangura • +232 88 774 665", confidence: 79 },
]
