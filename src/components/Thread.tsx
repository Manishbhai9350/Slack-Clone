import { XIcon } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import Message from "./Message";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useGetThread } from "@/features/thread/api/useGetThread";
import { useRef, useState } from "react";
import Editor from "./Editor";
import Quill, { Delta } from "quill";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { useParentId } from "@/features/thread/store/useParentId";
import { toast } from "sonner";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";

interface ThreadProps {
  message: Id<"messages">;
  onCancel: () => void;
}

const Thread = ({ message, onCancel }: ThreadProps) => {
  const workspaceId = useGetWorkspaceId();
  const ChannelId = useGetChannelId();

  const [parentId, setParentId] = useParentId();

  const { Data: CurrentMember } = UseCurrentMember({ workspaceId });
  const { Data: CurrentMessage } = useGetThread({
    id: message,
    parent: parentId,
  });


  const { mutate: CreateThread, IsPending: IsCreatingThread } =
    useCreateMessage();

      
  const {mutate:UpdateThread,IsPending:IsUpdatingThread} = useUpdateMessage() 

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
      UpdateThread({
        message:IsEdit,
        value:Message
      },{
        onSuccess(){
          toast.success("Thread Updated Successfully")
          setIsEdit(null)
          ImageInp.value = null;
          setForceRenderCount((prev) => prev + 1);
        },
        onError(){
          toast.success("Failed To Update Thread")
        },
        throwError:true
      })
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="message flex justify-between items-center h-12 px-2 py-2 border-b">
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
      <div className="threads flex-1 overscroll-y-scroll pl-2">
        {CurrentMessage &&
          CurrentMessage.threads &&
          CurrentMessage?.threads.map((thread, i) => {
            return (
              <Message
                id={thread!._id}
                IsCreating={IsCreating}
                setIsCreating={setIsCreating}
                setEditValue={setEditValue}
                isEdit={IsEdit}
                setEdit={setIsEdit}
                isAuthor={thread?.member?._id == CurrentMember?._id}
                image={thread.image || ""}
                creationTime={thread._creationTime}
                isCompact={false}
                authorName={thread?.user?.name || ""}
                authorImage={thread?.user?.image || ""}
                key={thread._creationTime}
                content={thread.message}
                updated={thread?.updated || null}
                reactions={thread?.reactions || []}
                isThread={true}
              />
            );
          })}
      </div>
      <div className="w-full h-fit flex justify-center">
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
