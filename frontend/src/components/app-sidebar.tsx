import * as React from "react"
import {
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  CopyIcon,
  GiftIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "behzad",
    role: "Job Seeker",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MailIcon className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{data.user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{data.user.role}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <a href="#">
                <LayoutDashboardIcon />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Referral Section */}
        <div className="mt-6 mx-3 rounded-lg border bg-card p-4 text-card-foreground shadow">
          <div className="text-center">
            <GiftIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="font-semibold text-sm mb-2">
              GET REWARDED FOR REFERRALS
            </div>
            <div className="text-muted-foreground text-xs mb-3">
              Refer friends to Reslink and earn credits when they sign up!
            </div>
            <Button variant="link" className="text-muted-foreground text-xs p-0 h-auto">
              More details
            </Button>
          </div>
        </div>

        {/* Copy Link Button */}
        <div className="mt-4 mx-3">
          <Button variant="outline" className="w-full">
            <span>Copy link</span>
            <CopyIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOutIcon />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
