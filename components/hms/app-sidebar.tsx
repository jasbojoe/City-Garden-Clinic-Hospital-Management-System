"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { navItems } from "@/components/hms/nav"
import { signOutAction } from "@/app/auth/actions"

export function AppSidebar({ profile }: { profile?: { name: string; role: string } }) {
  const pathname = usePathname()
  const name = profile?.name ?? "Dr. Elena Vasquez"
  const role = profile?.role ?? "Administrator"
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-1 py-1.5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card">
            <Image
              src="/images/city-garden-clinic-logo.png"
              alt="City Garden Clinic logo"
              width={36}
              height={36}
              className="size-9 object-contain"
              priority
            />
          </span>
          <span className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-foreground">
              City Garden Clinic
            </span>
            <span className="text-xs text-muted-foreground">
              Hospital Management System
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href))
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={name}
              render={
                <Link href="/settings">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">{role}</span>
                  </span>
                </Link>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={signOutAction} className="w-full">
              <SidebarMenuButton
                tooltip="Sign out"
                render={<button type="submit" />}
              >
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
