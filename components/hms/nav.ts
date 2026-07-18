import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListOrdered,
  Stethoscope,
  FlaskConical,
  Pill,
  Receipt,
  BedDouble,
  UserCog,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Patients", href: "/patients", icon: Users },
  { title: "Appointments", href: "/appointments", icon: CalendarDays },
  { title: "Queue", href: "/queue", icon: ListOrdered },
  { title: "Consultations", href: "/consultations", icon: Stethoscope },
  { title: "Laboratory", href: "/laboratory", icon: FlaskConical },
  { title: "Pharmacy", href: "/pharmacy", icon: Pill },
  { title: "Billing", href: "/billing", icon: Receipt },
  { title: "Admissions", href: "/admissions", icon: BedDouble },
  { title: "Staff", href: "/staff", icon: UserCog },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
]
