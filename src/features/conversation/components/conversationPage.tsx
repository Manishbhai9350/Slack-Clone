import { AlertTriangle, Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetConversation } from "../api/useGetConversation";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import Header from "./ConversationHeader";
import { useGetMember } from "@/features/member/api/useGetmember";
import { useGetOtherMemberId } from "../hooks/useGetOtherMember";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";
import ChatInput from "@/app/workspaces/_components/ChatInput";
import MessageList from "@/components/MessageList";
import { useMemberProfileId } from "@/features/member/store/useParentId";

interface ConversationPageProps {
  id: Id<"conversations">;
}

const ConversationPage = ({ id }: ConversationPageProps) => {
  const { Data: Conversation, IsLoading: ConversationLoading } =
    useGetConversation({ id });
  const { messages, isLoading: MessagesLoading } = useGetMessages({
    conversation: id,
  });   
  const OtherMemberId = useGetOtherMemberId();
  const { Data: OtherMember } = useGetMember({ id: OtherMemberId });

  const [_,setProfileId] = useMemberProfileId()

  const [IsEdit, setIsEdit] = useState<Id<"messages"> | null>(null);
  const [EditValue, setEditValue] = useState<string>("");

  const [IsCreating, setIsCreating] = useState(false);

  const { mutate: UpdateMessage, IsPending: UpdatingMessage } =
    useUpdateMessage();

  function HandleUpdate(value: string) {
    if (!value || value.length == 0 || !IsEdit) return;
    UpdateMessage(
      {
        value,
        message: IsEdit,
      },
      {
        onSuccess() {
          toast.success("Message Updated Successfully");
          HandleUpdateCancel();
        },
        onError() {
          toast.error("Failed To Update Message");
        },
        throwError: true,
      }
    );
  }

  function HandleUpdateCancel() {
    setIsEdit(null);
    setEditValue("");
  }

  if (MessagesLoading || ConversationLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  if (!Conversation) {
    return (
      <div className="w-full h-full flex flex-col space-y-3 justify-center items-center">
        <AlertTriangle className="size-6" />
        <p>Unable To Find Workspace</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Header
        memberImage={OtherMember?.user?.image}
        name={OtherMember?.user?.name}
        onClick={() => setProfileId(OtherMember!._id)}
      />
      <MessageList
        messages={messages}
        variant="conversation"
        setIsEdit={setIsEdit}
        setEditValue={setEditValue}
        isEdit={IsEdit}
        conversation={id}
      />
      <ChatInput
        IsCreating={IsCreating}
        setIsCreating={setIsCreating}
        updatePending={UpdatingMessage}
        onUpdateCancel={HandleUpdateCancel}
        onUpdate={HandleUpdate}
        isEdit={IsEdit}
        editValue={EditValue}
        variant="conversation"
        conversation={Conversation._id}
      />
    </div>
  );
};

export default ConversationPage;
