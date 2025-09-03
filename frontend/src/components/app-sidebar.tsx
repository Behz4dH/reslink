import * as React from "react"
import {
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  CopyIcon,
  GiftIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  SettingsIcon,
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { UserProfileSheet } from "@/components/UserProfile/UserProfileSheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar 
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader>
        <UserProfileSheet>
          <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>
                {user?.username ? getUserInitials(user.username) : <UserIcon className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.username || 'User'}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.role === 'superuser' ? 'Admin' : 'Job Seeker'}
              </span>
            </div>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </UserProfileSheet>
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

      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleTheme}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOutIcon />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
