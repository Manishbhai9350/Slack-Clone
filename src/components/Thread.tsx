import { Loader, XIcon } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import Message from "./Message";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useGetThread } from "@/features/thread/api/useGetThread";
import { useRef, useState } from "react";
import Quill, { Delta } from "quill";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { useParentId } from "@/features/thread/store/useParentId";
import { toast } from "sonner";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";
import dynamic from "next/dynamic";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import MessageList from "./MessageList";

const Editor = dynamic(() => import("./Editor"), { ssr: false });


interface ThreadProps {
  message: Id<"messages">;
  onCancel: () => void;
}

const Thread = ({ message, onCancel }: ThreadProps) => {
  const workspaceId = useGetWorkspaceId();
  const ChannelId = useGetChannelId();

  const [parentId] = useParentId();

  const { Data: CurrentMember } = UseCurrentMember({ workspace:workspaceId });
  const { Data: CurrentMessage, IsLoading:IsCurrentMessageLoading } = useGetThread({
    id: message,
  });

  console.log(CurrentMessage,IsCurrentMessageLoading)

  const {
    messages: Threads,
    isLoading: IsMessagesLoading,
  } = useGetMessages({ channel: ChannelId, parent: parentId });

  console.log(Threads)


  const { mutate: CreateThread, IsPending: IsCreatingThread } =
    useCreateMessage();

  const { mutate: UpdateThread, IsPending: IsUpdatingThread } =
    useUpdateMessage();

  const [ForceRenderCount, setForceRenderCount] = useState(0);
  const [EditValue, setEditValue] = useState<string>("");
  const [IsEdit, setIsEdit] = useState<Id<"messages"> | null>(null);
  const [IsCreating, setIsCreating] = useState(false);

  const InnerRef = useRef<Quill | null>(null);

  function onUpdateCancel() {}

  function HandleSubmit(Value: Delta, ImageInp: HTMLInputElement) {
    if (!InnerRef.current) return;

    const Message = JSON.stringify(Value);

    // Editing Reply
    if (IsEdit) {
      UpdateThread(
        {
          message: IsEdit,
          value: Message,
        },
        {
          onSuccess() {
            toast.success("Thread Updated Successfully");
            setIsEdit(null);
            ImageInp.value = null;
            setForceRenderCount((prev) => prev + 1);
          },
          onError() {
            toast.success("Failed To Update Thread");
          },
          throwError: true,
        }
      );
      return;
    }

    // Creating A New Reply
    CreateThread(
      {
        workspace: workspaceId,
        message: Message,
        channel: ChannelId,
        parent: parentId,
      },
      {
        onSuccess() {
          toast.success("Reply Added");
          ImageInp.value = null;
          setForceRenderCount((prev) => prev + 1);
        },
        onError() {
          toast.success("Failed To Add Reply");
        },
        throwError: true,
      }
    );
  }

  if(IsMessagesLoading || IsCurrentMessageLoading) {
    return <div className="w-full h-full flex justify-center items-center" >
        <Loader className="size-6 animate-spin" />
      </div>
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="message shrink-0 flex justify-between items-center h-12 px-2 py-2 border-b">
        <h1># Threads</h1>
        <Button onClick={onCancel} variant="ghost">
          <XIcon />
        </Button>
      </div>
      {CurrentMessage && (
        <Message
          id={CurrentMessage!._id}
          IsCreating={IsCreating}
          setIsCreating={setIsCreating}
          setEditValue={setEditValue}
          isEdit={IsEdit}
          setEdit={setIsEdit}
          isAuthor={CurrentMessage?.member?._id == CurrentMember?._id}
          image={CurrentMessage.image || ""}
          creationTime={CurrentMessage._creationTime}
          isCompact={false}
          authorName={CurrentMessage?.user?.name || ""}
          authorImage={CurrentMessage?.user?.image || ""}
          key={CurrentMessage._creationTime}
          content={CurrentMessage.message}
          updated={CurrentMessage?.updated || null}
          reactions={CurrentMessage.reactions || []}
          isThread={true}

        />
      )}
      
      <MessageList
        messages={Threads}
        variant="threads"
        parent={CurrentMessage._id}
        setIsEdit={setIsEdit}
        setEditValue={setEditValue}
        isEdit={IsEdit}
      />
      <div className="w-full pb-2 px-2 h-fit flex justify-center">
        <Editor
          variant={IsEdit ? "update" : "create"}
          updateValue={EditValue}
          isEdit={IsEdit}
          key={ForceRenderCount}
          innerRef={InnerRef}
          disabled={IsCreatingThread || IsUpdatingThread}
          placeholder="Add A Reply..."
          onCancel={onUpdateCancel}
          onSubmit={HandleSubmit}
          noControl
        />
      </div>
    </div>
  );
};

export default Thread;
