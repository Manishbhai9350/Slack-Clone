'use client'
import { useConversation } from "@/features/conversation/api/useConversation"
import ConversationPage from "@/features/conversation/components/conversationPage"
import { useGetOtherMemberId } from "@/features/conversation/hooks/useGetOtherMember"
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId"
import { AlertTriangle, Loader } from "lucide-react"
import { useEffect } from "react"

const Page = () => {
  const workspaceId = useGetWorkspaceId()
  const OtherMemberId = useGetOtherMemberId()
  const {Data:Conversation,mutate:GetConversation,IsPending} =  useConversation()

  useEffect(() => {
    GetConversation({
      otherMember:OtherMemberId,
      workspace:workspaceId
    })
  },[workspaceId,OtherMemberId,GetConversation])

  if(IsPending) {
    return <div className="w-full h-full flex justify-center items-center">
      <Loader className="size-6 animate-spin" />
    </div>
  }

  if(!Conversation) {
        return <div className="w-full h-full flex flex-col space-y-3 justify-center items-center">
          <AlertTriangle className="size-6" />
          <p>Unable To Find Workspace</p>
    </div>
  }

  return (
    <ConversationPage id={Conversation._id} />
  )
}

export default Page