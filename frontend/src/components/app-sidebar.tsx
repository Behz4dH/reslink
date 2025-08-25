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
      className="bg-blue-900 text-white border-r-0"
      {...props}
    >
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium">
            <MailIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-white font-medium">{data.user.name}</div>
            <div className="text-slate-400 text-sm">{data.user.role}</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="bg-lime-400 text-gray-900 hover:bg-lime-500 data-[active=true]:bg-lime-400 data-[active=true]:text-gray-900 rounded-lg px-4 py-3 font-medium"
            >
              <a href="#">
                <LayoutDashboardIcon className="h-5 w-5 text-gray-900" />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Referral Section */}
        <div className="mt-8 bg-blue-800 rounded-xl p-6">
          <div className="text-center">
            <GiftIcon className="h-6 w-6 mx-auto mb-2 text-white" />
            <div className="text-white font-bold text-sm mb-2">
              GET REWARDED FOR REFERRALS
            </div>
            <div className="text-slate-300 text-xs mb-3">
              Refer friends to Reslink and earn credits when they sign up!
            </div>
            <Button variant="link" className="text-slate-400 text-xs underline hover:text-slate-300 p-0 h-auto">
              More details
            </Button>
          </div>
        </div>

        {/* Copy Link Button */}
        <div className="mt-4">
          <Button 
            variant="secondary" 
            className="w-full bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50"
          >
            <span>Copy link</span>
            <CopyIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-6">
        <Button 
          variant="ghost" 
          className="text-white hover:text-gray-300 hover:bg-blue-800 justify-start p-0"
        >
          <LogOutIcon className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
