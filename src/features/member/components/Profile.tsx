import { Button } from "@/components/ui/button";
import { ChevronDown, Loader, MailIcon, TriangleAlert, XIcon } from "lucide-react";
import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/member/api/useGetmember";
import { useGetCurrentMember } from "../api/useGetCurrentMember";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GetProfileBackground } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUpdateMember } from "../api/useUpdateMember";
import { toast } from "sonner";
import UseConfirm from "@/components/hooks/useConfirm";
import { useRemoveMember } from "../api/useRemoveMember";
import UserIcon from "@/components/UserAvatar";

interface ProfileProps {
    onCancel:() => void;
    member:Id<'members'>;
}

const Profile = ({
    onCancel,
    member
}:ProfileProps) => {

  
  const workspaceId = useGetWorkspaceId()
  
  
  const {Data:Profile,IsLoading:IsProfileLoading} = useGetMember({id:member})
  const {Data:CurrentMember,IsLoading:CurrentMemberLoading} = useGetCurrentMember({workspace:workspaceId})
  const {mutate:UpdateMember,IsPending:IsUpdatingMember} = useUpdateMember()
  const {mutate:RemoveMember,IsPending:IsRemovingMember} = useRemoveMember()
  
  const [confirm,RoleConfirm] = UseConfirm()
  
  async function OnRole(role:'member' | 'admin'){
    if(!Profile?._id) return;
    const ok = await confirm()
    if(!ok || IsUpdatingMember) return;
    UpdateMember({
      member:Profile._id,
      role
    },{
      onSuccess() {
        toast.success('Member Role Updated Successfully')
      },
      onError(){
        
        toast.error('Failed To Update Member')
      },
      throwError:true
    })
  }

  async function OnRemoveMember(){
    if(!member) return;
    const ok = await confirm()
    if(!ok || IsUpdatingMember) return;
    RemoveMember({
      member
    },{
      onSuccess(){
        toast.success("Member Removed Successfully")
      },
      onError(){
        toast.error("Failed To Removed Member")
      }
    })
  }
  async function OnLeave(){
    if(!member) return;
    const ok = await confirm()
    if(!ok || IsUpdatingMember) return;
    RemoveMember({
      member
    },{
      onSuccess(){
        toast.success("Workspace Leaved Successfully")
      },
      onError(){
        toast.error("Failed To Leave Workspace")
      }
    })
  }
  
  if(IsProfileLoading || CurrentMemberLoading){
    return <div className="w-full h-full">
      <div className="profile shrink-0 flex justify-between items-center h-12 px-2 py-2 border-b">
        <h1>Profile</h1>
        <Button onClick={onCancel} variant="ghost">
          <XIcon />
        </Button>
      </div>
      <div className="flex-1 h-full  flex justify-center items-center">
        <Loader className="animate-spin size-6" />
      </div>
    </div>
  }

  if(!Profile) {
    return <div className="w-full h-full">
      <div className="profile shrink-0 flex justify-between items-center h-12 px-2 py-2 border-b">
        <h1>Profile</h1>
        <Button onClick={onCancel} variant="ghost">
          <XIcon />
        </Button>
      </div>
      <div className="flex-1 h-full  flex justify-center items-center gap-2">
        <TriangleAlert className="size-6" />
        <p>Unable To Find Profile</p>
      </div>
    </div>
  }

  return (
    <div className="w-full h-full">
      <RoleConfirm message="Updating User Role" title="Are you sure about updating users?" />
      <div className="profile shrink-0 flex justify-between items-center h-12 px-2 py-2 border-b">
        <h1>Profile</h1>
        <Button onClick={onCancel} variant="ghost">
          <XIcon />
        </Button>
      </div>
      <div className="w-full mt-5 px-2 flex flex-col gap-2">
        <div className="h-[256px] w-[256px] mx-auto">
          <UserIcon name={Profile?.user?.name || ''} image={Profile?.user?.image} />
        </div>
        {
          (CurrentMember && Profile && CurrentMember.role == 'admin' && Profile.role == 'member' && Profile._id !== CurrentMember._id) ? (
          <div className="flex mt-6 gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-1/2 flex items-center text-2xl h-12 capitalize" variant="default">
                  {Profile.role}
                  <ChevronDown className="size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup onValueChange={e => OnRole(e as 'member' | 'admin')} value={Profile?.role}>
                  <DropdownMenuRadioItem  value="member">
                    Member
                  </DropdownMenuRadioItem>
                  
                  <DropdownMenuRadioItem value="admin">
                    Admin
                  </DropdownMenuRadioItem>

                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={OnRemoveMember} className="w-1/2 flex items-center text-2xl h-12" variant="outline">
              Remove
            </Button>
          </div>
          ) : (CurrentMember && Profile && Profile.role == 'member' && Profile._id == CurrentMember._id) ? (
          <div className="flex mt-6">
            <Button onClick={OnLeave} className="w-full flex items-center text-2xl h-12" variant="outline">
              Leave
            </Button>
          </div>
          ) : (CurrentMember && Profile && CurrentMember.role == 'admin' && Profile._id !== CurrentMember._id) ? (
            <div className="flex mt-6 gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full flex items-center text-2xl h-12 capitalize" variant="default">
                  {Profile.role}
                  <ChevronDown className="size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup onValueChange={e => OnRole(e as 'member' | 'admin')} value={Profile?.role}>
                  <DropdownMenuRadioItem  value="member">
                    Member
                  </DropdownMenuRadioItem>
                  
                  <DropdownMenuRadioItem value="admin">
                    Admin
                  </DropdownMenuRadioItem>

                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          ) : null
        }
        <Separator />
        <h1 className="text-2xl font-semibold">Contact Information</h1>
        <div className="flex h-16 w-full p-2">
          <div className="h-full aspect-square bg-gray-300 text-white flex justify-center items-center rounded-md">
            <MailIcon />
          </div>
          <div className="flex flex-col px-2">
            <h1 className="text-semibold" >{Profile?.user?.name}</h1>
            <Link
              href={`mailto:${Profile?.user?.email}`}
              className="text-blue-500 hover:underline">{Profile?.user?.email}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
