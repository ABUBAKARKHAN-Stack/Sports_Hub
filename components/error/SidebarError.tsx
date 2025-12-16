"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,

} from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { AlertOctagon, RotateCcw } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const SidebarError = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const {refetch} = useAuth()
    return (
        <Sidebar collapsible="icon" variant="inset">

            <SidebarHeader
                className={`flex items-center justify-center p-4 ${isCollapsed ? "" : "items-start"
                    }`}
            >
                {!isCollapsed ? (
                    <span className="text-sm font-medium text-destructive">
                        Failed to load
                    </span>
                ) : (
                    <span
                        className="text-destructive"
                        title="Failed to load data"
                    >
                        <AlertOctagon />
                    </span>
                )}
            </SidebarHeader>

            {/* Content */}
            <SidebarContent className="flex items-center justify-center px-4">
                {!isCollapsed ? (
                    <div className="text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Something went wrong while loading sidebar data.
                        </p>

                        <Button
                            onClick={() => refetch()}
                            variant={"outline"}
                        >
                            Retry
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={() => refetch()}
                        title="Retry"
                        variant={"destructive"}
                    >
                        <RotateCcw />
                    </Button>
                )}
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="flex items-center justify-center p-4">
                {!isCollapsed && (
                    <span className="text-xs text-muted-foreground">
                        Tap retry to try again
                    </span>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}

export default SidebarError