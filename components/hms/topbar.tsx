"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Bell, ChevronDown, LogOut, Search, Settings, ShieldCheck, UserRound } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navItems } from "@/components/hms/nav"

function useTitle() {
  const pathname = usePathname()
  const match = navItems
    .filter((n) => pathname === n.href || pathname.startsWith(n.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]
  return match?.title ?? "Dashboard"
}

const dashboardRoles = ["Admin Doctor", "Reception", "Nurse", "Laboratory", "Pharmacy", "Billing"]

export function Topbar({ profile }: { profile?: { name: string; role: string } }) {
  const title = useTitle()
  const router = useRouter()
  const [role, setRole] = useState("Admin Doctor")
  const accountName = profile?.name ?? "Dr. Elena Vasquez"
  const accountRole = profile?.role ?? role
  const accountInitials = accountName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  async function handleSignOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Unable to sign out. Please try again.")
      return
    }
    router.replace("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground lg:inline-flex">
        <span className={`size-1.5 rounded-full ${profile ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        {profile ? 'Secure Staff Workspace' : 'Prototype Demo — Sample Data'}
      </span>

      <div className="ml-auto flex items-center gap-2">
        {!profile ? (
          <>
            <InputGroup className="hidden w-64 md:flex">
              <InputGroupInput placeholder="Search patients, records..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="hidden h-9 gap-2 px-3 sm:inline-flex" aria-label="Switch dashboard role">
                    <ShieldCheck data-icon="inline-start" />
                    <span>{role}</span>
                    <ChevronDown data-icon="inline-end" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>View as role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {dashboardRoles.map((option) => (
                    <DropdownMenuItem key={option} onClick={() => { setRole(option); toast.success(`Dashboard switched to ${option}`) }}>
                      <ShieldCheck />
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground"
              aria-label="Notifications"
            >
              <Bell />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-card" />
            </Button>
          </>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-9 gap-2 px-1.5"
                aria-label="Account menu"
              >
                <Avatar className="size-7">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    {accountInitials}
                    </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">
                  {accountName}
                </span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{profile ? accountRole : 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <UserRound />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
