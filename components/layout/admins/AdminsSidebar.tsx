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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRoleNavigation } from "@/hooks/useRoleNavigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronsUpDown, ChevronUp, LogOut, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter"
import SidebarSkeleton from "@/components/skeleton/SidebarSkeleton"
import SidebarError from "@/components/error/SidebarError"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminsSidebar() {
  const { user, signOut, isLoading, isError } = useAuth()
  const { sidebarNavLinks, getRoleLabel, getRoleIcon, getProfileLink } = useRoleNavigation(user?.role)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()

  if (!user || isLoading) {
    return <SidebarSkeleton isCollapsed={isCollapsed} />
  }

  if (isError) {
    return <SidebarError isCollapsed={isCollapsed} />
  }



  const RoleIcon = getRoleIcon(user?.role)


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
      <SidebarContent className="
       [&::-webkit-scrollbar]:w-0
        hover:[&::-webkit-scrollbar]:w-1.25
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-none
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-foreground
  "

      >

        <SidebarGroup>
          <SidebarGroupLabel>Your Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

              {sidebarNavLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      asChild
                      isActive={isActive}

                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 py-5"
                      >
                        {item.icon && <item.icon />}
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
          <SidebarMenuItem >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={"lg"} tooltip={"Account options"}>
                  <Avatar className="rounded-full relative size-8 flex items-center justify-center">
                    <AvatarImage
                      src={user?.avatar}
                      alt={`${user?.username} Avatar`}
                    />
                    <AvatarFallback className="text-lg text-[#E6E8EB]! font-semibold">
                      {user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="">
                    <p className="text-xs font-medium">{capitalizeFirstLetter(user.username)}</p>
                    <p className="text-[11px]">{user.email}</p>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-(--radix-popper-anchor-width)"
              >
                <DropdownMenuItem asChild>
                  <Link href={getProfileLink()} className="flex items-center">
                    <User /><span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => await signOut()}
                  variant="destructive"
                >
                  <LogOut /><span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
