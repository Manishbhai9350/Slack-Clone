import { Loader, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useState } from "react";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetMembers } from "@/features/workspace/api/useGetMembers";
import { useRouter } from "next/navigation";


const WorkspaceNav = () => {

  const workspaceId = useGetWorkspaceId()
  const {Data:Channels,IsLoading:ChannelsLoading} = useGetChannels({workspaceId})
  const {Data:Members,IsLoading:MembersLoading} = useGetMembers({workspaceId})

  const [command,setCommand] = useState(false)

  const router = useRouter()

  function OnMemberSelect(member:string){
    setCommand(false)
    router.push(`/workspaces/${workspaceId}/member/${member}`)
  }
  function OnChannelSelect(channel:string){
    setCommand(false)
    router.push(`/workspaces/${workspaceId}/channel/${channel}`)
  }

  const IsLoading = ChannelsLoading || MembersLoading

  return (
    <nav className=" flex justify-center items-center  w-full h-[60px] text-slate-500 bg-slate-700">
      <div className="seachbar  flex items-center h-[40px] w-[80vw] md:max-w-[500px]">
        <div className="flex w-full h-full items-center gap-2">
          <Button onClick={() => setCommand(true)} className="w-full gap-2 flex items-center justify-center bg-white/70 text-slate-800 hover:bg-white/70 hover:text-slate-800">
            <Search className="size-5" /> 
            <p className="text-xl font-regular">Search</p>
          </Button>
          <CommandDialog open={command} onOpenChange={setCommand}>
            <CommandInput placeholder="Type a command or search..." />
            {
              IsLoading ? (
                <div className="w-full h-auto flex justify-center items-center">
                  <Loader className="animate-spin" />
                </div>
              ) : (
            <CommandList className="flex-1 overflow-y-scroll">
              <CommandEmpty>No results found.</CommandEmpty>
              {
                Channels && (
                  <CommandGroup heading="Channels">
                    {
                      Channels.map(channel => (
                        <CommandItem onSelect={() => OnChannelSelect(channel._id)} key={channel._id}>{channel.name}</CommandItem>
                      ))
                    }
                  </CommandGroup>
                )
              }
              {
                Members && (
                  <CommandGroup heading="Members">
                    {
                      Members.map(member => (
                        <CommandItem onSelect={() => OnMemberSelect(member._id)} key={member._id}>{member?.User?.name }</CommandItem>
                      ))
                    }
                  </CommandGroup>
                )
              }
            </CommandList>
              )
            }
          </CommandDialog>
        </div>
      </div>
    </nav>
  );
};

export default WorkspaceNav;
