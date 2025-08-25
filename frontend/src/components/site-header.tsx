import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface SiteHeaderProps {
  onNewReslink?: () => void
}

export function SiteHeader({ onNewReslink }: SiteHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-lg font-semibold">Reslinks</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={onNewReslink}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Reslink
          </Button>
          
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            BH
          </div>
        </div>
      </div>
    </header>
  )
}
