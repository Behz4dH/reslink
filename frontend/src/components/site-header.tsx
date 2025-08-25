import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface SiteHeaderProps {
  onNewReslink?: () => void
}

export function SiteHeader({ onNewReslink }: SiteHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-20 flex h-20 shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">CREATE A RESLINK</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={onNewReslink}
            className="bg-lime-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-lime-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            New Reslink
          </Button>
          
          <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-sm font-medium">
            BH
          </div>
        </div>
      </div>
    </header>
  )
}
