import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '../app-sidebar';
import { SiteHeader } from '../site-header';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();

  const handleNewReslink = () => {
    navigate('/create-reslink');
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "15rem",
          "--header-height": "5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader onNewReslink={handleNewReslink} />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};