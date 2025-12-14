"use client"

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
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRoleNavigation } from "@/hooks/useRoleNavigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronUp, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter"

export function AdminsSidebar() {
  const { user, signOut } = useAuth()
  const { sidebarNavLinks, getRoleLabel, getRoleIcon, getProfileLink } = useRoleNavigation(user?.role)
  const RoleIcon = getRoleIcon(user?.role)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="inset">

      {/* Sidebar Header */}
      <SidebarHeader className={`flex flex-col items-start gap-1 p-4 transition-all ease-linear duration-600 ${isCollapsed ? "items-center" : ""}`}>
        <div className="flex items-center gap-2">
          {RoleIcon && <RoleIcon className="w-6 h-6" />}
          {!isCollapsed && (
            <span className="font-semibold text-lg">{getRoleLabel()}</span>
          )}
        </div>
      </SidebarHeader>


      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Your Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNavLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2"
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User /> {capitalizeFirstLetter(user?.username)}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-(--radix-popper-anchor-width)"
              >
                <DropdownMenuItem asChild>
                  <Link href={getProfileLink()} className="flex items-center">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => await signOut()}
                  variant="destructive"
                >
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
