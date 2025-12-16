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
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { Skeleton } from "../ui/skeleton"

const SidebarSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => {
    return (
        <Sidebar collapsible="icon" variant="inset">

            {/* Header */}
            <SidebarHeader
                className={`flex items-center p-4 ${
                    isCollapsed ? "justify-center" : ""
                }`}
            >
                {isCollapsed ? (
                    <Skeleton className="w-8 h-8 rounded-full" />
                ) : (
                    <div className="flex items-center gap-2 w-full">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 flex-1 max-w-[120px]" />
                    </div>
                )}
            </SidebarHeader>

            {/* Content */}
            <SidebarContent>
                <SidebarGroup>

                    {/* Hide label when collapsed */}
                    {!isCollapsed && (
                        <SidebarGroupLabel>
                            <Skeleton className="h-4 w-32" />
                        </SidebarGroupLabel>
                    )}

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <SidebarMenuItem key={index}>
                                    {isCollapsed ? (
                                        <div className="flex justify-center py-2">
                                            <Skeleton className="w-6 h-6 rounded-md" />
                                        </div>
                                    ) : (
                                        <SidebarMenuButton asChild>
                                            <SidebarMenuSkeleton showIcon />
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {isCollapsed ? (
                            <div className="flex justify-center py-2">
                                <Skeleton className="w-7 h-7 rounded-md" />
                            </div>
                        ) : (
                            <SidebarMenuButton>
                                <Skeleton className="w-full h-8 rounded-sm" />
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default SidebarSkeleton
