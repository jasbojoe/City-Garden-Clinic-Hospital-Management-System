import Link from "next/link"
import { Download, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/hms/page-header"
import { PatientsTable } from "@/components/hms/patients-table"

export default function PatientsPage() {
  return (
    <>
      <PageHeader
        title="Patients"
        description="Search, filter, and manage patient records across all departments."
      >
        <Button variant="outline">
          <Download data-icon="inline-start" />
          Export
        </Button>
        <Button render={<Link href="/patients/new" />}>
          <UserPlus data-icon="inline-start" />
          Add Patient
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4 md:p-6">
          <PatientsTable />
        </CardContent>
      </Card>
    </>
  )
}
