"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import type { FormEvent } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/hms/page-header"
import { departments } from "@/lib/data"

export default function NewPatientPage() {
  const router = useRouter()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    toast.success("Patient registered", {
      description: "The new patient record has been created.",
    })
    router.push("/patients")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PageHeader
        title="Register New Patient"
        description="Complete the form below to create a new patient record."
      >
        <Button
          type="button"
          variant="outline"
          render={<Link href="/patients" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <Button type="submit">
          <Save data-icon="inline-start" />
          Save Patient
        </Button>
      </PageHeader>

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
                  <Field>
                    <FieldLabel htmlFor="firstName">First name</FieldLabel>
                    <Input id="firstName" placeholder="Jane" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                    <Input id="lastName" placeholder="Doe" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="dob">Date of birth</FieldLabel>
                    <Input id="dob" type="date" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    <Select>
                      <SelectTrigger id="gender" className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="blood">Blood group</FieldLabel>
                    <Select>
                      <SelectTrigger id="blood" className="w-full">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="dept">Department</FieldLabel>
                    <Select>
                      <SelectTrigger id="dept" className="w-full">
                        <SelectValue placeholder="Assign department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Address</CardTitle>
              <CardDescription>How to reach the patient.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    <Input id="email" type="email" placeholder="jane@example.com" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="address">Residential address</FieldLabel>
                  <Textarea
                    id="address"
                    placeholder="Street, city, state, postal code"
                    rows={3}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical & Emergency</CardTitle>
              <CardDescription>
                Allergies and next-of-kin details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="allergies">Known allergies</FieldLabel>
                  <Input
                    id="allergies"
                    placeholder="e.g. Penicillin, Latex (comma separated)"
                  />
                  <FieldDescription>
                    Leave blank if there are no known allergies.
                  </FieldDescription>
                </Field>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="ecName">
                      Emergency contact name
                    </FieldLabel>
                    <Input id="ecName" placeholder="Contact full name" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="ecPhone">
                      Emergency contact phone
                    </FieldLabel>
                    <Input
                      id="ecPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance</CardTitle>
              <CardDescription>Coverage information.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="provider">Provider</FieldLabel>
                  <Select>
                    <SelectTrigger id="provider" className="w-full">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blueshield">BlueShield</SelectItem>
                      <SelectItem value="aetna">Aetna</SelectItem>
                      <SelectItem value="cigna">Cigna</SelectItem>
                      <SelectItem value="united">United</SelectItem>
                      <SelectItem value="none">Self-pay</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="policy">Policy number</FieldLabel>
                  <Input id="policy" placeholder="e.g. BS-4432" />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="bg-accent/40">
            <CardHeader>
              <CardTitle className="text-base">Before you save</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>Verify the patient&apos;s identity and contact details.</p>
              <p>An MRN will be generated automatically on save.</p>
              <p>You can edit these details later from the patient profile.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
