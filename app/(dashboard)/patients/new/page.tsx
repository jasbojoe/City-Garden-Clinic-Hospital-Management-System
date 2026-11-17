import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/hms/page-header'
import { PatientRegistrationForm } from '@/components/hms/patient-registration-form'
import { getRegistrationFacilities } from '@/lib/services/patients'

export const dynamic = 'force-dynamic'

export default async function NewPatientPage() {
  const result = await getRegistrationFacilities()

  return (
    <>
      <PageHeader title="Register New Patient" description="Create a secure patient record for an authorized facility.">
        <Button variant="outline" render={<Link href="/patients" />}>
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
      </PageHeader>
      {result.error ? (
        <Card>
          <CardHeader>
            <CardTitle>Patient registration unavailable</CardTitle>
            <CardDescription>{result.error.message}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Switch to configured Supabase mode and sign in with an active staff account that has patient registration permission. Demo data is never written as a real patient record.
          </CardContent>
        </Card>
      ) : result.data.length === 0 ? (
        <Card>
          <CardHeader><CardTitle>No authorized facility</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Your account cannot access an active facility for patient registration.</CardContent>
        </Card>
      ) : (
        <PatientRegistrationForm facilities={result.data} />
      )}
    </>
  )
}
