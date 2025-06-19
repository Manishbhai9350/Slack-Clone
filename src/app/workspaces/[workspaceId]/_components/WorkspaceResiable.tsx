import { DropdownMenu, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable" 

export default function WorkspacePanel() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full h-full"
    >
      <ResizablePanel defaultSize={50} minSize={15} order={1} >
        <PanelSideBar />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} order={2} minSize={10} color="#313131"> 
        <div className="flex  items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>

    </ResizablePanelGroup>
  )
}




function PanelSideBar(){

    return (
        <div className="flex flex-col space-y-1 w-full h-full bg-yellow-500">
            <PanelSideBarHeader />
        </div>
    )
}


function PanelSideBarHeader(){
    return (
        <div className="header w-full px-2 flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuContent>
                    
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}