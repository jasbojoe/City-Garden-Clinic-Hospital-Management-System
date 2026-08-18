"use client"

import { PageHeader } from "@/components/hms/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const notifications = [
  { id: "appts", label: "Appointment reminders", desc: "Notify staff before scheduled appointments." },
  { id: "labs", label: "Lab result alerts", desc: "Alert when critical lab results are ready." },
  { id: "stock", label: "Low stock warnings", desc: "Email pharmacy when items hit reorder level." },
  { id: "billing", label: "Payment receipts", desc: "Send patients a receipt after each payment." },
]

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, hospital details, and preferences."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="hospital">Hospital</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="text-lg">EV</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Change photo
                  </Button>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Full name</FieldLabel>
                    <Input defaultValue="Dr. Elena Vasquez" />
                  </Field>
                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <Input defaultValue="Consultant Cardiologist" />
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" defaultValue="e.vasquez@medicare.health" />
                  </Field>
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input defaultValue="+1 (555) 300-1120" />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hospital" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hospital details</CardTitle>
              <CardDescription>Facility information used across the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Hospital name</FieldLabel>
                  <Input defaultValue="MediCare General Hospital" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Timezone</FieldLabel>
                    <Select defaultValue="est">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern (EST)</SelectItem>
                        <SelectItem value="cst">Central (CST)</SelectItem>
                        <SelectItem value="pst">Pacific (PST)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Currency</FieldLabel>
                    <Select defaultValue="sle">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sle">SLE (Le)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input defaultValue="15 Circular Road, Freetown, Sierra Leone" />
                  <FieldDescription>Shown on invoices and patient documents.</FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => toast.success("Hospital details saved")}>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what the system alerts you about.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {notifications.map((n, i) => (
                <div key={n.id}>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium">{n.label}</p>
                      <p className="text-sm text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch defaultChecked={i < 3} />
                  </div>
                  {i < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => toast.success("Preferences saved")}>Save preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
