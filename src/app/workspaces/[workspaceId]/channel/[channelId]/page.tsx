"use client";

import Header from "./_components/Header";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useState } from "react";
import ChatInput from "@/app/workspaces/_components/ChatInput";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { useGetChannel } from "@/features/channels/api/useGetChannel";
import MessageList from "@/components/MessageList";
import { useGetMessages } from "@/features/messages/api/useGetMessages";


const ChannelPage = () => {

  const channelId = useGetChannelId()
  const { Data: ChannelData} = useGetChannel({
    id: channelId,
  })

  const [IsEdit, setIsEdit] = useState<Id<"messages"> | null>(null);
  const [EditValue, setEditValue] = useState<string>("");

  const [IsCreating, setIsCreating] = useState(false);

  const {messages} = useGetMessages({
    channel:channelId
  })

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

  


  return (
    <div className="w-full h-full flex flex-col">
      <Header name={ChannelData?.name} />
      <MessageList
        messages={messages}
        variant="messages"
        setIsEdit={setIsEdit}
        setEditValue={setEditValue}
        IsEdit={IsEdit}
      />
      <ChatInput
        IsCreating={IsCreating}
        setIsCreating={setIsCreating}
        updatePending={UpdatingMessage}
        onUpdateCancel={HandleUpdateCancel}
        onUpdate={HandleUpdate}
        isEdit={IsEdit}
        editValue={EditValue}
        variant="messages"
      />
    </div>
  );
};

export default ChannelPage;
