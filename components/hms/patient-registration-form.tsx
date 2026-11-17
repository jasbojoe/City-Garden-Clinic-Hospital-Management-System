'use client'

import { useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/hms/page-header'
import { registerPatientAction } from '@/app/(dashboard)/patients/actions'
import type { RegistrationFacility } from '@/lib/services/patients'

export function PatientRegistrationForm({ facilities }: { facilities: RegistrationFacility[] }) {
  const router = useRouter()
  const requestId = useRef<string | null>(null)
  const [facilityId, setFacilityId] = useState(facilities[0]?.id ?? '')
  const [gender, setGender] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return
    setIsSaving(true)
    requestId.current ??= crypto.randomUUID()

    const form = new FormData(event.currentTarget)
    const allergies = String(form.get('allergies') ?? '')
      .split(',')
      .map((allergy) => allergy.trim())
      .filter(Boolean)

    const result = await registerPatientAction({
      requestId: requestId.current,
      facilityId,
      firstName: form.get('firstName'),
      middleName: String(form.get('middleName') ?? '').trim() || undefined,
      lastName: form.get('lastName'),
      dateOfBirth: String(form.get('dob') ?? '') || undefined,
      dateOfBirthEstimated: false,
      gender: gender || undefined,
      phonePrimary: String(form.get('phone') ?? '').trim() || undefined,
      email: String(form.get('email') ?? '').trim() || undefined,
      addressLine1: String(form.get('address') ?? '').trim() || undefined,
      city: String(form.get('city') ?? '').trim() || undefined,
      region: String(form.get('region') ?? '').trim() || undefined,
      country: 'Sierra Leone',
      allergies,
      emergencyContactName: String(form.get('ecName') ?? '').trim() || undefined,
      emergencyContactPhone: String(form.get('ecPhone') ?? '').trim() || undefined,
    })

    setIsSaving(false)
    if (!result.ok) {
      toast.error('Patient was not registered', { description: result.message })
      return
    }

    if (result.possibleDuplicate) {
      toast.warning('Possible duplicate patient', {
        description: 'A patient with the same name already exists at this facility. Please verify the new record.',
      })
    } else {
      toast.success('Patient registered', { description: `MRN ${result.mrn}` })
    }
    router.push(`/patients/${result.patientId}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PageHeader title="Register New Patient" description="Create a secure patient record for the selected facility.">
        <Button type="button" variant="outline" render={<Link href="/patients" />}>
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <Button type="submit" disabled={isSaving || !facilityId}>
          <Save data-icon="inline-start" />
          {isSaving ? 'Saving…' : 'Save Patient'}
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Registration facility</CardTitle>
          <CardDescription>Access and patient records are scoped to this facility.</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="facility">Facility</FieldLabel>
            <Select value={facilityId} onValueChange={(value) => value && setFacilityId(value)}>
              <SelectTrigger id="facility" className="w-full sm:max-w-md">
                <SelectValue placeholder="Select a facility" />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>{facility.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic identifying details.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field><FieldLabel htmlFor="firstName">First name</FieldLabel><Input id="firstName" name="firstName" autoComplete="given-name" maxLength={100} required /></Field>
                  <Field><FieldLabel htmlFor="middleName">Middle name</FieldLabel><Input id="middleName" name="middleName" autoComplete="additional-name" maxLength={100} /></Field>
                  <Field><FieldLabel htmlFor="lastName">Last name</FieldLabel><Input id="lastName" name="lastName" autoComplete="family-name" maxLength={100} required /></Field>
                  <Field><FieldLabel htmlFor="dob">Date of birth</FieldLabel><Input id="dob" name="dob" type="date" /></Field>
                  <Field>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    <Select value={gender} onValueChange={(value) => value && setGender(value)}>
                      <SelectTrigger id="gender" className="w-full"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact &amp; Address</CardTitle><CardDescription>How to reach the patient.</CardDescription></CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field><FieldLabel htmlFor="phone">Phone number</FieldLabel><Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="+232 76 000 000" /></Field>
                  <Field><FieldLabel htmlFor="email">Email address</FieldLabel><Input id="email" name="email" type="email" autoComplete="email" maxLength={254} /></Field>
                </div>
                <Field><FieldLabel htmlFor="address">Residential address</FieldLabel><Textarea id="address" name="address" autoComplete="street-address" maxLength={500} rows={3} /></Field>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field><FieldLabel htmlFor="city">City / town</FieldLabel><Input id="city" name="city" autoComplete="address-level2" maxLength={120} /></Field>
                  <Field><FieldLabel htmlFor="region">Region</FieldLabel><Input id="region" name="region" autoComplete="address-level1" maxLength={120} /></Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Medical &amp; Emergency</CardTitle><CardDescription>Allergy warnings and next-of-kin details.</CardDescription></CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="allergies">Known allergies</FieldLabel>
                  <Input id="allergies" name="allergies" maxLength={1200} placeholder="e.g. Penicillin, Latex (comma separated)" />
                  <FieldDescription>Leave blank if there are no known allergies. Allergies are saved with the patient record.</FieldDescription>
                </Field>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field><FieldLabel htmlFor="ecName">Emergency contact name</FieldLabel><Input id="ecName" name="ecName" autoComplete="off" maxLength={160} /></Field>
                  <Field><FieldLabel htmlFor="ecPhone">Emergency contact phone</FieldLabel><Input id="ecPhone" name="ecPhone" type="tel" maxLength={40} /></Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Not yet connected</CardTitle><CardDescription>Additional patient modules are not included in this registry workflow.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>Blood group, insurance, and department assignments are not saved by patient registration yet.</p>
              <p>Clinical records remain unavailable in backend mode until their database workflows are connected.</p>
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader><CardTitle className="text-base">Before you save</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>Verify the patient&apos;s identity and contact details.</p>
              <p>An MRN is generated securely by the database on save.</p>
              <p>Retrying this submission will not create a duplicate patient.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
